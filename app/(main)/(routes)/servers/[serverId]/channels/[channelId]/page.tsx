import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NextResponse } from 'next/server'

interface IChannelIdPage {
	params: {
		serverId: string
		channelId: string
	}
}

const ChannelIdPage = async ({ params }: IChannelIdPage) => {
	const profile = await currentProfile()
	const { channelId, serverId } = await params

	if (!profile) return new NextResponse('Unauthorized', { status: 401 })

	if (!channelId)
		return new NextResponse('Channel id is missing', { status: 400 })

	if (!serverId)
		return new NextResponse('Server id is missing', { status: 400 })

	const channel = await db.channel.findUnique({
		where: { id: channelId },
	})

	const member = await db.member.findFirst({
		where: { serverId, profileId: profile.id },
	})

	if (!channel || !member) redirect('/')

	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader name={channel.name} serverId={serverId} type='channel' />
			<ChatMessages
				member={member}
				name={channel.name}
				chatId={channelId}
				type='channel'
				apiUrl='/api/messages'
				socketUrl='/api/socket/messages'
				socketQuery={{
					channelId,
					serverId,
				}}
				paramKey='channelId'
				paramValue={channelId}
			/>
			<ChatInput
				name={channel.name}
				chatType='channel'
				query={{ channelId, serverId }}
				apiUrl='/api/socket/messages'
			/>
		</div>
	)
}

export default ChannelIdPage
