'use client'
import { Plus } from 'lucide-react'
import NavigationTooltip from './NavigationTooltip'
import useModalStore from '@/hooks/useModalStore'

const NavigationAction = () => {
	const { onOpen } = useModalStore()

	return (
		<div>
			<NavigationTooltip
				label='Add a server'
				align='center'
				sidePosition='right'
			>
				<button
					className='group flex items-center'
					onClick={() => onOpen('createServer')}
				>
					<div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-white dark:bg-neutral-700 group-hover:bg-emerald-500 dark:group-hover:bg-emerald-500'>
						<Plus
							className='text-emerald-500 group-hover:text-white transition'
							size={25}
						/>
					</div>
				</button>
			</NavigationTooltip>
		</div>
	)
}

export default NavigationAction
