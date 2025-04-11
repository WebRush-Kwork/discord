import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

interface IMemberIdPage {
	params: { serverId: string }
}

const ServerPage = async ({ params }: IMemberIdPage) => {
	const profile = await currentProfile()
	const { serverId } = await params

	if (!profile) return new NextResponse('Unauthorized', { status: 401 })

	if (!serverId)
		return new NextResponse('Server id is missing', { status: 400 })

	const server = await db.server.findUnique({
		where: { id: serverId, members: { some: { profileId: profile.id } } },
		include: {
			channels: { where: { name: 'general' }, orderBy: { createdAt: 'asc' } },
		},
	})

	const initialServer = server?.channels[0]

	if (initialServer?.name !== 'general') return null

	return redirect(`/servers/${serverId}/channels/${initialServer.id}`)
}

export default ServerPage
