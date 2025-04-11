import { Socket, Server as NetServer } from 'net'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { Member, Profile, Server } from '@prisma/client'

export type ServerSidebarWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[]
}

export type NextApiResponseSocketIO = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer
		}
	}
}
