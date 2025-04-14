import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

type TInviteCodePage = {
	params: { inviteCode: string }
}

const InviteCodePage = async ({ params }: TInviteCodePage) => {
	const profile = await currentProfile()
	const { inviteCode } = params

	if (!profile || !inviteCode) return redirect('/')

	const existingServer = await db.server.findFirst({
		where: { inviteCode, members: { some: { profileId: profile.id } } },
	})

	if (existingServer) return redirect(`/servers/${existingServer.id}`)

	const server = await db.server.update({
		where: { inviteCode },
		data: { members: { create: [{ profileId: profile.id }] } },
	})

	if (server) return redirect(`/servers/${server.id}`)

	return null
}

export default InviteCodePage
