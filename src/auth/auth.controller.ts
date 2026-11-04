import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator.js';
import { User } from './entities/user.entity.js';
import { RawHeaders } from './decorators/get-raw-headers.decorator.js';
import { ValidRoles } from './interfaces/valid-roles.js';
import { Auth } from './decorators/auth.decorator.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }


}
