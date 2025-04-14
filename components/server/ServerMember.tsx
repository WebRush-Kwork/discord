'use client'
import { Member, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'
import UserAvatar from '@/components/UserAvatar'

interface IServerMember {
	member: Member & { profile: Profile }
	server: Server
}

const ServerMember = ({ member, server }: IServerMember) => {
	const params = useParams()
	const { push } = useRouter()
	const roleIconMap = {
		GUEST: null,
		MODERATOR: <ShieldCheck className='w-4 h-4 ml-2 text-indigo-500' />,
		ADMIN: <ShieldAlert className='w-4 h-4 ml-2 text-rose-500' />,
	}

	const onClick = () => {
		push(`/servers/${server?.id}/conversations/${member.id}`)
	}

	return (
		<button
			className={cn(
				'flex items-center gap-x-2 w-[90%] rounded-md p-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 cursor-pointer',
				params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
			)}
			onClick={onClick}
		>
			<UserAvatar src={member.profile.imageUrl} className='w-8 h-8' />
			<p
				className={cn(
					'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
					params?.memberId === member.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white'
				)}
			>
				{member.profile.name}
			</p>
			<p>{roleIconMap[member.role]}</p>
		</button>
	)
}

export default ServerMember
