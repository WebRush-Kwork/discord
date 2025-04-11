import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { ChannelType, MemberRole } from '@prisma/client'
import { redirect } from 'next/navigation'
import ServerHeader from './ServerHeader'
import { ScrollArea } from '@/components/ui/scroll-area'
import ServerSearch from './ServerSearch'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './ServerSection'
import ServerChannel from './ServerChannel'
import ServerMember from './ServerMember'

interface IServerSidebar {
	serverId: string
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className='w-4 h-4' />,
	[ChannelType.AUDIO]: <Mic className='w-4 h-4' />,
	[ChannelType.VIDEO]: <Video className='w-4 h-4' />,
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: <ShieldCheck className='w-4 h-4 text-indigo-500' />,
	[MemberRole.ADMIN]: <ShieldAlert className='w-4 h-4 text-rose-500' />,
}

const ServerSidebar = async ({ serverId }: IServerSidebar) => {
	const profile = await currentProfile()

	if (!profile) return redirect('/')

	const server = await db.server.findUnique({
		where: { id: serverId },
		include: {
			channels: { orderBy: { createdAt: 'asc' } },
			members: { include: { profile: true }, orderBy: { role: 'asc' } },
		},
	})

	const textChannels = server?.channels.filter(
		channel => channel.type === ChannelType.TEXT
	)
	const audioChannels = server?.channels.filter(
		channel => channel.type === ChannelType.AUDIO
	)
	const videoChannels = server?.channels.filter(
		channel => channel.type === ChannelType.VIDEO
	)
	const members = server?.members.filter(
		member => member.profileId !== profile.id
	)

	if (!server) return redirect('/')

	const role = server.members.find(
		member => member.profileId === profile.id
	)?.role

	return (
		<div className='flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]'>
			<ServerHeader server={server} role={role} />
			<ScrollArea>
				<div className='mt-2'>
					<ServerSearch
						data={[
							{
								label: 'Text channels',
								type: 'channel',
								appearance: textChannels?.map(channel => ({
									id: channel.id,
									icon: iconMap[channel.type],
									name: channel.name,
								})),
							},
							{
								label: 'Voice channels',
								type: 'channel',
								appearance: audioChannels?.map(channel => ({
									id: channel.id,
									icon: iconMap[channel.type],
									name: channel.name,
								})),
							},
							{
								label: 'Video channels',
								type: 'channel',
								appearance: videoChannels?.map(channel => ({
									id: channel.id,
									icon: iconMap[channel.type],
									name: channel.name,
								})),
							},
							{
								label: 'Members',
								type: 'member',
								appearance: members?.map(member => ({
									id: member.id,
									icon: roleIconMap[member.role],
									name: member.profile.name,
								})),
							},
						]}
					/>
				</div>
				<Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
				{!!textChannels?.length && (
					<div className='flex flex-col mb-6'>
						<div className='mb-2 flex justify-center'>
							<ServerSection
								sectionType='channels'
								role={role}
								server={server}
								channelType={ChannelType.TEXT}
								label='Text Channels'
							/>
						</div>
						<div className='flex items-center flex-col justify-center gap-x-2'>
							{textChannels.map(channel => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									server={server}
									role={role}
								/>
							))}
						</div>
					</div>
				)}
				{!!audioChannels?.length && (
					<div className='flex flex-col mb-6'>
						<div className='mb-2 flex justify-center'>
							<ServerSection
								sectionType='channels'
								role={role}
								server={server}
								channelType={ChannelType.AUDIO}
								label='Voice Channels'
							/>
						</div>
						<div className='flex items-center flex-col justify-center gap-x-2'>
							{audioChannels.map(channel => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									server={server}
									role={role}
								/>
							))}
						</div>
					</div>
				)}
				{!!videoChannels?.length && (
					<div className='flex flex-col mb-6'>
						<div className='mb-2 flex justify-center'>
							<ServerSection
								sectionType='channels'
								role={role}
								channelType={ChannelType.VIDEO}
								server={server}
								label='Video Channels'
							/>
						</div>
						<div className='flex items-center flex-col justify-center gap-x-2'>
							{videoChannels.map(channel => (
								<ServerChannel
									key={channel.id}
									channel={channel}
									server={server}
									role={role}
								/>
							))}
						</div>
					</div>
				)}
				{!!members?.length && (
					<div className='flex flex-col mb-6'>
						<div className='mb-2 flex justify-center'>
							<ServerSection
								sectionType='members'
								role={role}
								server={server}
								label='Members'
							/>
						</div>
						<div className='flex items-center flex-col justify-center gap-x-2'>
							{members.map(member => (
								<ServerMember key={member.id} member={member} server={server} />
							))}
						</div>
					</div>
				)}
			</ScrollArea>
		</div>
	)
}

export default ServerSidebar
