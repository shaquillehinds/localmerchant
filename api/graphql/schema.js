const Mutation = require("./mutations");
const RootQueryType = require("./query");
const { GraphQLSchema } = require("graphql");

const schema = new GraphQLSchema({ query: RootQueryType, mutation: Mutation });

module.exports = schema;
