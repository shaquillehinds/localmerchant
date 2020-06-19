const Store = require("../models/StoreModel");
const Customer = require("../models/CustomerModel");
const Admin = require("../models/AdminModel");
const Product = require("../models/ProductModel");
const Featured = require("../models/FeaturedModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {
  StoreType,
  CustomerType,
  ProductType,
  AdminType,
  FeaturedType,
  CategoryType,
} = require("./types");
const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLBoolean } = require("graphql");

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
      resolve: async (parent, { industry, search, storeName, limit = 25, skip = 0 }, context) => {
        if (search) {
          try {
            return await Store.findPartial("storeName", search);
          } catch (e) {
            return e;
          }
        }
        if (storeName) {
          try {
            return await Store.find(
              { $text: { $search: storeName } },
              { _id: 1, storeName: 1, storeURL: 1, image: 1, address: 1, phone: 1, parish: 1 }
            )
              .skip(skip)
              .limit(limit);
          } catch (e) {
            return e;
          }
        }
        let stores;
        console.log(context.token);
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
      args: { id: { type: GraphQLString }, storeURL: { type: GraphQLString } },
      resolve: (parent, { id, storeURL }, { token }) => {
        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded;
          });
          if (decoded) return Store.findById(decoded._id);
        }
        if (id) {
          return Store.findById(id);
        } else if (storeURL) {
          return Store.findOne({ storeURL });
        }
      },
    },
    customer: {
      type: CustomerType,
      description: "Fetch a Customer",
      args: { id: { type: GraphQLString } },
      resolve: (parent, args, context) => {
        if (args.id) {
          return Customer.findById(args.id);
        }
      },
    },
    admin: {
      type: AdminType,
      description: "Fetch admin",
      args: { id: { type: GraphQLString } },
      resolve: async (parent, args, context) => {
        try {
          const decoded = jwt.verify(context.token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return false;
            return decoded;
          });
          if (!decoded._id) {
            return "Unauthorized";
          }
          const admin = await Admin.findById(decoded._id);
          if (args.id && admin) {
            return Admin.findById(args.id);
          }
        } catch (e) {
          return e;
        }
      },
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
      },
      resolve: async (
        parent,
        { category: tags, store, tag, search, limit = 25, skip = 0, private = false },
        { token }
      ) => {
        if (search) {
          try {
            return await Product.findPartial("name", search);
          } catch (e) {
            return e;
          }
        } else if (store) {
          return await Product.find({ store }).populate("store").skip(skip).limit(limit);
        } else if (tag) {
          return await Product.find({ $text: { $search: tag } })
            .populate("store")
            .skip(skip)
            .limit(limit);
        } else if (tags) {
          return await Product.find({ tags }).populate("store").skip(skip).limit(limit);
        }
        if (token && private) {
          const store = jwt.verify(token, process.env.JWT_SECRET, (error, decrypted) => {
            if (error) return false;
            return decrypted._id;
          });
          return await Product.find({ store }).populate("store").skip(skip).limit(limit);
        }
        return Product.find().populate("store").skip(skip).limit(limit);
      },
    },
    product: {
      type: ProductType,
      description: "Get a Product",
      args: { id: { type: GraphQLString } },
      resolve: (parent, args) => {
        (async () => {
          const item = await Featured.updateOne(
            {
              category: "weekly_trends",
              "weeklyViews.product": new mongoose.Types.ObjectId(args.id),
            },
            { $inc: { "weeklyViews.$.views": 1 } }
          );
          if (item.n !== 1) {
            const newItem = await Featured.findOne({
              category: "weekly_trends",
            });
            newItem.weeklyViews.push({ views: 1, product: args.id });
            newItem.save();
          }
        })();
        return Product.findById(args.id).populate("store");
      },
    },
    featured: {
      type: new GraphQLList(FeaturedType),
      description: "Get Featured Items",
      args: { category: { type: GraphQLString } },
      resolve: async (parent, { category }) => {
        if (category === "stores") {
          const stores = await Featured.findOne({ category }).populate("stores").exec();
          return stores.stores;
        }
        const featured = await Featured.findOne({ category }).populate("items").exec();
        return featured.items;
      },
    },
    categories: {
      type: CategoryType,
      description: "Get Categories",
      args: { level: { type: GraphQLString }, category: { type: GraphQLString } },
      resolve: async (parent, { level, category }) => {
        const collection = mongoose.connection.db.collection("categories");
        if (level === "seven") return { subCategories: [] };
        if (category && level) {
          try {
            const test = await collection
              .aggregate([
                { $match: { level } },
                { $unwind: `$categories.${category}` },
                { $project: { category: `$categories.${category}` } },
                { $group: { _id: "$_id", category: { $push: "$category" } } },
              ])
              .toArray();
            if (test[0]) return { subCategories: test[0].category };
            return { subCategories: [] };
          } catch (e) {
            return e;
          }
        } else if (level) {
          const proj = await collection.findOne({ level });
          if (proj.categories) return { main: proj.categories };
        } else if (category) {
          const allLevels = await (await collection.find({})).toArray();
          return { all: allLevels };
        }
        return { subCategories: [] };
      },
    },
  }),
});

module.exports = RootQueryType;
