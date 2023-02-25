import 'reflect-metadata'
import { buildSchema, NonEmptyArray } from 'type-graphql'
import { resolvers } from '../prisma/generated/type-graphql';
import { UserLoginType, UserRegisterType } from '../types/user.type';
import { UserResolver } from './user.resolver';

export function buildGQLSchema()
{
    const resolverList: NonEmptyArray<Function> = [
        ...resolvers,
        UserResolver,
    ] 

    const orphanedTypesList = [
        UserRegisterType,
        UserLoginType
    ]

    return buildSchema({
        resolvers: [...resolverList],
        orphanedTypes: [...orphanedTypesList],
        validate: false
    });
}