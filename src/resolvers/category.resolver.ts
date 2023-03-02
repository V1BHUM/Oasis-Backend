import 'reflect-metadata'
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { prisma } from '../app';
import { Category } from '../prisma/generated/type-graphql';
import { CategoryCreationInput } from '../types/category.type';

@Resolver()
export class CategoryResolver {
    @Mutation(() => Category)
    async createCategory(@Arg("createCategoryInput") input: CategoryCreationInput) : Promise<Category>
    {
        return await prisma.category.create({
            data: {
                name: input.name,
                description: input.description!,
                image: input.image
            }
        });
    }

    @Query(() => [Category])
    async getAllCategories() : Promise<Category[]>
    {
        return await prisma.category.findMany();
    }
}