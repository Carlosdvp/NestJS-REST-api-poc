import { Injectable } from '@nestjs/common';
import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto'

@Injectable()
export class BookmarkService {
	constructor (private prisma: PrismaService) {}

	getBookmarks(userId: number) {
		return this.prisma.bookmark.findMany({
			where: {
				userId,
			}
		})
	}

	async createBookmark(userId: number, dto: CreateBookmarkDto) {
		const bookmark = await this.prisma.bookmark.create({
			data: {
				userId,
				...dto,
			}
		})

		return bookmark;
	}
	
	getBookmarkById(userId: number, bookmarkId: number) {
		return this.prisma.bookmark.findFirst({
			where: {
				id: bookmarkId,
				userId,
			}
		})
	}
	
	async editBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto) {
		// get the bookmark by id
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId,
			}
		})
		// check that the user owns the bookmark
		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('Access to resource denied');
		}

		return this.prisma.bookmark.update({
			where: {
				id: bookmarkId,
			},
			data: {
				...dto,
			}
		})
	}

	async deleteBookmarkById(userId: number, bookmarkId: number) {
		const bookmark = await this.prisma.bookmark.findUnique({
			where: {
				id: bookmarkId,
			}
		})

		if (!bookmark || bookmark.userId !== userId) {
			throw new ForbiddenException('Access to resource denied');
		}

		await this.prisma.bookmark.delete({
			where: {
				id: bookmarkId,
			}
		})
	}
}
