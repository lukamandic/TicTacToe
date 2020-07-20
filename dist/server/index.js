"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
class Server {
    constructor(port) {
        this.port = port;
        this.server;
        this.typeDefs = ``;
        this.resolvers = {};
        this.pubsub = new apollo_server_1.PubSub();
    }
    addNewType(newType) {
        this.typeDefs += newType;
    }
    addNewResolver(newResolver) {
        var keys = Object.keys(newResolver);
        for (var x = 0; x < keys.length; x++) {
            this.resolvers[keys[x]] = newResolver[keys[x]];
        }
        return this.resolvers;
    }
    initializeServer() {
        this.server = new apollo_server_1.ApolloServer({
            typeDefs: this.typeDefs,
            resolvers: this.resolvers,
            playground: true,
            context: ({ req, res }) => ({ req, res, pubsub: this.pubsub })
        });
        this.server.listen(this.port).then(({ url }) => console.log(`server started at ${this.port}`));
    }
}
exports.default = Server;
