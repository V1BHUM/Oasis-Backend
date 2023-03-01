import 'reflect-metadata'
import { buildSchema, NonEmptyArray } from 'type-graphql'
import {relationResolvers } from '../prisma/generated/type-graphql';
import { UserLoginType, UserRegisterType } from '../types/user.type';
import { AdvertisementResolver } from './advertisement.resolver';
import { UserResolver } from './user.resolver';

export function buildGQLSchema()
{
    const resolverList: NonEmptyArray<Function> = [
        ...relationResolvers,
        UserResolver,
        AdvertisementResolver
    ] 

    return buildSchema({
        resolvers: [...resolverList],
        validate: false
    });
}