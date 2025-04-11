import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'

interface INavigationTooltip {
	label: string
	children: React.ReactNode
	sidePosition?: 'top' | 'bottom' | 'right' | 'left'
	align?: 'start' | 'center' | 'end'
}

const NavigationTooltip = ({
	label,
	children,
	sidePosition,
	align,
}: INavigationTooltip) => {
	return (
		<TooltipProvider>
			<Tooltip delayDuration={50}>
				<TooltipTrigger asChild>{children}</TooltipTrigger>
				<TooltipContent side={sidePosition} align={align}>
					<p className='font-semibold text-sm capitalize'>{label}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}

export default NavigationTooltip
