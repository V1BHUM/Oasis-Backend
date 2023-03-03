import 'reflect-metadata'
import { Field, InputType } from 'type-graphql';

@InputType()
export class CategoryCreationInput {
    @Field()
    name!: string

    @Field({nullable: true})
    description?: string

    @Field({defaultValue: ""})
    image?: string
}