const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const { GraphQLDateTime } = require("graphql-iso-date");
const { GraphQLJSONObject } = require("graphql-type-json");

const StoreFields = {
  _id: { type: GraphQLString },
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  storeName: { type: GraphQLString },
  storeURL: { type: GraphQLString },
  image: { type: GraphQLString },
  email: { type: GraphQLString },
  phone: { type: GraphQLInt },
  phone2: { type: GraphQLInt },
  industry: { type: GraphQLString },
  address: { type: GraphQLString },
  parish: { type: GraphQLString },
  createdAt: { type: GraphQLDateTime },
  updatedAt: { type: GraphQLDateTime },
  open: { type: new GraphQLList(GraphQLJSONObject) },
  categories: {
    type: new GraphQLList(
      new GraphQLObjectType({
        name: "Categories",
        fields: () => ({
          name: { type: GraphQLString },
          category: { type: new GraphQLList(GraphQLString) },
        }),
      })
    ),
  },
};

const StoreType = new GraphQLObjectType({
  name: "Store",
  fields: () => ({
    ...StoreFields,
    coord: {
      type: new GraphQLObjectType({
        name: "coord",
        fields: () => ({
          lat: { type: GraphQLFloat },
          long: { type: GraphQLFloat },
        }),
      }),
    },
  }),
});

const CustomerType = new GraphQLObjectType({
  name: "Customer",
  fields: () => ({
    _id: { type: GraphQLString },
    userName: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLInt },
    watchlist: { type: new GraphQLList(GraphQLString) },
    address: { type: GraphQLString },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
    coord: {
      type: new GraphQLObjectType({
        name: "coordc",
        fields: () => ({
          lat: { type: GraphQLFloat },
          long: { type: GraphQLFloat },
        }),
      }),
    },
  }),
});

const AdminType = new GraphQLObjectType({
  name: "Admin",
  fields: () => ({
    _id: { type: GraphQLString },
    userName: { type: GraphQLString },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLInt },
    address: { type: GraphQLString },
    rank: { type: GraphQLString },
  }),
});

const CategoryType = new GraphQLObjectType({
  name: "Product_Categories",
  fields: () => ({
    main: { type: GraphQLJSONObject },
    subCategories: { type: new GraphQLList(GraphQLString) },
    all: { type: new GraphQLList(GraphQLJSONObject) },
  }),
});

const ProductType = new GraphQLObjectType({
  name: "products",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    images: { type: new GraphQLList(GraphQLString) },
    description: { type: GraphQLString },
    price: { type: GraphQLFloat },
    tags: { type: new GraphQLList(GraphQLString) },
    store: { type: StoreType },
    inStock: { type: GraphQLBoolean },
    delivery: { type: GraphQLBoolean },
    createdAt: { type: GraphQLDateTime },
    updatedAt: { type: GraphQLDateTime },
  }),
});

const FeaturedType = new GraphQLObjectType({
  name: "featured",
  fields: () => ({
    _id: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLFloat },
    storeName: { type: GraphQLString },
    storeURL: { type: GraphQLString },
  }),
});

module.exports = {
  StoreFields,
  StoreType,
  CustomerType,
  AdminType,
  ProductType,
  FeaturedType,
  CategoryType,
};
