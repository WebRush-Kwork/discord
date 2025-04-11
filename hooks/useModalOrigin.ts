import { useEffect, useState } from 'react'

export const useModalOrigin = () => {
	const [isMounted, setIsMounted] = useState<boolean>(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const inviteUrl =
		isMounted &&
		typeof window.location !== 'undefined' &&
		window.location.origin
			? window.location.origin
			: ''

	if (!isMounted) return ''

	return inviteUrl
}
