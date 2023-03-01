import 'reflect-metadata'
import { Field, InputType, ObjectType } from 'type-graphql';

@InputType()
export class UserRegisterType {
    @Field()
    username!: string

    @Field()
    password!: string
    
    @Field()
    email!: string
}

@InputType()
export class UserLoginType {
    @Field()
    username!: string

    @Field()
    password!: string
}

@InputType()
export class UserUpdateType {
    @Field()
    fullName?: string
    
    @Field()
    email?: string

    @Field()
    address?: string

    @Field()
    phoneNo?: string
}

