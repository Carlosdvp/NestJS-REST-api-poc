import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';
import { CreateBookmarkDto } from '../src/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from '../src/bookmark/dto/edit-bookmark.dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3331);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3331');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'Kitten@cat.com',
      password: 'kitty'
    }

    describe('Signup', () => {
      it('Should Signup', () => {

        return pactum.spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)
      })

      it('should throw an error if the email is empty', () => {

        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw an error if the password is empty', () => {

        return pactum.spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw an error if email and password are empty', () => {

        return pactum.spec()
          .post('/auth/signup')
          .expectStatus(400)
      })
    });

    describe('Signin', () => {
      it('Should Signin', () => {

        return pactum.spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAccessToken', 'access_token')
      })

      it('should throw an error if the email is empty', () => {

        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw an error if the password is empty', () => {

        return pactum.spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw an error if email and password are empty', () => {

        return pactum.spec()
          .post('/auth/signin')
          .expectStatus(400)
      })
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get the current user', () => {

        return pactum.spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
      })
    });

    describe('Edit user', () => {
      it('should edit a user', () => {
        const dto: EditUserDto = {
          firstName: 'KitKat',
          lastName: 'Meow'
        }

        return pactum.spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
      })
    });
  });

  describe('Bookmark', () => {
    describe('Get empty bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title: 'Kitty Girl',
        link: 'https://youtu.be/KaXEC0Loxek'
      }

      it('should create a new bookmark', ()=> {
        return pactum.spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .inspect()
          .expectJsonLength(1)
      })
    });

    describe('Get bookmarks by id', () => {
      it('should get a bookmark by id', () => {
        return pactum.spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      })
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Kitty Girl the ofiicial video',
        description: 'Great video, good music.'
      }

      it('should edit a bookmark by id', () => {
        return pactum.spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .withBody(dto)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectStatus(200)
      })
    });

    describe('Delete bookmark by id', () => {
      it('should delete a bookmark by id', () => {
        return pactum.spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(204)
      })

      it('should get empty bookmarks', () => {
        return pactum.spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAccessToken}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    });
  });
})
