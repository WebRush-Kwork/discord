'use client'
import qs from 'query-string'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import useModalStore from '@/hooks/useModalStore'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/UserAvatar'
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react'
import { useState } from 'react'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import {
	DropdownMenu,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MemberRole } from '@prisma/client'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const ManageMembersModal = () => {
	const router = useRouter()
	const { data, isOpen, onClose, onOpen, type } = useModalStore()
	const [loadingId, setLoadingId] = useState<string>('')
	const { server } = data
	const isManageMembersModalOpen = isOpen && type === 'members'

	const roleIconMap = {
		GUEST: null,
		MODERATOR: <ShieldCheck className='w-4 h-4 ml-2 text-indigo-500' />,
		ADMIN: <ShieldAlert className='w-4 h-4 ml-2 text-rose-500' />,
	}

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId)

			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: { serverId: server?.id },
			})

			const response = await axios.delete(url)

			router.refresh()
			onOpen('members', { server: response.data })
		} catch (error) {
			console.log(error)
		} finally {
			setLoadingId('')
		}
	}

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId)

			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: { serverId: server?.id },
			})

			const response = await axios.patch(url, { role })

			router.refresh()
			onOpen('members', { server: response.data })
		} catch (error) {
			console.log(error)
		} finally {
			setLoadingId('')
		}
	}

	return (
		<Dialog open={isManageMembersModalOpen} onOpenChange={onClose}>
			<DialogContent className='absolute left-[50%] top-[50%] !translate-[-50%] gap-[1rem] z-20'>
				<DialogHeader>
					<DialogTitle>Manage members</DialogTitle>
					<DialogDescription className='text-zinc-500 text-center'>
						{server?.members?.length} Members
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className='mt-8 max-h-[420px] pr-6'>
					{server?.members?.map(member => (
						<div
							className='flex items-center justify-between mb-6'
							key={member.id}
						>
							<div>
								<div key={member.id} className='flex items-center gap-x-2 '>
									<UserAvatar src={member?.profile.imageUrl} />
									<div className='flex items-center text-xs font-semibold'>
										{member?.profile.name}
										{roleIconMap[member.role]}
									</div>
								</div>
								<p className='text-xs text-zinc-500 mt-2'>
									{member.profile.email}
								</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<DropdownMenu>
										<DropdownMenuTrigger>
											<MoreVertical className='w-4 h-4' />
										</DropdownMenuTrigger>
										<DropdownMenuContent side='left'>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className='flex items-center gap-x-2'>
													<ShieldQuestion className='w-4 h-4' />
													<span>Role</span>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent>
														<DropdownMenuItem
															className='flex items-center'
															onClick={() => onRoleChange(member.id, 'GUEST')}
														>
															<Shield className='w-4 h-4 mr-2' />
															Guest
															{member.role === 'GUEST' && (
																<Check className='w-4 h-4 ' />
															)}
														</DropdownMenuItem>
														<DropdownMenuItem
															className='flex items-center justify-between'
															onClick={() =>
																onRoleChange(member.id, 'MODERATOR')
															}
														>
															<ShieldCheck className='w-4 h-4 mr-2' />
															Moderator
															{member.role === 'MODERATOR' && (
																<Check className='w-4 h-4' />
															)}
														</DropdownMenuItem>
													</DropdownMenuSubContent>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className='text-rose-500'
												onClick={() => onKick(member.id)}
											>
												<Gavel className='w-4 h-4 text-rose-500' />
												Kick
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							{loadingId === member.id && (
								<Loader2 className='animate-spin w-4 h-4' />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}

export default ManageMembersModal
