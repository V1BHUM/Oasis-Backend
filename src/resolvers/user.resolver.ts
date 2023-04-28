import 'reflect-metadata'
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Context, prisma } from '../app';
import { UserType } from '../prisma/generated/type-graphql';
import { UserLoginType, UserRegisterType, UserUpdateType } from '../types/user.type';

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
        console.log("Login Called");
        const user = await prisma.userType.findFirst({
            where: {
                username: username
            }
        });

        if(!user)
        {
            console.log("User not found " + username);
            return undefined;
        }
            
        
        if(user.password === password)
        {
            
            req.session.userId = user.id;
            console.log(`Logged In ${req.session.id}`);
            return user;
        }
        
        return undefined;
    }

    @Mutation(() => UserType)
    async updateUser(@Ctx() {req}: Context, @Arg('input') input: UserUpdateType) : Promise<UserType>
    {
        const user = await prisma.userType.update({
            where: {
                id: req.session.userId
            },
            data: {
                ...input
            }
        })
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Ctx() {req}: Context) : Promise<Boolean>
    {
        const user = await prisma.userType.delete({
            where: {
                id: req.session.userId
            }
        });

        return true;
    }

    @Mutation(() => Boolean)
    async logoutUser(@Ctx() { req, res }: Context): Promise<boolean> {
        let loggedOut: boolean = false;
		req.session.destroy((err) => {
			res.clearCookie("auth");
            console.log("Logged out user");
			if (err) {
                console.log(err);
				return false;
			} else {
                loggedOut = true;
				return true;
			}
		});
		return await new Promise(resolve => {
            if(loggedOut) resolve(true);
        });
	}

    @Query(()=>UserType)
    async getCurrentUser(@Ctx() {req}:Context){
        console.log(`Cookie: ${req.session.cookie.path}`);
        console.log(`UserID: ${req.session.userId}`);
        console.log(`Session: ${req.session.id}`);

        let temp;
        try {
            temp = await prisma.userType.findUniqueOrThrow({where:{id:req.session.userId}});
        }
        catch(e)
        {
            console.error(e);
        }
        return temp;
    }

    @Query(() => [UserType])
    async getAllUsers() : Promise<UserType[]>
    {
        return await prisma.userType.findMany();
    }
}

