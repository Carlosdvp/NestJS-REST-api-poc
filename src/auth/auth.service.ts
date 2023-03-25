import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ForbiddenException } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	constructor(private prisma:PrismaService) {}

	async signup(dto: AuthDto) {
		// 1. generate the passwrod hash
		const hash = await argon.hash(dto.password);
		
		try {
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
		} catch (error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException('A user already exists with that Email');
				}
			}
			throw error;
		}
	}

	async signin(dto: AuthDto) {
		// 1. Find the usr by email
		const user = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			}
		})
		// 2. if the usr does not exist throw an exception
		if (!user) {
			throw new ForbiddenException('Incorrect Credentials.');
		}
		// 3. Compare password
		const verifyPassword = await argon.verify(user.hash, dto.password);
		// 4. If password is incorrect throw an exception
		if (!verifyPassword) {
			throw new ForbiddenException('Incorrect Credentials.');
		}
		delete user.hash;
		
		// 5. If all is correct, return the user
		return user;
	}
}
