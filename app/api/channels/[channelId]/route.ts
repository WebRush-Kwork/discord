import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { channelId: string } }
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')
		const { channelId } = params
		const { name, type } = await req.json()

		if (!profile) return new NextResponse('Unauthorized', { status: 400 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		if (!channelId)
			return new NextResponse('Channel id is missing', { status: 400 })

		if (name === 'general')
			return new NextResponse('General channel can not be modified', {
				status: 400,
			})

		const server = await db.server.update({
			where: { id: serverId },
			data: {
				channels: {
					updateMany: {
						where: { id: channelId, NOT: { name: 'general' } },
						data: { name, type },
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('[CHANNEL_PATCH_ID]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { channelId: string } }
) {
	try {
		const profile = await currentProfile()
		const { searchParams } = new URL(req.url)
		const { channelId } = params
		const serverId = searchParams.get('serverId')

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		if (!channelId)
			return new NextResponse('Channel id is missing', { status: 400 })

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
					},
				},
			},
			data: {
				channels: {
					delete: { id: channelId, name: { not: 'general' } },
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log(error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
