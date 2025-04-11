import { Hash } from 'lucide-react'

interface IChatWelcome {
	type: 'conversation' | 'channel'
	name: string
}

const ChatWelcome = ({ name, type }: IChatWelcome) => {
	return (
		<div className='mb-4 px-2'>
			{type === 'channel' ? (
				<div className='h-[60px] w-[60px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center mb-4'>
					<Hash className='h-8 w-8 text-white' />
				</div>
			) : (
				<div></div>
			)}
			<p className='text-xl md:text-3xl font-bold mb-2'>
				{type === 'channel' && 'Welcome to #'}
				{name}
			</p>
			<p className='text-zinc-600 dark:text-zinc-400 text-sm'>
				{type === 'channel'
					? `This is the start of the #${name} channel.`
					: `This is the start of your conversation with ${name}.`}
			</p>
		</div>
	)
}

export default ChatWelcome
