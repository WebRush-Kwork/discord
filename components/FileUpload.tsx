'use client'
import { UploadDropzone } from '@/lib/uploadthing'
import '@uploadthing/react/styles.css'
import Image from 'next/image'
import { FormLabel } from './ui/form'
import { useState } from 'react'
import { X } from 'lucide-react'

interface IFileUpload {
	endpoint: 'messageFile' | 'serverImage'
	onChange: ({ fileUrl }: { fileUrl: string }) => void
}

interface IInitialServerImageUrl {
	fileUrl: string
	fileName: string
}

const FileUpload = ({ endpoint, onChange }: IFileUpload) => {
	const [initialServerImageUrl, setInitialServerImageUrl] =
		useState<IInitialServerImageUrl | null>(null)
	const fileType = initialServerImageUrl?.fileName
		.split('.')
		.pop()
		?.toLowerCase()

	return (
		<div>
			{initialServerImageUrl && (fileType === 'png' || fileType === 'jpg') ? (
				<div className='flex items-center justify-center'>
					<div className='relative w-24 h-24'>
						<Image
							src={initialServerImageUrl.fileUrl}
							alt='uploaded img'
							className='rounded-[50%]'
							fill
						/>
						<X
							className='absolute top-0 right-0 bg-rose-500 rounded-[50%] hover:bg-rose-900 transition'
							onClick={() =>
								setInitialServerImageUrl({ fileUrl: '', fileName: '' })
							}
						/>
					</div>
				</div>
			) : (
				<UploadDropzone
					endpoint={endpoint}
					className='dark:!border-gray-200'
					onClientUploadComplete={res => {
						onChange({ fileUrl: res[0].ufsUrl })
						setInitialServerImageUrl({
							fileUrl: res[0].ufsUrl,
							fileName: res[0].name,
						})
					}}
				/>
			)}
		</div>
	)
}

export default FileUpload
