'use client'
import * as z from 'zod'
import axios from 'axios'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Member, MemberRole, Profile } from '@prisma/client'
import UserAvatar from '@/components/UserAvatar'
import NavigationTooltip from '@/components/navigation/NavigationTooltip'
import { Edit, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import useModalStore from '@/hooks/useModalStore'

interface IChatItem {
	id: string
	content: string
	member: Member & { profile: Profile }
	fileUrl: string | null
	timestamp: string
	isDeleted: boolean
	isUpdated: boolean
	socketUrl: string
	currentMember: Member
	socketQuery: Record<string, string>
}

const formSchema = z.object({
	content: z.string().min(1),
})

const ChatItem = ({
	id,
	content,
	isDeleted,
	isUpdated,
	member,
	socketQuery,
	socketUrl,
	timestamp,
	fileUrl,
	currentMember,
}: IChatItem) => {
	const roleIconMap = {
		GUEST: null,
		MODERATOR: <ShieldCheck className='w-4 h-4 ml-2 text-indigo-500' />,
		ADMIN: <ShieldAlert className='w-4 h-4 ml-2 text-rose-500' />,
	}

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			content,
		},
	})

	const { push } = useRouter()

	const [isEditing, setIsEditing] = useState<boolean>(false)
	const isAdmin = member.role === MemberRole.ADMIN
	const isModerator = member.role === MemberRole.MODERATOR
	const isMessageAuthor = member.id === currentMember.id
	const canMessageBeDeleted =
		!isDeleted && (isAdmin || isModerator || isMessageAuthor)
	const canMessageBeEdited = !isDeleted && isMessageAuthor && !fileUrl
	const { onOpen } = useModalStore()
	const params = useParams()
	const isLoading = form.formState.isSubmitting

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setIsEditing(false)
			} else if (e.key === 'Enter') {
				form.handleSubmit(onSubmit)
			}
		}

		window.addEventListener('keydown', onKeyDown)

		return () => window.removeEventListener('keydown', onKeyDown)
	}, [])

	useEffect(() => {
		form.reset({ content })
	}, [content])

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			const url = qs.stringifyUrl({
				url: `${socketUrl}/${id}`,
				query: socketQuery,
			})

			await axios.patch(url, values)
		} catch (error) {
			console.log(error)
		} finally {
			form.reset()
			setIsEditing(false)
		}
	}

	const redirectToMember = () =>
		currentMember.id !== member.id &&
		push(`/servers/${params?.serverId}/conversations/${member.id}`)

	return (
		<div className='flex flex-col w-full mb-6 hover:bg-black/10 p-4 rounded-lg transition relative group'>
			<div className='flex items-center gap-x-2 w-full mb-2'>
				<div
					className='flex items-center gap-x-2 cursor-pointer'
					onClick={redirectToMember}
				>
					<UserAvatar src={member.profile.imageUrl} />
					<span className='text-zinc-500 dark:text-zinc-400 cursor-pointer hover:underline transition font-semibold'>
						{member.profile.name}
					</span>
				</div>
				<NavigationTooltip label={member.role}>
					{roleIconMap[member.role]}
				</NavigationTooltip>
				<span className='text-xs text-zinc-500 dark:text-zinc-400 font-semibold'>
					{timestamp}
				</span>
			</div>
			{fileUrl && (
				<Link
					href={fileUrl}
					target='_blank'
					rel='noreferrer noopener'
					className='relative rounded-md bg-secondary h-48 w-48'
				>
					<Image src={fileUrl} alt={content} fill className='object-cover' />
				</Link>
			)}
			{!isEditing && !fileUrl ? (
				<p
					className={cn(
						'text-sm text-zinc-600 dark:text-zinc-300',
						isDeleted && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
					)}
				>
					{content}
					{isUpdated && !isDeleted && (
						<span className='mx-2 italic text-xs text-zinc-500 dark:text-zinc-400'>
							(edited)
						</span>
					)}
				</p>
			) : (
				!fileUrl &&
				isEditing && (
					<Form {...form}>
						<form
							className='pt-2 w-full'
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<div className='flex w-full'>
								<FormField
									name='content'
									control={form.control}
									render={({ field }) => (
										<FormItem className='w-full mr-2'>
											<FormControl>
												<Input
													className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-1 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 mb-4'
													placeholder='Edited message'
													{...field}
													disabled={isLoading}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<Button disabled={isLoading} size='sm' variant='primary'>
									Save
								</Button>
							</div>
							<span className='text-xs mt-1 text-zinc-400 font-semibold'>
								Press escape to cancel, enter to save
							</span>
						</form>
					</Form>
				)
			)}
			{canMessageBeDeleted && (
				<div className='hidden group-hover:block transition'>
					{canMessageBeEdited && (
						<NavigationTooltip label='Edit'>
							<Edit
								className='absolute top-2 right-3 p-1 cursor-pointer bg-white dark:bg-zinc-800 border rounded-sm w-8 h-8'
								onClick={() => setIsEditing(true)}
							/>
						</NavigationTooltip>
					)}
					<NavigationTooltip label='Delete'>
						<Trash
							className={cn(
								'absolute top-2 right-13 p-1 cursor-pointer bg-white dark:bg-zinc-800 border rounded-sm w-8 h-8 text-rose-500',
								(!isMessageAuthor || fileUrl) && 'right-3'
							)}
							onClick={() =>
								onOpen('deleteMessage', {
									apiUrl: `${socketUrl}/${id}`,
									query: socketQuery,
								})
							}
						/>
					</NavigationTooltip>
				</div>
			)}
		</div>
	)
}

export default ChatItem
