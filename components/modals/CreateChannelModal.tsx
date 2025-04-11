'use client'
import axios from 'axios'
import qs from 'query-string'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogFooter,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import useModalStore from '@/hooks/useModalStore'
import { ChannelType } from '@prisma/client'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { useEffect } from 'react'

const formSchema = z.object({
	name: z
		.string()
		.min(1, { message: 'Channel name is required.' })
		.refine(name => name !== 'general', {
			message: `Channel name can not be 'general'`,
		}),
	type: z.nativeEnum(ChannelType),
})

const CreateChannelModal = () => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', type: ChannelType.TEXT },
	})
	const isLoading = form.formState.isSubmitting
	const { refresh } = useRouter()
	const { isOpen, type, onClose, data } = useModalStore()
	const { server, channelType } = data
	const isModalOpen = isOpen && type === 'createChannel'

	useEffect(() => {
		if (channelType) return form.setValue('type', channelType)
	}, [form, channelType, isModalOpen])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: '/api/channels',
				query: { serverId: server?.id },
			})

			await axios.post(url, values)

			form.reset()
			refresh()
			onClose()
		} catch (error) {
			console.log(error)
		}
	}

	const handleClose = () => {
		form.reset()
		onClose()
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={handleClose}>
			<DialogContent className='absolute left-[50%] top-[50%] !translate-[-50%] gap-[2rem] z-20'>
				<DialogHeader>
					<DialogTitle>Create Channel</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='px-6'>
							<FormField
								name='name'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-[#a6a09b]'>
											Channel name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className='border-1 border-zinc-300/50 dark:text-white text-black mb-6'
												placeholder='Enter channel name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name='type'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-[#a6a09b]'>
											Channel type
										</FormLabel>
										<Select
											disabled={isLoading}
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className='bg-zinc-300/50 text-black dark:text-white capitalize w-full mb-6'>
													<SelectValue placeholder='Select channel type' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ChannelType).map(type => (
													<SelectItem value={type} key={type}>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button disabled={isLoading} variant='primary'>
								Create
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default CreateChannelModal
