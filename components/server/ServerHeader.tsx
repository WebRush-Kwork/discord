'use client'
import { ServerSidebarWithMembersWithProfiles } from '@/types'
import { MemberRole } from '@prisma/client'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
	ChevronDown,
	LogOut,
	PlusCircle,
	Settings,
	Trash,
	UserPlus,
	Users,
} from 'lucide-react'
import useModalStore from '@/hooks/useModalStore'

interface IServerHeader {
	server: ServerSidebarWithMembersWithProfiles
	role?: MemberRole
}

const ServerHeader = ({ server, role }: IServerHeader) => {
	const isAdmin = role === MemberRole.ADMIN
	const isModerator = isAdmin || role === MemberRole.MODERATOR
	const { onOpen } = useModalStore()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='focus:outline-none' asChild>
				<div className='w-full font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
					{server.name} <ChevronDown className='h-5 w-5 ml-auto' />
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56 font-medium text-black dark:text-neutral-400 space-y-[2px]'>
				{isModerator && (
					<DropdownMenuItem
						className='text-indigo-600 dark:text-indigo-400 cursor-pointer'
						onClick={() => onOpen('invite', { server })}
					>
						Invite people <UserPlus className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => onOpen('editServer', { server })}
					>
						Server Settings <Settings className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
				{isAdmin && (
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => onOpen('members', { server })}
					>
						Manage members <Users className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
				{isModerator && (
					<DropdownMenuItem
						className='cursor-pointer'
						onClick={() => onOpen('createChannel', { server })}
					>
						Create channel <PlusCircle className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
				{isModerator && <DropdownMenuSeparator />}
				{isAdmin && (
					<DropdownMenuItem
						className='text-rose-500 cursor-pointer'
						onClick={() => onOpen('deleteServer', { server })}
					>
						Delete server <Trash className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
				{!isAdmin && (
					<DropdownMenuItem
						className='text-rose-500 cursor-pointer'
						onClick={() => onOpen('leaveServer', { server })}
					>
						Leave server <LogOut className='h-4 w-4 ml-auto' />
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default ServerHeader
