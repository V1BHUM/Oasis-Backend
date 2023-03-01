import 'reflect-metadata';
import { Field, InputType } from 'type-graphql';

@InputType()
export class BookCreationInput {
    @Field()
    isbn!: string

    @Field()
    bookName!: string

    @Field()
    authorName!: string

    @Field()
    description!: string
}