import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';
import { initialData } from './data/seed-data.js';


@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductsService
  ){}

  async runSeed() {
    await this.insertNewProducts();
    return 'Seed Executed!'
  }

  private async insertNewProducts(){
    await this.productService.deleteAllProducts();

    const products = initialData.products;

    const insertPromise: any = [];

    products.forEach(product => {
      insertPromise.push(this.productService.create(product));
    });

    const result = await Promise.all(insertPromise);

    return true;
  }
}
