import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { handleRetry, InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto.js';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}





  async create(createUserDto: CreateUserDto) {
    try{
      const {password, ...userData} = createUserDto;

      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return user;
    } catch(error: any){
      //console.log(error)
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true}
    });

    if(!user){
      throw new UnauthorizedException("Credentials no valid - email");
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException("Credentials no valid - password");
    }

    return user;
  }

  



  private handleDBExceptions(error: any): never{
      if(error.code === '23505'){
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error)
      throw new InternalServerErrorException('Error creating user');
    }
}
