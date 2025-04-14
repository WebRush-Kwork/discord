'use client'
import { useUser } from '@clerk/nextjs'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

interface IMediaRoom {
	chatId: string
	isAudio: boolean
	isVideo: boolean
}

const MediaRoom = ({ chatId, isAudio, isVideo }: IMediaRoom) => {
	const { user } = useUser()
	const [token, setToken] = useState<string>('')

	useEffect(() => {
		if (!user?.firstName || !user.lastName) return

		const name = `${user.firstName} ${user.lastName}`

		;(async () => {
			try {
				const resp = await fetch(`/api/livekit?room=${chatId}&username=${name}`)
				const data = await resp.json()
				setToken(data.token)
			} catch (error) {
				console.log(error)
			}
		})()
	}, [user?.firstName, user?.lastName, chatId])

	if (!token)
		return (
			<div className='flex flex-col flex-1 justify-center items-center'>
				<Loader2 className='h-7 w-7 text-zinc-500 animate-spin my-4' />
				<p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
			</div>
		)

	return (
		<LiveKitRoom
			token={token}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			video={isVideo}
			audio={isAudio}
			connect={true}
			data-lk-theme='default'
		>
			<VideoConference />
		</LiveKitRoom>
	)
}

export default MediaRoom
