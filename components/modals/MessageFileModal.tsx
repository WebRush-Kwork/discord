'use client'
import qs from 'query-string'
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
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/FileUpload'
import { useRouter } from 'next/navigation'
import useModalStore from '@/hooks/useModalStore'

const formSchema = z.object({
	fileUrl: z.string().min(1, { message: 'Attachment is required.' }),
	fileOriginalName: z
		.string()
		.min(1, { message: 'Attachment name is required.' }),
})

const MessageFileModal = () => {
	const { type, isOpen, onClose, data } = useModalStore()
	const { apiUrl, query } = data
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: { fileUrl: '', fileOriginalName: '' },
	})
	const isLoading = form.formState.isSubmitting
	const { refresh } = useRouter()
	const isMessageFilModalOpen = type === 'messageFile' && isOpen

	const handleOnClose = () => {
		form.reset()
		onClose()
	}

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: apiUrl || '',
				query,
			})

			await axios.post(url, {
				...values,
				content: values.fileUrl,
			})

			form.reset()
			refresh()
			handleOnClose()
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Dialog open={isMessageFilModalOpen} onOpenChange={handleOnClose}>
			<DialogContent className='bg-white text-black z-30 fixed top-[50%] right-[50%] !-translate-y-[50%] !translate-x-[50%]'>
				<DialogHeader className='py-6 px-4'>
					<DialogTitle className='text-2xl text-center text-bold'>
						Add an attachment
					</DialogTitle>
					<DialogDescription className='text-center text-zinc-500'>
						Send a file as a message
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className='px-6 space-y-6 mb-6'>
							<FormField
								name='fileUrl'
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<FileUpload
												endpoint='messageFile'
												value={field.value}
												onChange={({
													fileUrl,
													fileOriginalName,
												}: {
													fileUrl: string
													fileOriginalName: string
												}) => {
													form.setValue('fileUrl', fileUrl)
													form.setValue('fileOriginalName', fileOriginalName)
												}}
												fileOriginalName={form.getValues('fileOriginalName')}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<DialogFooter>
							<Button disabled={isLoading} variant='primary'>
								Send
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default MessageFileModal
