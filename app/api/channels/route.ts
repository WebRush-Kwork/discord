import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

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

		const server = await db.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				channels: {
					deleteMany: { id: channelId },
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log(error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function POST(req: Request) {
	try {
		const profile = await currentProfile()
		const { name, type } = await req.json()
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		if (name === 'general')
			return new NextResponse(`Channel type can not be 'general'`, {
				status: 400,
			})

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
				channels: { create: { name, type, profileId: profile.id } },
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log(error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
