import ChatHeader from '@/components/chat/ChatHeader'
import ChatInput from '@/components/chat/ChatInput'
import ChatMessages from '@/components/chat/ChatMessages'
import { getOrCreateConversation } from '@/lib/conversation'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

interface IMemberIdPage {
	params: {
		serverId: string
		memberId: string
	}
}

const MemberIdPage = async ({ params }: IMemberIdPage) => {
	const { memberId, serverId } = await params
	const profile = await currentProfile()

	if (!profile) return redirect('/')

	const member = await db.member.findFirst({
		where: { profileId: profile.id, serverId },
		include: { profile: true },
	})

	if (!member) return redirect('/')

	const memberOneId = member.id
	const memberTwoId = memberId

	const conversation = await getOrCreateConversation(memberOneId, memberTwoId)

	const otherMember =
		conversation?.memberOneId === member.id
			? conversation.memberTwo
			: conversation?.memberOne

	if (!otherMember || !conversation) return redirect('/')

	return (
		<div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
			<ChatHeader
				name={otherMember.profile.name}
				serverId={serverId}
				type='conversation'
				imageUrl={otherMember.profile.imageUrl}
			/>
			<ChatMessages
				member={member}
				name={otherMember.profile.name}
				chatId={conversation.id}
				type='conversation'
				apiUrl='/api/direct-messages'
				paramKey='conversationId'
				paramValue={conversation.id}
				socketUrl='/api/socket/direct-messages'
				socketQuery={{ conversationId: conversation.id }}
			/>
			<ChatInput
				chatType='conversation'
				name={otherMember.profile.name}
				apiUrl='/api/socket/direct-messages'
				query={{ conversationId: conversation.id }}
			/>
		</div>
	)
}

export default MemberIdPage
