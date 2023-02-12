import 'reflect-metadata'
import { buildSchema } from 'type-graphql'
import { resolvers } from '../prisma/generated/type-graphql';
import { BookResolver } from './book_resolver'

export function buildGQLSchema()
{
    return buildSchema({
        resolvers: [...resolvers, BookResolver],
        validate: false
    });
}