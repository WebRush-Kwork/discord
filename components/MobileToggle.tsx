import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import NavigationSidebar from '@/components/navigation/NavigationSidebar'
import ServerSidebar from '@/components/server/ServerSidebar'

const MobileToggle = ({ serverId }: { serverId: string }) => {
	return (
		<div className='md:hidden'>
			<Sheet>
				<SheetTrigger asChild>
					<Button variant='ghost'>
						<Menu />
					</Button>
				</SheetTrigger>
				<SheetContent side='left'>
					<div className='flex h-full'>
						<div className='w-[72px]'>
							<NavigationSidebar />
						</div>
						<ServerSidebar serverId={serverId} />
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default MobileToggle
