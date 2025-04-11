import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export const initialProfile = async () => {
	const user = await currentUser()

	if (!user) return redirect('/')

	const profile = await db.profile.findUnique({ where: { userId: user.id } })

	if (profile) return profile

	const newProfile = await db.profile.create({
		data: {
			userId: user.id,
			email: user.emailAddresses[0].emailAddress,
			imageUrl: user.imageUrl,
			name: `${user.firstName} ${user.lastName}`,
		},
	})

	return newProfile
}
