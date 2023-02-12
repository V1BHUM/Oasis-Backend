import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default"
import { buildGQLSchema } from "./resolvers/schema";


export async function apolloServer() : Promise<ApolloServer> {
    const server = new ApolloServer({
        schema: await buildGQLSchema(),        
        introspection: true,
        plugins: [ApolloServerPluginLandingPageLocalDefault()]
    });

    await server.start();
    return server;
}