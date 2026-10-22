import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createObserveModule } from '@nestjs/observe';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module.js';
import { CommonModule } from './common/common.module.js';
import { SeedModule } from './seed/seed.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot(), // instalar paquete para acdeder a las variables de entorno

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true, // carga las entidades que vamos creando
      synchronize: true // no se usa en produccion. Mejor usar migracion.
    }), ProductsModule, CommonModule, SeedModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
