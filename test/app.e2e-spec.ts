import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from '../src/auth/dto';
import { EditUserDto } from '../src/user/dto';

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
    describe('Create bookmark', () => {});
    describe('Get bookmarks', () => {});
    describe('Get bookmarks by id', () => {});
    describe('Edit bookmark by id', () => {});
    describe('Delete bookmark by id', () => {});
  });
})
