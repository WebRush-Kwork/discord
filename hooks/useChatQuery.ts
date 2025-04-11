'use client'
import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSocket } from '@/components/providers/socket-provider'

interface IChatQuery {
	queryKey: string
	apiUrl: string
	paramKey: 'channelId' | 'conversationId'
	paramValue: string
}

export const useChatQuery = ({
	apiUrl,
	paramKey,
	paramValue,
	queryKey,
}: IChatQuery) => {
	const { isConnected } = useSocket()

	const fetchMessages = async ({ pageParam = undefined }) => {
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					cursor: pageParam,
					[paramKey]: paramValue,
				},
			},
			{ skipNull: true }
		)

		const response = await fetch(url)
		return response.json()
	}

	const { data, isFetchingNextPage, hasNextPage, fetchNextPage, status } =
		useInfiniteQuery({
			queryKey: [queryKey],
			initialPageParam: undefined,
			queryFn: fetchMessages,
			getNextPageParam: lastPage => lastPage?.nextCursor,
			refetchInterval: isConnected ? false : 1000,
		})

	return { data, isFetchingNextPage, fetchNextPage, status, hasNextPage }
}
