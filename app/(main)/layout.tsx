import NavigationSidebar from '@/components/navigation/NavigationSidebar'

const ServerPageLayout = async ({
	children,
}: {
	children: React.ReactNode
}) => {
	return (
		<div className='h-full'>
			<div className='max-sm:hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0'>
				<NavigationSidebar />
			</div>
			<main className='h-full md:pl-[72px]'>{children}</main>
		</div>
	)
}

export default ServerPageLayout
