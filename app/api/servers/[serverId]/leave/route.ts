import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params }: { params: { serverId: string } }
) {
	try {
		const profile = await currentProfile()
		const { serverId } = params

		if (!profile) return new NextResponse('Unauthorized', { status: 401 })

		if (!serverId)
			return new NextResponse('Server id is missing', { status: 400 })

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: { not: profile.id },
				members: { some: { profileId: profile.id } },
			},
			data: { members: { deleteMany: { profileId: profile.id } } },
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('[SERVER_ID_ERROR]', error)
		return new NextResponse('Internal error', { status: 500 })
	}
}
