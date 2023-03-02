import 'reflect-metadata'
import { Query, Resolver } from 'type-graphql';
import { prisma } from '../app';
import { Book } from '../prisma/generated/type-graphql';

@Resolver()
export class BookResolver {
    @Query(() => [Book])
    async getTrendingBooks()
    {
        return await prisma.book.findMany({
            orderBy: {
                purchases: "desc"
            },
            take: 10,
        });
    }
}