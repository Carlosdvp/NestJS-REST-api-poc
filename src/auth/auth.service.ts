import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	constructor(private prisma:PrismaService) {}

	async signup(dto: AuthDto) {
		// 1. generate the passwrod hash
		const hash = await argon.hash(dto.password);
		// 2. save the user in the db
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				hash,
			},
		});

		delete user.hash;
		// 3. return the saved user
		return user;
	}
	
	login() {
		return { msg: 'I am logged in' }
	}
}
