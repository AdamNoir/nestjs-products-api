import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity.js';
import type { Relation } from 'typeorm';


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text',{
        unique: false,
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];


    @OneToMany(
        () => Product,
        (product) => product.user
    )
    products: Relation<Product[]>;


    @BeforeInsert()
    checkUserEmailCase(){
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkUserEmailCaseUpdate(){
        this.checkUserEmailCase();
    }
}
