import 'reflect-metadata'
import { Query, Resolver } from 'type-graphql';
import { prisma } from '../app';

@Resolver()
export class AnalyticsResolver {
    @Query(() => Number)
    async getNumberOfBuyers() : Promise<Number> {
        let nBuyers = await prisma.userType.findMany({
            where: {
                touches: {
                    some: {
                        isFinal: true,
                        isActive: false
                    }
                }
            }
        });

        return nBuyers.length;
    }

    @Query(() => Number)
    async getNumberOfSellers() : Promise<Number> {
        let nSellers = await prisma.userType.findMany({
            where: {
                ads: {
                    some: {
                        open: false
                    }
                }
            }
        });

        return nSellers.length;
    }

    @Query(() => Number)
    async getTotalSaleAmount(): Promise<Number> {
        let sales = await prisma.touchType.aggregate({
            _sum: {
                price: true
            },
            where: {
                isActive: false,
                isFinal: true,
                responded: true
            }
        })

        return sales._sum.price ?? 0;
    }

    @Query(() => Number)
    async getNumberOfTouches() : Promise<Number> {
        let touches = await prisma.touchType.aggregate({
            _count: {
                _all: true
            }
        });

        return touches._count._all;
    }

    @Query(() => Number)
    async getNumberOfActiveTouches() : Promise<Number> {
        let touches = await prisma.touchType.aggregate({
            _count: {
                _all: true
            },
            where: {
                isActive: true
            }
        });

        return touches._count._all;
    }

    @Query(() => Number)
    async getAverageTouchPrice() : Promise<Number> {
        let touches = await prisma.touchType.aggregate({
            _avg: {
                price: true
            }
        });

        return touches._avg.price ?? 0;
    }

    @Query(() => Number)
    async getNumberOfResponds() : Promise<Number> {
        let responds = await prisma.touchType.aggregate({
            _count: {
                _all: true
            },
            where: {
                responded: true,
            }
        });

        return responds._count._all;
    }

    @Query(() => Number)
    async getNumberOfActiveResponds(): Promise<Number> {
        let activeResponds = await prisma.touchType.aggregate({
            _count: {
                _all: true
            },
            where: {
                responded: true,
                isActive: true
            }
        });

        return activeResponds._count._all;
    }

    @Query(() => Number)
    async getNumberOfAccepts(): Promise<Number> {
        let accepts = await prisma.advertisementType.aggregate({
            _count: {
                _all: true
            },
            where: {
                open: false
            }
        });

        return accepts._count._all;
    }

    @Query(() => Number)
    async getNumberOfActiveAdvertisements(): Promise<Number> {
        let ads = await prisma.advertisementType.aggregate({
            _count: {
                _all: true
            },
            where: {
                open: true
            }
        });

        return ads._count._all;
    }

    @Query(() => Number)
    async getAveragePostingPrice(): Promise<Number> {
        let avgPrice = await prisma.advertisementType.aggregate({
            _avg: {
                price: true
            }
        });

        return avgPrice._avg.price ?? 0;
    }
}