'use client'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useModalStore from '@/hooks/useModalStore'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useModalOrigin } from '@/hooks/useModalOrigin'
import { useState } from 'react'
import axios from 'axios'

const InvitePeopleModal = () => {
	const { data, isOpen, onClose, onOpen, type } = useModalStore()
	const { server } = data
	const origin = useModalOrigin()
	const isInvitePeopleModalOpen = isOpen && type === 'invite'
	const inviteUrl = `${origin}/invite/${server?.inviteCode}`
	const [isCopied, setIsCopied] = useState<boolean>(false)
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl)
		setIsCopied(true)

		setTimeout(() => {
			setIsCopied(false)
		}, 1000)
	}

	const onGenerateCode = async () => {
		try {
			setIsLoading(true)
			const response = await axios.patch(
				`/api/servers/${server?.id}/invite-code`
			)
			onOpen('invite', { server: response.data })
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
					<DialogTitle>Invite Friends</DialogTitle>
				</DialogHeader>
				<Label className='uppercase text-zinc-500 text-xs font-bold'>
					Server invite link
				</Label>
				<div className='flex justify-between items-center gap-2'>
					<div className='text-black dark:text-white bg-zinc-300/30 w-full p-2 rounded-md'>
						{inviteUrl}
					</div>
					<Button size='icon' onClick={onCopy} disabled={isLoading}>
						{isCopied ? (
							<Check className='w-4 h-4' />
						) : (
							<Copy className='w-4 h-4' />
						)}
					</Button>
				</div>
				<Button variant='link' disabled={isLoading} onClick={onGenerateCode}>
					Generate new link <RefreshCw className='w-4 h-4' />
				</Button>
			</DialogContent>
		</Dialog>
	)
}

export default InvitePeopleModal
