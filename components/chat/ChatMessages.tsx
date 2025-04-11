'use client'
import { Member, Message, Profile } from '@prisma/client'
import ChatWelcome from './ChatWelcome'
import { useChatQuery } from '@/hooks/useChatQuery'
import { Loader2, ServerCrash } from 'lucide-react'
import ChatItem from './ChatItem'
import { format } from 'date-fns'
import { useChatSocket } from '@/hooks/useChatSocket'
import { useRef, ComponentRef } from 'react'
import { useChatScroll } from '@/hooks/useChatScroll'

interface IChatMessages {
	name: string
	member: Member
	chatId: string
	apiUrl: string
	socketUrl: string
	socketQuery: Record<string, string>
	paramKey: 'channelId' | 'conversationId'
	paramValue: string
	type: 'channel' | 'conversation'
}

type MessageWithMemberWithProfile = Message & {
	member: Member & { profile: Profile }
}

const ChatMessages = ({
	apiUrl,
	chatId,
	member,
	name,
	paramKey,
	paramValue,
	socketQuery,
	socketUrl,
	type,
}: IChatMessages) => {
	const queryKey = `chat:${chatId}`
	const addKey = `chat:${chatId}:messages`
	const updateKey = `chat:${chatId}:messages:update`
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({ apiUrl, paramKey, paramValue, queryKey })

	const chatRef = useRef<ComponentRef<'div'>>(null)
	const bottomRef = useRef<ComponentRef<'div'>>(null)

	useChatSocket({ addKey, queryKey, updateKey })
	useChatScroll({
		chatRef,
		bottomRef,
		loadMore: fetchNextPage,
		shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
		count: data?.pages?.[0]?.items?.length ?? 0,
	})

	const dateFormat = 'd MMM yyyy, HH:mm'

	if (status === 'pending') {
		return (
			<div className='flex flex-1 flex-col items-center justify-center'>
				<Loader2 className='animate-spin my-2 w-8 h-8 text-zinc-500' />
				<p className='text-sm text-zinc-500 dark:text-zinc-400'>
					Loading messages...
				</p>
			</div>
		)
	} else if (status === 'error') {
		return (
			<div className='flex flex-1 flex-col items-center justify-center'>
				<ServerCrash className='my-2 w-8 h-8 text-zinc-500' />
				<p className='text-sm text-rose-500 dark:text-rose-400'>
					Something went wrong!
				</p>
			</div>
		)
	}

	return (
		<div className='flex justify-center items-center h-full' ref={chatRef}>
			<div className='w-[90%] h-full'>
				<div className='flex flex-col py-4 overflow-y-auto h-full'>
					{!hasNextPage && (
						<>
							<div className='flex-1 h-full' />
							<ChatWelcome type={type} name={name} />
						</>
					)}
					{hasNextPage && (
						<div className='flex justify-center'>
							{isFetchingNextPage ? (
								<div className='flex items-center justify-center flex-col'>
									<Loader2 className='animate-spin my-4 w-6 h-6 text-zinc-500' />
									<span className='text-zinc-500 text-xs font-semibold'>
										Loading...
									</span>
								</div>
							) : (
								<button
									className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition'
									onClick={() => fetchNextPage()}
								>
									Load previous messages
								</button>
							)}
						</div>
					)}
					<>
						{data?.pages.map((group, index) => (
							<div key={index} className='flex flex-col-reverse'>
								{group.items.map((message: MessageWithMemberWithProfile) => (
									<ChatItem
										key={message.id}
										id={message.id}
										content={message.content}
										fileUrl={message.fileUrl}
										isDeleted={message.isDeleted}
										timestamp={format(new Date(message.createdAt), dateFormat)}
										isUpdated={message.updatedAt !== message.createdAt}
										socketUrl={socketUrl}
										socketQuery={socketQuery}
										member={message.member}
										currentMember={member}
									/>
								))}
							</div>
						))}
					</>
				</div>
			</div>
			<div ref={bottomRef} />
		</div>
	)
}

export default ChatMessages
