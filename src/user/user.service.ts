import { Global, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { chance } from '../lib/chance';

@Global()
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async createUser(dto: CreateUserDto) {
    let username = `${chance.word()}${chance.integer({ min: 0, max: 9999 })}`;

    // this might slow down the server but it ensures that the username is unique
    while (await this.prisma.user.findFirst({ where: { username } })) {
      username = `${chance.word()}${chance.integer({ min: 0, max: 9999 })}`;
    }

    this.prisma.user
      .create({
        data: {
          ...dto,
          username: username,
        },
      })
      .then((newUser) => {
        return newUser;
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          return new Error('Email already exist');
        }
      });
  }
}