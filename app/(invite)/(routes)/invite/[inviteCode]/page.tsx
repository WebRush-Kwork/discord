import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface IInviteCodePage {
	params: { inviteCode: string }
}

const InviteCodePage = async ({ params }: IInviteCodePage) => {
	const profile = await currentProfile()
	const { inviteCode } = await params

	if (!profile || !inviteCode) return redirect('/')

	const existingServer = await db.server.findFirst({
		where: { inviteCode, members: { some: { profileId: profile.id } } },
	})

	if (existingServer) return redirect(`/servers/${existingServer.id}`)

	const foundServer = await db.server.findFirst({ where: { inviteCode } })

	const server = await db.server.update({
		where: { id: foundServer?.id, inviteCode },
		data: { members: { create: [{ profileId: profile.id }] } },
	})

	if (server) return redirect(`/servers/${server.id}`)

	return null
}

export default InviteCodePage
