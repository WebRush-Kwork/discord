import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { DirectMessage } from '@prisma/client'
import { NextResponse } from 'next/server'

const MESSAGES_BATCH = 10

export async function GET(req: Request) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const conversationId = searchParams.get('conversationId')
		const cursor = searchParams.get('cursor')

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!conversationId)
			return new NextResponse('Conversation id is missing', { status: 400 })

		let messages: DirectMessage[] = []

		if (cursor) {
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				cursor: { id: cursor },
				where: {
					conversationId,
				},
				include: {
					member: { include: { profile: true } },
				},
				orderBy: { createdAt: 'desc' },
				skip: 1,
			})
		} else {
			messages = await db.directMessage.findMany({
				take: MESSAGES_BATCH,
				where: { conversationId },
				include: { member: { include: { profile: true } } },
				orderBy: { createdAt: 'desc' },
			})
		}

		let nextCursor = null

		if (messages.length === MESSAGES_BATCH) {
			nextCursor = messages[MESSAGES_BATCH - 1].id
		}

		return NextResponse.json({ items: messages, nextCursor })
	} catch (error) {
		console.log('[DIRECT_MESSAGES]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
