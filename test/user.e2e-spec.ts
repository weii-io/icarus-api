// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication, ValidationPipe } from '@nestjs/common';
// import { PrismaService } from '../src/prisma/prisma.service';
// import { AppModule } from '../src/app.module';
// import * as pactum from 'pactum';
// import { initUser } from './const';

// describe('User Module (e2e)', () => {
//   let app: INestApplication;
//   let prisma: PrismaService;

//   beforeAll(async () => {
//     const moduleRef: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//     app = moduleRef.createNestApplication();
//     app.useGlobalPipes(
//       new ValidationPipe({
//         whitelist: true,
//       }),
//     );
//     prisma = app.get(PrismaService);
//     await prisma.cleanDB();
//     await app.listen(3333);
//     pactum.request.setBaseUrl('http://localhost:3333');
//   });

//   afterAll(() => {
//     app.close();
//   });

//   describe('CRUD', () => {
//     const mockUserCredentials = {
//       email: 'test@test.com',
//       password: 'Test@12345',
//     };
//     let at: string;

//     it('should initialize user', async () => {
//       const payload = await initUser(pactum, mockUserCredentials);
//       expect(payload).toHaveProperty('at');
//       at = payload.at;
//     });

//     it('should update user email', async () => {
//       const payload = {
//         email: 'update@update.com',
//       };

//       await pactum
//         .spec()
//         .patch('/user')
//         .withCookies(at)
//         .withBody(payload)
//         .expectStatus(200);
//     });

//     it('should logout user', async () => {
//       await pactum.spec().get('/users/me').withCookies(at).expectStatus(200);
//     });
//   });
// });