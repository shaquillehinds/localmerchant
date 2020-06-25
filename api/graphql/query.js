const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean } = require("graphql");
const { GraphQLJSONObject } = require("graphql-type-json");
const adminResolver = require("./resolvers/adminResolver");
const productsResolver = require("./resolvers/productsResolver");
const productResolver = require("./resolvers/productResolver");
const storesResolver = require("./resolvers/storesResolver");
const storeResolver = require("./resolvers/storeResolver");
const customerResolver = require("./resolvers/customerResolver");
const featuredResolver = require("./resolvers/featuredResolver");
const categoriesResolver = require("./resolvers/categoriesResolver");
const {
  StoreType,
  CustomerType,
  ProductType,
  AdminType,
  FeaturedType,
  CategoryType,
} = require("./types");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "root Query",
  fields: () => ({
    stores: {
      type: new GraphQLList(StoreType),
      description: "List of Stores",
      args: {
        industry: { type: GraphQLString },
        search: { type: GraphQLString },
        storeName: { type: GraphQLString },
        limit: { type: GraphQLInt },
        skip: { type: GraphQLInt },
      },
      resolve: async (parent, args, context) => await storesResolver(parent, args, context),
    },
    store: {
      type: StoreType,
      description: "Fetch a Store",
      args: { id: { type: GraphQLString }, storeURL: { type: GraphQLString } },
      resolve: async (parent, args, context) => await storeResolver(parent, args, context),
    },
    customer: {
      type: CustomerType,
      description: "Fetch a Customer",
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args, context) => await customerResolver(parent, args, context),
    },
    admin: {
      type: AdminType,
      description: "Fetch admin",
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args, context) => await adminResolver(parent, args, context),
    },
    products: {
      type: new GraphQLList(ProductType),
      description: "List of Products",
      args: {
        private: { type: GraphQLBoolean },
        store: { type: GraphQLString },
        tag: { type: GraphQLString },
        category: { type: GraphQLString },
        search: { type: GraphQLString },
        limit: { type: GraphQLInt },
        skip: { type: GraphQLInt },
        filter: { type: GraphQLString },
        sort: { type: GraphQLJSONObject },
      },
      resolve: async (parent, args, context) => await productsResolver(parent, args, context),
    },
    product: {
      type: ProductType,
      description: "Get a Product",
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args, context) => await productResolver(parent, args, context),
    },
    featured: {
      type: new GraphQLList(FeaturedType),
      description: "Get Featured Items",
      args: { category: { type: GraphQLString } },
      resolve: async (parent, args, context) => await featuredResolver(parent, args, context),
    },
    categories: {
      type: CategoryType,
      description: "Get Categories",
      args: { level: { type: GraphQLString }, category: { type: GraphQLString } },
      resolve: async (parent, args, context) => await categoriesResolver(parent, args, context),
    },
  }),
});

module.exports = RootQueryType;
