const Store = require("../models/StoreModel");
const Product = require("../models/ProductModel");
const { StoreType, ProductType, StoreFields } = require("./types");
const {
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  description: "Update Database",
  fields: () => ({
    newStore: {
      type: StoreType,
      args: {
        ...StoreFields,
        password: { type: GraphQLString },
        coord: {
          type: new GraphQLInputObjectType({
            name: "coords",
            fields: () => ({
              lat: { type: GraphQLFloat },
              long: { type: GraphQLFloat },
            }),
          }),
        },
      },
      resolve: (parent, args) => {
        const store = new Store({
          firstName: args.firstName,
          lastName: args.lastName,
          password: args.password,
          businessName: args.businessName,
          businessURL: args.businessURL,
          email: args.email,
          phone: args.phone,
          industry: args.industry,
          address: args.address,
          coord: args.coord,
        });
        return store.save();
      },
    },
  }),
});

module.exports = Mutation;
