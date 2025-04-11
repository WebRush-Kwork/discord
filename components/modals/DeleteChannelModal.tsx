'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import qs from 'query-string'
import useModalStore from '@/hooks/useModalStore'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const DeleteChannelModal = () => {
	const { data, isOpen, onClose, type } = useModalStore()
	const { server, channel } = data
	const isInvitePeopleModalOpen = isOpen && type === 'deleteChannel'
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { refresh } = useRouter()

	const onClick = async () => {
		try {
			setIsLoading(true)

			const url = qs.stringifyUrl({
				url: `/api/channels/${channel?.id}`,
				query: {
					serverId: server?.id,
				},
			})

			await axios.delete(url)

			onClose()
			refresh()
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isInvitePeopleModalOpen} onOpenChange={onClose}>
			<DialogContent className='absolute left-[50%] top-[50%] !translate-[-50%] gap-[1rem] z-20'>
				<DialogHeader>
					<DialogTitle>Delete Channel</DialogTitle>
					<DialogDescription className='text-center'>
						Are you sure you want to do this? <br />
						<span className='text-rose-500 font-semibold text-xs'>
							#{channel?.name}
						</span>{' '}
						will be permanently delete
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className='px-6 py-4'>
					<div className='flex items-center justify-between w-full'>
						<Button disabled={isLoading} onClick={onClose} variant='ghost'>
							Cancel
						</Button>
						<Button disabled={isLoading} onClick={onClick} variant='primary'>
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteChannelModal
