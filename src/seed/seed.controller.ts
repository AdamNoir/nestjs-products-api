import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service.js';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { ValidRoles } from '../auth/interfaces/valid-roles.js';

@ApiTags('SEED')
@Controller('seed')
@Auth(ValidRoles.admin)
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @ApiOperation({
    summary: "Execute Seed",
    description: "Delete all data en add new data"
  })
  @ApiResponse({ status: 200, description: 'Seed Executed!' })
  @Get()
  seed() {
    return this.seedService.runSeed();
  }

}
