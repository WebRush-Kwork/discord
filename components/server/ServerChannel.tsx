'use client'
import { cn } from '@/lib/utils'
import {
	Channel,
	ChannelType,
	Member,
	MemberRole,
	Server,
} from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import NavigationTooltip from '@/components/navigation/NavigationTooltip'
import useModalStore, { TModalStore } from '@/hooks/useModalStore'
import { ServerSidebarWithMembersWithProfiles } from '@/types'

interface IServerChannel {
	channel: Channel
	server: ServerSidebarWithMembersWithProfiles
	role?: MemberRole
}

const iconMap = {
	[ChannelType.TEXT]: (
		<Hash className='w-5 h-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
	),
	[ChannelType.AUDIO]: (
		<Mic className='w-5 h-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
	),
	[ChannelType.VIDEO]: (
		<Video className='w-5 h-5 flex-shrink-0 text-zinc-500 dark:text-zinc-400' />
	),
}

const ServerChannel = ({ channel, server, role }: IServerChannel) => {
	const params = useParams()
	const { onOpen } = useModalStore()
	const { push } = useRouter()

	const onClick = () => {
		push(`/servers/${server.id}/channels/${channel.id}`)
	}

	const onAction = (e: React.MouseEvent, action: TModalStore) => {
		e.stopPropagation()
		onOpen(action, { server, channel })
	}

	return (
		<div className='w-[90%]'>
			<button
				onClick={onClick}
				className={cn(
					'group p-2 rounded-md flex items-center justify-between w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer',
					params.channelId === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
				)}
			>
				<div className='flex items-center gap-x-2'>
					{iconMap[channel.type]}
					<p
						className={cn(
							'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
							params.channelId === channel.id &&
								'text-primary dark:text-zinc-200 dark:group-hover:text-white'
						)}
					>
						{channel.name}
					</p>
				</div>
				{channel.name !== 'general' && role !== MemberRole.GUEST && (
					<div className='flex items-center gap-x-2'>
						<NavigationTooltip label='Edit' sidePosition='top' align='center'>
							<Edit
								className='w-4 h-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
								onClick={e => onAction(e, 'editChannel')}
							/>
						</NavigationTooltip>
						<NavigationTooltip label='Delete' sidePosition='top' align='center'>
							<Trash
								className='w-4 h-4 hidden group-hover:block text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 transition'
								onClick={e => onAction(e, 'deleteChannel')}
							/>
						</NavigationTooltip>
					</div>
				)}
				{channel.name === 'general' && role !== MemberRole.GUEST && (
					<NavigationTooltip label={`'general' channel can not be modified`}>
						<Lock className='w-4 h-4 hidden group-hover:block transition' />
					</NavigationTooltip>
				)}
			</button>
		</div>
	)
}

export default ServerChannel
