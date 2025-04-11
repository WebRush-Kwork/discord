import { Channel, ChannelType, Member, Profile, Server } from '@prisma/client'
import { create } from 'zustand'

export type TModalStore =
	| 'createServer'
	| 'editServer'
	| 'createChannel'
	| 'invite'
	| 'members'
	| 'leaveServer'
	| 'deleteServer'
	| 'deleteChannel'
	| 'editChannel'
	| 'messageFile'
	| 'deleteMessage'

interface IModalData {
	server?: Server & { members: (Member & { profile: Profile })[] }
	channelType?: ChannelType
	channel?: Channel
	apiUrl?: string
	query?: Record<string, any>
}

interface IModalStore {
	type: TModalStore | null
	data: IModalData
	isOpen: boolean
	onOpen: (type: TModalStore, data?: IModalData) => void
	onClose: () => void
}

const useModalStore = create<IModalStore>(set => ({
	type: null,
	data: {},
	isOpen: false,
	onOpen: (type, data = {}) => set({ type, isOpen: true, data }),
	onClose: () => set({ type: null, isOpen: false }),
}))

export default useModalStore
