import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtGuard } from '../auth/guard/';
import { Request } from 'express';

@Controller('users')
export class UserController {
	@UseGuards(JwtGuard)
	@Get('me')

	getMe(@Req() req: Request) {
		return req.user;
	}
}
