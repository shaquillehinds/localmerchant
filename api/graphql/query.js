const Store = require("../models/StoreModel");
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const { StoreType, ProductType, StoreFields } = require("./types");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require("graphql");

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "root Query",
  fields: () => ({
    stores: {
      type: new GraphQLList(StoreType),
      description: "List of Stores",
      args: { industry: { type: GraphQLString } },
      resolve: async (parent, { industry }, { token }) => {
        let stores;
        if (industry) {
          stores = await Store.find({ industry });
        } else {
          stores = await Store.find();
        }

        return stores;
      },
    },
    store: {
      type: StoreType,
      description: "Fetch a Store",
      args: { _id: { type: GraphQLString } },
      resolve: (parent, args) => {
        if (args.id) {
          return Store.findById(args._id);
        }
      },
    },
    products: {
      type: new GraphQLList(ProductType),
      description: "List of Products",
      args: { store: { type: GraphQLString }, tag: { type: GraphQLString } },
      resolve: (parent, { store, tag }) => {
        if (store) {
          return Product.find({ store }).populate("store");
        } else if (tag) {
          return Product.find({ $text: { $search: tag } }, { tags: 0 });
        }
        return Product.find().populate("store");
      },
    },
    product: {
      type: ProductType,
      description: "Get a Product",
      args: { _id: { type: GraphQLString } },
      resolve: (parent, args) => {
        return Product.findById(args._id).populate("store");
      },
    },
    featured: {
      type: new GraphQLList(ProductType),
      description: "Get Featured Products",
      args: { category: { type: GraphQLString } },
      resolve: async (parent, { category }) => {
        const featured = await Featured.findOne({ category }).populate("products").exec();
        return featured.products;
      },
    },
  }),
});

module.exports = RootQueryType;
