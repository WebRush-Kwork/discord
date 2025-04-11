import ToggleTheme from '@/components/ToggleTheme'
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from '@clerk/nextjs'

const Header = () => {
	return (
		<header className='flex justify-end items-center p-4 gap-4 h-16'>
			<SignedOut>
				<SignInButton />
				<SignUpButton />
			</SignedOut>
			<SignedIn>
				<UserButton />
			</SignedIn>
			<ToggleTheme />
		</header>
	)
}

export default Header
