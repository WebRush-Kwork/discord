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
import { UploadDropzone } from '@/lib/uploadthing'

const formSchema = z.object({
	name: z.string().min(1),
	imageUrl: z.string().min(1),
})

const InitialModal = () => {
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: '',
			imageUrl: '',
		},
	})
	const isLoading = form.formState.isSubmitting

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post('/api/servers', values)
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<Dialog open>
			<DialogContent className='fixed z-10'>
				<DialogHeader>
					<DialogTitle>Customize your server</DialogTitle>
					<DialogDescription>Give</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							name='imageUrl'
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Upload image</FormLabel>
									<FormControl>
										<FileUpload
											endpoint='serverImage'
											onChange={data => field.onChange(data.fileUrl)}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<div>
									<FormItem>
										<FormLabel>Server name</FormLabel>
										<FormControl>
											<Input {...field} className='mb-4' disabled={isLoading} />
										</FormControl>
									</FormItem>
									<FormMessage />
								</div>
							)}
						/>
						<DialogFooter>
							<Button disabled={isLoading}>Send</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default InitialModal
