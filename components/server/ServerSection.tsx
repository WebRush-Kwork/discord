'use client'
import { ChannelType, MemberRole } from '@prisma/client'
import NavigationTooltip from '@/components/navigation/NavigationTooltip'
import { Plus, Settings } from 'lucide-react'
import useModalStore from '@/hooks/useModalStore'
import { ServerSidebarWithMembersWithProfiles } from '@/types'

interface IServerSection {
	label: string
	role?: MemberRole
	channelType?: ChannelType
	sectionType: 'channels' | 'members'
	server: ServerSidebarWithMembersWithProfiles
}

const ServerSection = ({
	label,
	role,
	sectionType,
	channelType,
	server,
}: IServerSection) => {
	const { onOpen } = useModalStore()

	return (
		<div className='w-[90%] flex items-center justify-between'>
			<p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
				{label}
			</p>
			<div className='flex'>
				{role !== 'GUEST' && sectionType === 'channels' && (
					<NavigationTooltip
						label='Create A Channel'
						sidePosition='right'
						align='center'
					>
						<button
							className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition hover:bg-zinc-700 p-1 rounded-md'
							onClick={() => onOpen('createChannel', { server, channelType })}
						>
							<Plus className='w-4 h-4' />
						</button>
					</NavigationTooltip>
				)}
				{role === MemberRole.ADMIN && sectionType === 'channels' && (
					<NavigationTooltip
						label='Manage Members'
						sidePosition='right'
						align='center'
					>
						<button
							className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition hover:bg-zinc-700 p-1 rounded-md'
							onClick={() => onOpen('members', { server })}
						>
							<Settings className='w-4 h-4' />
						</button>
					</NavigationTooltip>
				)}
				{role === MemberRole.ADMIN && sectionType === 'members' && (
					<NavigationTooltip
						label='Manage Members'
						sidePosition='right'
						align='center'
					>
						<button
							className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition hover:bg-zinc-700 p-1 rounded-md'
							onClick={() => onOpen('members', { server })}
						>
							<Settings className='w-4 h-4' />
						</button>
					</NavigationTooltip>
				)}
			</div>
		</div>
	)
}

export default ServerSection
