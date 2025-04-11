import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'

const func = createUploadthing()

const handleAuth = () => {
	const userId = auth()

	if (!userId) throw new Error('Unauthorized')

	return userId
}

export const fileRouter = {
	serverImage: func({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
	messageFile: func(['image', 'pdf'])
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type TFileRouter = typeof fileRouter
