'use client'
import CreateServerModal from '@/components/modals/CreateServerModal'
import InvitePeopleModal from '@/components/modals/InvitePeopleModal'
import EditServerModal from '@/components/modals/EditServerModal'
import ManageMembersModal from '@/components/modals/ManageMembersModal'
import CreateChannelModal from '@/components/modals/CreateChannelModal'
import LeaveServerModal from '@/components/modals/LeaveServerModal'
import DeleteServerModal from '@/components/modals/DeleteServerModal'
import DeleteChannelModal from '@/components/modals/DeleteChannelModal'
import EditChannelModal from '@/components/modals/EditChannelModal'
import MessageFileModal from '@/components/modals/MessageFileModal'
import DeleteMessageModal from '@/components/modals/DeleteMessageModal'

const ModalProvider = () => {
	return (
		<>
			<CreateServerModal />
			<InvitePeopleModal />
			<EditServerModal />
			<ManageMembersModal />
			<CreateChannelModal />
			<LeaveServerModal />
			<DeleteServerModal />
			<DeleteChannelModal />
			<EditChannelModal />
			<MessageFileModal />
			<DeleteMessageModal />
		</>
	)
}

export default ModalProvider
