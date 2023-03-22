import {
  BadRequestException,
  ForbiddenException,
  Global,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from 'argon2';
import { chance } from '../lib';
import { CreateUserDto, UpdateUserDto } from './dto';
import { ERROR } from '../enum';

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
          email: dto.email,
          password: await argon2.hash(dto.password),
          username: username,
        },
      })
      .then((newUser) => {
        delete newUser.password;
        return newUser;
      })
      .catch((error) => {
        if (error.code === 'P2002') {
          return new BadRequestException(ERROR.EMAIL_EXISTS);
        }
        throw new BadRequestException(error);
      });
  }

  async updateUserById(userId: number, dto: UpdateUserDto) {
    const _user = await this.prisma.user.findFirst({ where: { id: userId } });
    if (!_user || _user.id !== userId) {
      return new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    // if there is password hash it
    if (dto.password) {
      dto.password = await argon2.hash(dto.password);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...dto,
      },
    });
  }

  async deleteUserById(userId: number) {
    const _user = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!_user) throw new NotFoundException(ERROR.RESOURCE_NOT_FOUND);
    if (!_user || _user.id !== userId) {
      return new ForbiddenException(ERROR.ACCESS_DENIED);
    }

    return this.prisma.user.delete({ where: { id: userId } });
  }
}
