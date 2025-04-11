'use client'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import FileUpload from '@/components/FileUpload'
import { useRouter } from 'next/navigation'
import useModalStore from '@/hooks/useModalStore'
import { useEffect } from 'react'

const formSchema = z.object({
	name: z.string().min(1, { message: 'Server name is required.' }),
	imageUrl: z.string().min(1, { message: 'Server image is required.' }),
})

const EditServerModal = () => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', imageUrl: '' },
	})

	const isLoading = form.formState.isSubmitting
	const { refresh } = useRouter()
	const { isOpen, type, onClose, data } = useModalStore()
	const { server } = data
	const isModalOpen = isOpen && type === 'editServer'

	useEffect(() => {
		if (server) {
			form.setValue('imageUrl', server.imageUrl)
			form.setValue('name', server.name)
		}
	}, [form, server])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/servers/${server?.id}`, values)

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
					<DialogTitle>Create your personalized server</DialogTitle>
					<DialogDescription>
						You can always change it later in settings
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='px-6 space-y-6'>
							<FormField
								name='imageUrl'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<FileUpload
												endpoint='serverImage'
												value={field.value}
												onChange={field.onChange}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								name='name'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-[#a6a09b]'>
											Server name
										</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												className='border-1 border-zinc-300/50 dark:text-white text-black mb-6'
												placeholder='Enter server name'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button disabled={isLoading} variant='primary'>
								Save
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default EditServerModal
