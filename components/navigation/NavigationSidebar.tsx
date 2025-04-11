import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import NavigationAction from './NavigationAction'
import NavigationItem from './NavigationItem'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserButton } from '@clerk/nextjs'
import ToggleTheme from '@/components/ToggleTheme'

const NavigationSidebar = async () => {
	const profile = await currentProfile()

	if (!profile) return redirect('/')

	const servers = await db.server.findMany({
		where: { members: { some: { profileId: profile.id } } },
	})

	return (
		<div className='flex flex-col md:items-center h-full space-y-4 text-primary w-full bg-[#F2F3F5] border-r-1 dark:bg-[#1E1F22] py-3'>
			<NavigationAction />
			<Separator className='w-10 h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md' />
			<ScrollArea className='h-full'>
				{servers.map(server => (
					<div key={server.id} className='mb-4'>
						<NavigationItem
							{...{
								id: server.id,
								imageUrl: server.imageUrl,
								name: server.name,
							}}
						/>
					</div>
				))}
			</ScrollArea>
			<ToggleTheme />
			<UserButton
				appearance={{ elements: { avatarBox: '!w-[36px] !h-[36px]' } }}
			/>
		</div>
	)
}

export default NavigationSidebar
