'use client'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useModalStore from '@/hooks/useModalStore'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const DeleteServerModal = () => {
	const { data, isOpen, onClose, type } = useModalStore()
	const { server } = data
	const isInvitePeopleModalOpen = isOpen && type === 'deleteServer'
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const { refresh, push } = useRouter()

	const onClick = async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/servers/${server?.id}/delete`)

			onClose()
			refresh()
			push('/')
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
					<DialogTitle>Delete Server</DialogTitle>
					<DialogDescription className='text-center'>
						Are you sure you want to do this? <br />
						<span className='font-semibold text-indigo-500'>
							{server?.name}
						</span>{' '}
						<span className='text-rose-500'>will be permanently deleted.</span>
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

export default DeleteServerModal
