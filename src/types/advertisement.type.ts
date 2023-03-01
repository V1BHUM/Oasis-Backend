import 'reflect-metadata';
import { Field, InputType } from 'type-graphql';
import { BookCreationInput } from './book.type';

@InputType()
export class AdvertisementPostInputType {
    @Field()
    price!: number

    @Field(() => [String])
    images?: string[]

    @Field()
    isbn!: string

    @Field({defaultValue: null, nullable: true})
    book?: BookCreationInput

}