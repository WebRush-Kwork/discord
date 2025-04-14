import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Open_Sans } from 'next/font/google'
import ThemeProvider from '@/components/providers/theme-provider'
import ModalProvider from '@/components/providers/modal-provider'
import { SocketProvider } from '@/components/providers/socket-provider'
import QueryProvider from '@/components/providers/query-provider'
import { cn } from '@/lib/utils'
import './globals.css'

const openSans = Open_Sans({
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Discord Clone by Gleb Guslyakov',
	description: 'Oblivion Labs Discord',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='en' suppressHydrationWarning>
				<body className={cn(openSans.className, 'bg-white dark:bg-[#313338]')}>
					<ThemeProvider
						attribute='class'
						defaultTheme='system'
						enableSystem
						storageKey='discord-theme'
					>
						<SocketProvider>
							<ModalProvider />
							<QueryProvider>{children}</QueryProvider>
						</SocketProvider>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	)
}
