import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile()
		const { role } = await req.json()
		const { memberId } = params
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')

		if (!profile?.id) return new NextResponse('Unauthorized', { status: 401 })

		if (!memberId)
			return new NextResponse('Member id is missing', { status: 400 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		const server = await db.server.update({
			where: { id: serverId, profileId: profile?.id },
			data: {
				members: {
					update: {
						where: { id: memberId, profileId: { not: profile?.id } },
						data: {
							role,
						},
					},
				},
			},
			include: {
				members: { include: { profile: true }, orderBy: { role: 'asc' } },
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('[MEMBERS_ID_PATCH]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { memberId: string } }
) {
	try {
		const profile = await currentProfile()
		const { memberId } = params
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		const server = await db.server.update({
			where: { id: serverId, profileId: profile.id },
			data: {
				members: {
					delete: { id: memberId, profileId: { not: profile.id } },
				},
			},
			include: {
				members: { include: { profile: true }, orderBy: { role: 'asc' } },
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log(error)
	}
}
