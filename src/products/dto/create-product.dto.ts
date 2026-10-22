
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsArray, IsIn, IsNumber, IsOptional, isPositive, IsPositive, IsString, MinLength} from 'class-validator'

export class CreateProductDto {
    @ApiProperty({
        example: 'T-Shirt name',
        description: 'Product title',
        uniqueItems: true,
        nullable: false,
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiPropertyOptional({
        example: 199.99,
        description: 'The price of the product',
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiPropertyOptional({
        example: 'This is a very long description to the product.',
        description: "Description about the product",
    })
    @IsString()
    @IsOptional()
    description?: string
    
    @ApiPropertyOptional({
        example: 't_shirt_name',
        description: "The slug of the product, for SEO purposes",
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiPropertyOptional({
        example: 10,
        description: "The stock of the product",
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        example: ['XL', 'XXL', 'XXXL'],
        description: "",
        nullable: false
    })
    @IsString({each: true})
    @IsArray()
    sizes: string[];

    @ApiProperty({
        example: 'unisex',
        description: "",
        nullable: false
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        example: ['orange', 'spring', 'casual'],
        description: "",
        nullable: false
    })
    @IsString({each: true})
    @IsArray()
    tags: string[];

    @ApiPropertyOptional({
        example: ['https://imageurl.com/image'],
        description: "",
    })
    @IsString({each: true})
    @IsArray()
    @IsOptional()
    images?: string[];
}
