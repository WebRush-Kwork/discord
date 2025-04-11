'use client'
import { Command, Search } from 'lucide-react'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

interface IServerSearch {
	data: {
		label: string
		type: 'channel' | 'member'
		appearance:
			| {
					icon: React.ReactNode
					name: string
					id: string
			  }[]
			| undefined
	}[]
}

const ServerSearch = ({ data }: IServerSearch) => {
	const [isSearchOpened, setIsSearchOpened] = useState<boolean>(false)
	const { push } = useRouter()
	const params = useParams()

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				setIsSearchOpened(prev => !prev)
			}
		}

		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	const onClick = ({
		id,
		type,
	}: {
		id: string
		type: 'channel' | 'member'
	}) => {
		setIsSearchOpened(false)

		if (type === 'member')
			return push(`/servers/${params.serverId}/conversations/${id}`)

		if (type === 'channel')
			return push(`/servers/${params.serverId}/channels/${id}`)
	}

	return (
		<>
			<div className='flex items-center justify-center'>
				<button
					className='group p-2 rounded-md flex items-center gap-x-2 w-[95%] hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
					onClick={() => setIsSearchOpened(true)}
				>
					<Search className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
					<p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
						Search
					</p>
					<kbd className='pointer-events-none inline-flex bg-muted h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
						<span className='text-xs'>
							<Command className='w-3 h-3' />
						</span>{' '}
						K
					</kbd>
				</button>
			</div>
			<CommandDialog open={isSearchOpened} onOpenChange={setIsSearchOpened}>
				<CommandInput placeholder='Search all channels and members' />
				<CommandList className='mb-2'>
					<CommandEmpty>No Results Found</CommandEmpty>
					{data.map(({ label, type, appearance }) => {
						if (!appearance) return null

						return (
							<CommandGroup key={label} heading={label}>
								{appearance.map(({ id, name, icon }) => (
									<CommandItem key={id} onSelect={() => onClick({ id, type })}>
										{icon}
										<span>{name}</span>
									</CommandItem>
								))}
							</CommandGroup>
						)
					})}
				</CommandList>
			</CommandDialog>
		</>
	)
}

export default ServerSearch
