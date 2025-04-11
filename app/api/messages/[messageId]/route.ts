import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { messageId: string } }
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')
		const channelId = searchParams.get('channelId')
		const { messageId } = await params
		const { content } = await req.json()

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		if (!channelId)
			return new NextResponse('Channel id is missing', { status: 400 })

		if (!messageId)
			return new NextResponse('Message id is missing', { status: 400 })

		const message = await db.message.update({
			where: {
				id: messageId,
				channelId,
			},
			data: { content },
			include: { member: { include: { profile: true } } },
		})

		return NextResponse.json(message)
	} catch (error) {
		console.log('[MESSAGES_PATCH]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
