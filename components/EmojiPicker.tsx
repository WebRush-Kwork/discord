import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'

import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { Smile } from 'lucide-react'
import { useTheme } from 'next-themes'

interface IEmojiPicker {
	onChange: (value: string) => void
}

const EmojiPicker = ({ onChange }: IEmojiPicker) => {
	const { resolvedTheme } = useTheme()

	return (
		<Popover>
			<PopoverTrigger className='absolute right-4 top-[50%] !translate-y-[-50%] cursor-pointer'>
				<Smile className='text-zinc-500 dark:text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition' />
			</PopoverTrigger>
			<PopoverContent
				side='right'
				sideOffset={40}
				className='mb-16 bg-transparent shadow-none border-none drop-shadow-none'
			>
				<Picker
					data={data}
					onEmojiSelect={(emoji: any) => onChange(emoji.native)}
					theme={resolvedTheme}
				/>
			</PopoverContent>
		</Popover>
	)
}

export default EmojiPicker
