import { currentProfilePages } from '@/lib/current-profile-pages'
import { db } from '@/lib/db'
import { NextApiResponseSocketIO } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseSocketIO
) {
	try {
		const profile = await currentProfilePages(req)
		const { conversationId } = req.query
		const { content, fileUrl } = req.body

		if (!profile) return res.status(401).json({ error: 'Unauthorized' })

		if (!conversationId)
			return res.status(400).json({ error: 'Conversation ID is missing' })

		if (!content) return res.status(400).json({ error: 'Content is missing' })

		const conversation = await db.conversation.findFirst({
			where: {
				id: conversationId as string,
				OR: [
					{ memberOne: { profileId: profile.id } },
					{ memberTwo: { profileId: profile.id } },
				],
			},
			include: {
				memberOne: { include: { profile: true } },
				memberTwo: { include: { profile: true } },
			},
		})

		if (!conversation)
			return res.status(404).json({ message: 'Conversation not found' })

		const member =
			conversation.memberOne.profileId === profile.id
				? conversation.memberOne
				: conversation.memberTwo

		const message = await db.directMessage.create({
			data: {
				conversationId: conversationId as string,
				memberId: member.id,
				content,
				fileUrl,
			},
			include: { member: { include: { profile: true } } },
		})

		const conversationKey = `chat:${conversationId}:messages`

		res.socket.server.io.emit(conversationKey, message)

		return res.status(200).json(message)
	} catch (error) {
		console.log('[DIRECT_MESSAGES_POST]', error)
		return res.status(500).json({ error: 'Internal error' })
	}
}
