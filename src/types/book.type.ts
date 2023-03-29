import 'reflect-metadata';
import { Field, InputType } from 'type-graphql';
import { CategoryCreationInput } from './category.type';

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

    @Field()
    category!: string;
}