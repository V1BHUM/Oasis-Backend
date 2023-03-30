import 'reflect-metadata'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { AdvertisementType } from '../prisma/generated/type-graphql';
import { AdvertisementBuyerResponseType, AdvertisementPostInputType, AdvertisementSellerResponseType, AdvertisementtouchInputType } from '../types/advertisement.type';

@Resolver()
export class AdvertisementResolver {
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

    @Mutation(() => Boolean)
    async touchAdvertisement(@Ctx(){req}:Context,@Arg("touchAdvertisement") inp:AdvertisementtouchInputType) : Promise<Boolean>
    {
        let userId:string = req.session.userId!
        await prisma.touchType.create({data:{price:inp.price,advertisementId:inp.advertisementId,buyerId:userId}});
        return true;
    }

    @Mutation(() => Boolean)
    async respondSellerTouch(@Arg("responseInput") input: AdvertisementSellerResponseType) : Promise<Boolean> {

        await prisma.touchType.update({
            where: {
                id: input.touchId
            },
            data: {
                responded: true,
                responded_price: input.responsePrice
            }
        });

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
                isFinal: true
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
}