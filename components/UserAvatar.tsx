import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface IUserAvatar {
	src?: string
	className?: string
}

const UserAvatar = ({ src, className }: IUserAvatar) => {
	return (
		<Avatar>
			<AvatarImage src={src} className={className} />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	)
}

export default UserAvatar
