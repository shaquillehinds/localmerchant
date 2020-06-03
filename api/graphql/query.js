const Store = require("../models/StoreModel");
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const mongoose = require("mongoose");
const { StoreType, ProductType, StoreFields } = require("./types");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLInt,
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
        (async () => {
          const item = await Featured.updateOne(
            { category: "weekly_trends", "weeklyViews.product": new mongoose.Types.ObjectId(args._id) },
            { $inc: { "weeklyViews.$.views": 1 } }
          );
          if (item.n !== 1) {
            const newItem = await Featured.findOne({
              category: "weekly_trends",
            });
            newItem.weeklyViews.push({ views: 1, product: args._id });
            newItem.save();
          }
        })();
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
    weeklyViews: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: "weeklyViews",
          fields: () => ({ views: { type: GraphQLInt }, product: { type: ProductType } }),
        })
      ),
      description: "Get Top Products",
      resolve: async (parent, args) => {
        // const weeklyViews = await Featured.findOne(
        //   { category: "weekly_trends" },
        //   { weeklyViews: 1, weeklyViews: { $slice: [0, 10] } },
        //   { sort: { "weeklyViews.views": -1 } }
        // )
        //   .populate({ path: "weeklyViews.product" })
        //   .exec();
        const weeklyViews = await Featured.aggregate([
          { $match: { category: "weekly_trends" } },
          { $unwind: "$weeklyViews" },
          { $sort: { "weeklyViews.views": -1 } },
          { $limit: 10 },
          { $project: { views: "$weeklyViews.views", product: "$weeklyViews.product" } },
          {
            $lookup: {
              from: "products",
              localField: "product",
              foreignField: "_id",
              as: "product",
            },
          },
          { $unwind: "$product" },
        ]);
        return weeklyViews;
      },
    },
  }),
});

module.exports = RootQueryType;
