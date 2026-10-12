import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm/repository/Repository.js';
import { PaginationDto } from '../common/dtos/pagination.dto.js';
import {validate as isUUID} from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const product = this.productsRepository.create(createProductDto);
      await this.productsRepository.save(product);
      return product;
    } catch(error){
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; 

    return await this.productsRepository.find({
      take: limit,
      skip: offset
    });
  }

  async findOne(term: string) {

    let product: Product | null;

    if(isUUID(term)){
      product = await this.productsRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder();
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).getOne();
    }
    
    if(!product){
      throw new NotFoundException(`Product with ${term} not found`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try{
      const product = await this.productsRepository.preload({
        id: id,
        ...updateProductDto
      });
 
      if(!product){
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      await this.productsRepository.save(product);

      return product;
    } catch(error){
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return {"message": `Product with id ${id} has been removed`};
  }



  private handleDBExceptions(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Error creating product');
  }
}
