import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextApiResponseSocketIO } from '@/types'
import { NextApiRequest } from 'next'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponseSocketIO
) {
	try {
		const profile = await currentProfile()
		const { conversationId } = req.query
		const { content, fileUrl } = req.body

		if (!profile) return res.status(401).json('Unauthorized')

		const conversation = await db.conversation.findFirst({
			where: { id: conversationId as string },
			include: {
				memberOne: { include: { profile: true } },
				memberTwo: { include: { profile: true } },
			},
		})

		if (!conversation) return res.status(404).json('Conversation not found')

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

		return res.status(200).json(message)
	} catch (error) {
		console.log(error)
	}
}
