import { Hash } from 'lucide-react'
import MobileToggle from '@/components/MobileToggle'
import UserAvatar from '@/components/UserAvatar'
import SocketIndicator from '@/components/SocketIndicator'

interface IChatHeader {
	serverId: string
	name: string
	type: 'channel' | 'conversation'
	imageUrl?: string
}

const ChatHeader = ({ name, imageUrl, serverId, type }: IChatHeader) => {
	return (
		<div className='text-md font-semibold px-6 flex justify-between items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
			<div className='flex items-center gap-x-2'>
				<MobileToggle serverId={serverId} />
				{type === 'channel' ? (
					<Hash className='text-zinc-500 dark:text-zinc-400 w-5 h-5' />
				) : (
					<UserAvatar src={imageUrl} className='mr-2 w-8 h-8' />
				)}
				<p className='font-semibold text-md text-black dark:text-white ml-1'>
					{name}
				</p>
			</div>
			<SocketIndicator />
		</div>
	)
}

export default ChatHeader
