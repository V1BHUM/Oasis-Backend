import 'reflect-metadata';
import { Field, InputType } from 'type-graphql';
import { BookCreationInput } from './book.type';

@InputType()
export class AdvertisementPostInputType {
    @Field()
    price!: number

    @Field(() => [String], {nullable: true})
    images?: string[]

    @Field()
    isbn!: string

    @Field({defaultValue: null, nullable: true})
    book?: BookCreationInput

}

@InputType()
export class AdvertisementtouchInputType {
    @Field()
    price!: number

    @Field(() => String)
    advertisementId!:string

    
}