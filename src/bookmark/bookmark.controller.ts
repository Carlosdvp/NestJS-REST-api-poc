import { 
	Controller,
	Param,
	Get,
	Post,
	Patch,
	Delete,
	UseGuards,
	ParseIntPipe,
	Body,
	HttpCode,
	HttpStatus
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
// import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
	constructor(private bookmarkService: BookmarkService) {}

	@Get()
	getBookmarks(
		@GetUser('id') user: {id: number}
	) {
		console.log('getBookmarks', user.id)

		return this.bookmarkService.getBookmarks(user.id)
	}

	@Post()
	createBookmark(
		@GetUser('id') user: {id: number},
		@Body() dto: CreateBookmarkDto,
	) {
		return this.bookmarkService.createBookmark(user.id, dto)
	}
	
	@Get(':id')
	getBookmarkById(
		@GetUser('id') user: {id: number},
		@Param('id', ParseIntPipe) bookmarkId: number
	) {
		return this.bookmarkService.getBookmarkById(user.id, bookmarkId)
	}

	@Patch(':id')
	editBookmarkById(
		@GetUser('id') user: {id: number},
		@Param('id', ParseIntPipe) bookmarkId: number,
		@Body() dto: EditBookmarkDto
	) {
		return this.bookmarkService.editBookmarkById(user.id, bookmarkId, dto)
	}

	@HttpCode(HttpStatus.NO_CONTENT)
	@Delete(':id')
	deleteBookmarkById(
		@GetUser('id') user: {id: number},
		@Param('id', ParseIntPipe) bookmarkId: number
	) {
		return this.bookmarkService.deleteBookmarkById(user.id, bookmarkId)
	}
}
