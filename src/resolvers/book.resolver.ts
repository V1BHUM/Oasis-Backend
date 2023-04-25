import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { Book } from '../prisma/generated/type-graphql';
import { query } from 'express';

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

    @Query(() => Number)
    async getBookRating(@Arg("bookID") bookID : string) : Promise<Number> {
        let rating  = await prisma.rating.aggregate({
            where: {
                bookID: bookID
            },
            _avg: {
                value: true
            }
        });

        return rating._avg.value ?? 0;
    }

    @Mutation(() => Boolean)
    async rateBook(@Ctx() {req}: Context, @Arg("bookID") bookID : string, @Arg("rating") rating: number) : Promise<Boolean> {
        let userRating = await prisma.rating.findFirst({
            where: {
                bookID: bookID,
                userID: req.session.userId
            }
        });


        if(userRating)
        {
            await prisma.rating.update({
                where: {
                    id: userRating?.id
                },
                data: {
                    value: rating
                }
            });
        }
        else
        {
            
            await prisma.rating.create({
                data: {
                    userID: req.session.userId!,
                    bookID: bookID,
                    value: rating
                }
            });
        }

        return true;
    }

    @Query(() => Number)
    async getUserRating(@Ctx() { req } : Context) : Promise<Number> {
        let rating = await prisma.rating.findFirst({
            where: {
                userID: req.session.userId
            }
        });

        return rating?.value ?? 0;
    }
}