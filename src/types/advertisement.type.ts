import 'reflect-metadata';
import { Field, InputType } from 'type-graphql';
import { BookCreationInput } from './book.type';

@InputType()
export class AdvertisementPostInputType {
    @Field()
    price!: number

    @Field(() => [String], {nullable: true})
    images?: string[]

    @Field()
    isbn!: string

    @Field({defaultValue: null, nullable: true})
    book?: BookCreationInput

}

@InputType()
export class AdvertisementtouchInputType {
    @Field()
    price!: number

    @Field(() => String)
    advertisementId!:string
}

@InputType()
export class AdvertisementSellerResponseType {
    @Field()
    touchId!: string

    @Field()
    responsePrice?: number

    @Field()
    accept!: boolean
}

@InputType()
export class AdvertisementBuyerResponseType {
    @Field()
    touchId!: string

    @Field()
    accept!: boolean
}

@InputType()
export class AdvertisementSearchType {
    @Field({nullable: true})
    bookName?: string

    @Field({nullable: true})
    authorName?: string

    @Field({nullable: true})
    category?: string

    @Field({nullable: true})
    sellerName?: string

    @Field({nullable: true})
    minPrice?: number

    @Field({nullable: true})
    maxPrice?: number
}