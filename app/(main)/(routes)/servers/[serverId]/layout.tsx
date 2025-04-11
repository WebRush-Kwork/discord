import ServerSidebar from '@/components/server/ServerSidebar'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

const ServerIdLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode
	params: { serverId: string }
}) => {
	const profile = await currentProfile()
	const { serverId } = await params

	if (!profile) return redirect('/')

	const server = await db.server.findUnique({
		where: {
			id: serverId,
			members: { some: { profileId: profile.id } },
		},
	})

	if (!server) return redirect('/')

	return (
		<>
			<div className='max-sm:hidden md:flex flex-col h-full fixed inset-y-0 w-60 z-20'>
				<ServerSidebar serverId={serverId} />
			</div>
			<main className='h-full md:pl-60'>{children}</main>
		</>
	)
}

export default ServerIdLayout
