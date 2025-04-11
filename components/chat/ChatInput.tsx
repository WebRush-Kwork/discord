'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import qs from 'query-string'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import axios from 'axios'
import useModalStore from '@/hooks/useModalStore'
import EmojiPicker from '@/components/EmojiPicker'
import { useRouter } from 'next/navigation'

interface IChatInput {
	apiUrl: string
	query: Record<string, any>
	chatType: 'conversation' | 'channel'
	name: string
}

const messageSchema = z.object({
	content: z.string().min(1),
})

const ChatInput = ({ apiUrl, name, query, chatType }: IChatInput) => {
	const form = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: { content: '' },
	})
	const isLoading = form.formState.isSubmitting
	const { refresh } = useRouter()

	const onSubmit = async (values: z.infer<typeof messageSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl,
				query,
			})

			await axios.post(url, values)
			form.reset()
			refresh()
		} catch (error) {
			console.log(error)
		}
	}

	const { onOpen } = useModalStore()

	return (
		<Form {...form}>
			<form
				className='flex items-center justify-center'
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					name='content'
					control={form.control}
					render={({ field }) => (
						<FormItem className='w-[90%] relative mb-4'>
							<FormControl>
								<div>
									<Plus
										className='absolute top-[50%] !translate-y-[-50%] left-4 cursor-pointer bg-zinc-300 dark:bg-zinc-400 hover:bg-zinc-400 dark:hover:bg-zinc-300 transition rounded-full p-1 text-black'
										onClick={() => onOpen('messageFile', { apiUrl, query })}
									/>
									<Input
										placeholder={`Message ${
											chatType === 'conversation' ? name : `#${name}`
										}`}
										className='py-6 px-14 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
										disabled={isLoading}
										{...field}
									/>
									<EmojiPicker
										onChange={(emoji: string) =>
											field.onChange(`${field.value} ${emoji}`)
										}
									/>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default ChatInput
