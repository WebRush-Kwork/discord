import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseSocketIO } from '@/types'
import { MemberRole } from '@prisma/client'
import { NextApiRequest } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseSocketIO
) {
	try {
		const profile = await currentProfilePages(req)
		const { messageId, channelId, serverId } = req.query
		const { content } = req.body

		if (!profile) return res.status(401).json({ error: 'Unauthorized' })

		if (!messageId) return res.status(400).json({ error: 'Message is missing' })

		if (!channelId)
			return res.status(400).json({ error: 'Channel id is missing' })

		if (!serverId)
			return res.status(400).json({ error: 'Server id is missing' })

		const server = await db.server.findFirst({
			where: {
				id: serverId as string,
				members: { some: { profileId: profile.id } },
			},
			include: { members: true },
		})

		if (!server) return res.status(404).json({ error: 'Server not found' })

		const channel = await db.channel.findFirst({
			where: { id: channelId as string, serverId: serverId as string },
		})

		if (!channel) return res.status(404).json({ error: 'Channel not found' })

		const member = server.members.find(
			member => member.profileId === profile.id
		)

		if (!member) return res.status(404).json({ error: 'Member not found' })

		let message = await db.message.findFirst({
			where: {
				id: messageId as string,
				channelId: channelId as string,
			},
		})

		if (!message || message.isDeleted)
			return res.status(404).json({ error: 'Message not found' })

		const isMessageAuthor = message.memberId === member.id
		const isAdmin = member.role === MemberRole.ADMIN
		const isModerator = member.role === MemberRole.MODERATOR
		const canModify = isMessageAuthor || isAdmin || isModerator

		if (!canModify) return res.status(401).json({ error: 'Unauthorized' })

		if (req.method === 'DELETE') {
			message = await db.message.update({
				where: { id: messageId as string, channelId: channelId as string },
				data: {
					fileUrl: null,
					content: 'This message was deleted.',
					isDeleted: true,
				},
				include: { member: { include: { profile: true } } },
			})
		} else if (req.method === 'PATCH') {
			if (!isMessageAuthor)
				return res.status(401).json({ error: 'Only message owner can edit' })

			message = await db.message.update({
				where: { id: messageId as string, channelId: channelId as string },
				data: { content },
				include: { member: { include: { profile: true } } },
			})
		}

		const updateKey = `chat:${channelId}:messages:update`
		res.socket.server.io.emit(updateKey, message)

		return res.status(200).json(message)
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: 'Internal error' })
	}
}
