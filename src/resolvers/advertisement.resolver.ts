import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { AdvertisementType, TouchType } from '../prisma/generated/type-graphql';
import { AdvertisementBuyerResponseType, AdvertisementPostInputType, AdvertisementSearchType, AdvertisementSellerResponseType, AdvertisementtouchInputType } from '../types/advertisement.type';

@Resolver()
export class AdvertisementResolver {

    @Query(() => AdvertisementType)
    async getAdvertisement(@Arg("advertisement") ad: string)
    {
        return await prisma.advertisementType.findFirst({
            where: {
                id: ad
            }
        });
    }


    @Mutation(() => AdvertisementType)
    async postAdvertisement(@Ctx() {req}: Context, @Arg("postAdvertisement") input: AdvertisementPostInputType) : Promise<AdvertisementType>
    {
        const book = await prisma.book.findUnique({
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
                            id: req.session.userId
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
                            id: req.session.userId
                        }
                    },
                    book: {
                        create: {
                            authorName: input.book!.authorName,
                            bookName: input.book!.bookName,
                            description: input.book!.description,
                            isbn: input.book!.isbn,
                            category: {
                                connect: {
                                    name: input.book?.category
                                }
                            }
                        }
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

    @Query(() => [AdvertisementType])
    async getAllActiveAdvertisements() : Promise<AdvertisementType[]>
    {
        return await prisma.advertisementType.findMany({
            where: {
                open: true
            }
        });
    }

    @Query(() => [AdvertisementType])
    async searchAdvertisements(@Arg("searchInput") input: AdvertisementSearchType) : Promise<AdvertisementType[]>
    {
        console.log(input);

        let results: AdvertisementType[] = await prisma.advertisementType.findMany({
            where: {
                AND: [
                    // Search by book name
                    {
                        book: {
                            bookName: {
                                contains: input.bookName
                            }
                        }
                    },
                    // Search by author name
                    {  
                        book: {
                            authorName: {
                                contains: input.authorName
                            }
                        }
                    },
                    // Search by seller name
                    {
                        OR: [
                            // Search in username
                            {
                                seller: {
                                    username: {
                                        contains: input.sellerName
                                    }
                                }
                            },
                            // Search in full name
                            {
                                seller: {
                                    fullName: {
                                        contains: input.sellerName
                                    }
                                }
                            }
                        ]
                    },
                    // Search by category
                    {
                        book: {
                            category: {
                                name: input.category
                            }
                        }
                    },
                    // Search by price
                    {
                        AND: [
                            // Max Price
                            {
                                price: {
                                    lte: input.maxPrice === null ? undefined : input.maxPrice
                                }
                            },
                            // Min Price
                            {
                                price: {
                                    gte: input.minPrice === null ? undefined : input.minPrice
                                }
                            }
                        ]
                    }
                ],
                open: true
            }
        });

        return results;
    }

    @Mutation(() => Boolean)
    async touchAdvertisement(@Ctx(){req}:Context,@Arg("touchAdvertisement") inp:AdvertisementtouchInputType) : Promise<Boolean>
    {
        let userId:string = req.session.userId!
        await prisma.touchType.create({data:{price:inp.price,advertisementId:inp.advertisementId,buyerId:userId}});
        return true;
    }

    @Mutation(() => Boolean)
    async respondSellerTouch(@Arg("responseInput") input: AdvertisementSellerResponseType) : Promise<Boolean> {

        if(input.accept)
        {
            await prisma.touchType.update({
                where: {
                    id: input.touchId
                },
                data: {
                    responded: true,
                    responded_price: input.responsePrice
                }
            });
        }
        else
        {
            await prisma.touchType.update({
                where: {
                    id: input.touchId
                },
                data: {
                    responded: true,
                    responded_price: input.responsePrice,
                    isActive: false
                }
            });
        }

        return true;
    }

    @Mutation(() => Boolean)
    async respondBuyerTouch(@Arg("responseInput") buyerResponse: AdvertisementBuyerResponseType) : Promise<Boolean> {

        if(buyerResponse.accept)
        {
           let touch = await prisma.touchType.update({
            where: {
                id: buyerResponse.touchId
            },
            data: {
                isFinal: true,
                advertisement: {
                    update: {
                        open: false
                    }
                }
            }
           });

           await prisma.touchType.updateMany({
                where: {
                    advertisementId: touch?.advertisementId
                },
                data: {
                    isActive: false
                }
           });
        }
        else
        {
            await prisma.touchType.update({
                where: {
                    id: buyerResponse.touchId
                },
                data: {
                    isActive: false
                }
            });
        }

        return true;
    }

    @Query(() => [TouchType])
    async getBuyerTouches(@Ctx() {req} : Context) : Promise<TouchType[]>
    {
        return await prisma.touchType.findMany({
            where: {
                responded: false,
                buyerId: req.session.userId,
                isActive: true
            }
        });
    }

    @Query(() => [TouchType])
    async getSellerResponds(@Ctx() {req}: Context) : Promise<TouchType[]>
    {
        return await prisma.touchType.findMany({
            where: {
                responded: false,
                advertisement: {
                    sellerID: req.session.userId
                },
                isActive: true
            }
        });
    }

    @Query(() => [TouchType])
    async getBuyerResponds(@Ctx() {req}: Context) : Promise<TouchType[]>
    {
        return await prisma.touchType.findMany({
            where: {
                buyerId: req.session.userId,
                isActive: true,
                responded: true
            }
        });
    }

    @Query(() => [TouchType])
    async getBuyerHistory(@Ctx() {req}: Context): Promise<TouchType[]>
    {
        return prisma.touchType.findMany({
            where: {
                buyerId: req.session.userId,
                isActive: false,
            }
        });
    }

    @Query(() => [TouchType])
    async getSellerHistory(@Ctx() {req}: Context): Promise<TouchType[]>
    {
        return prisma.touchType.findMany({
            where: {
                isActive: false,
                advertisement: {
                    sellerID: req.session.userId,
                    open: false,
                }
            }
        });
    }

}