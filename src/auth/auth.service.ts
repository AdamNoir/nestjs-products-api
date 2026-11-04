import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';

import { UpdateAuthDto } from './dto/update-user.dto.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { User } from './entities/user.entity.js';
import { Repository } from 'typeorm';
import { handleRetry, InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto.js';
import { JwtPayload } from './interfaces/jwt-payload.interface.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ){}





  async create(createUserDto: CreateUserDto) {
    try{
      const {password, ...userData} = createUserDto;

      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      return {
        ...user,
        token: this.getJwToken({id: user.id})
      };
    } catch(error: any){
      //console.log(error)
      this.handleDBExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    
    const {password, email} = loginUserDto;

    const user = await this.userRepository.findOne({
      where: {email},
      select: {email: true, password: true, id: true}
    });

    if(!user){
      throw new UnauthorizedException("Credentials no valid - email");
    }

    if(!bcrypt.compareSync(password, user.password)){
      throw new UnauthorizedException("Credentials no valid - password");
    }

    return {
      ...user,
      token: this.getJwToken({id: user.id})
    };
  }


  private getJwToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }

  



  private handleDBExceptions(error: any): never{
      if(error.code === '23505'){
        throw new BadRequestException(error.detail);
      }
      this.logger.error(error)
      throw new InternalServerErrorException('Error creating user');
    }
}
