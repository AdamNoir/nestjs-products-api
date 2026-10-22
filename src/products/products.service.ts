import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { Repository } from 'typeorm/repository/Repository.js';
import { PaginationDto } from '../common/dtos/pagination.dto.js';
import {validate as isUUID} from 'uuid';
import { ProductImage } from './entities/product-image.entity.js';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource
  ){}

  async create(createProductDto: CreateProductDto) {
    try{
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productsRepository.create({
        ...productDetails,
        images: images.map(image => this.productImagesRepository.create({url: image}))
      });
      await this.productsRepository.save(product);
      return {...product, images};
    } catch(error){
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto; 

    const products = await this.productsRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return products.map(product => ({
      ...product,
      images: product.images.map(image => image.url)
    }));
  }

  async findOne(term: string) {

    let product: Product | null;

    if(isUUID(term)){
      product = await this.productsRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.productsRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase()
      }).leftJoinAndSelect('prod.images', 'prodImages').getOne();
    }
    
    if(!product){
      throw new NotFoundException(`Product with ${term} not found`);
    }
    
    return product;
  }

  async findOnePlain(term: string) {
    const { images = [], ...product } = await this.findOne(term);
    return {
      ...product,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    
      const {images, ...toUpdate} = updateProductDto;
      const product = await this.productsRepository.preload({
        id: id,
        ...toUpdate
      });
 
      if(!product){
        throw new NotFoundException(`Product with id ${id} not found`);
      }


      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();



     try{

      if(images){
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map(image => this.productImagesRepository.create({url: image}));
      } 
      
      await queryRunner.manager.save(product);


      await queryRunner.commitTransaction();
      await queryRunner.release();
      //await this.productsRepository.save(product);

      return this.findOnePlain(id);

    } catch(error){
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return {"message": `Product with id ${id} has been removed`};
  }


  async deleteAllProducts(){
    const query = this.productsRepository.createQueryBuilder('products');

    try{
      return await query.delete().execute();
    } catch(error){
      this.handleDBExceptions(error);
    }
  }



  private handleDBExceptions(error: any){
    if(error.code === '23505'){
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Error creating product');
  }
}
