import 'reflect-metadata'
import { Query, Resolver } from 'type-graphql';
import { prisma } from '../app';
import { Book } from '../prisma/generated/type-graphql/models/Book';

@Resolver()
export class BookResolver {
    @Query(() => [Book])
    async getAllBooks() : Promise<Book[]>
    {
        const books = await prisma.book.findMany();
        return books;
    }
}