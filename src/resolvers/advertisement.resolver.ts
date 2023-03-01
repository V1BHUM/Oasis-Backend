import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { AdvertisementType } from '../prisma/generated/type-graphql';
import { AdvertisementPostInputType } from '../types/advertisement.type';

@Resolver()
export class AdvertisementResolver {
    @Mutation(() => AdvertisementType)
    async postAdvertisement(@Ctx() {req}: Context, @Arg("postAdvertisement") input: AdvertisementPostInputType) : Promise<AdvertisementType>
    {
        const book = prisma.book.findUnique({
            where: {
                isbn: input.isbn
            }
        });

        let ad: AdvertisementType;

        if(book != null)
        {
            ad = await prisma.advertisementType.create({
                data: {
                    price: input.price,
                    time: new Date().toISOString(),
                    images: input.images,
                    seller: {
                        connect: {
                            id: "63f92ae98c2ccc50c60e69b0"
                        }
                    },
                    book: {
                        connect: {
                            isbn: input.isbn
                        }
                    }
                }
            });
        }
        else
        {

            ad = await prisma.advertisementType.create({
                data: {
                    price: input.price,
                    time: new Date().toISOString(),
                    images: input.images,
                    seller: {
                        connect: {
                            id: "63f92ae98c2ccc50c60e69b0"
                        }
                    },
                    book: {
                        create: input.book
                    }
                }
            });
        }
        return ad;
    }

    @Query(() => [AdvertisementType])
    async getAllAdvertisements() : Promise<AdvertisementType[]>
    {
        return await prisma.advertisementType.findMany();
    }
}