import 'reflect-metadata'
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { UserType } from '../prisma/generated/type-graphql';
import { UserLoginType, UserRegisterType } from '../types/user.type';

@Resolver(() => UserType)
export class UserResolver {

    @Mutation(() => Boolean)
    async registerUser(@Arg('registerDetails') registerDetails: UserRegisterType) : Promise<Boolean>
    {
        try {
            await prisma.userType.create({
                data: {
                    username: registerDetails.username,
                    password: registerDetails.password,
                    email: registerDetails.email
                }
            });
    
            return true;
        }
        catch(e)
        {
            console.log(e);
            return false;
        }
    }

    @Mutation(() => UserType, {nullable: true})
    async loginUser(@Arg('loginDetails') {username, password}: UserLoginType,@Ctx() {req}:Context) : Promise<UserType | undefined> {
        const user = await prisma.userType.findFirst({
            where: {
                username: username
            }
        });

        if(!user)
            return undefined;
        
        if(user.password === password)
        {
            //@ts-ignore
            req.session.userid = user.id;
            return user;
        }
        
        return undefined;
    }   

    @Query(()=>UserType)
    async getCurrentUser(@Ctx() {req}:Context){
        //@ts-ignore
        return await prisma.userType.findFirst({where:{id:req.session.userid}});
    }
}

