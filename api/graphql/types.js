const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

const StoreFields = {
  _id: { type: GraphQLString },
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  storeName: { type: GraphQLString },
  storeURL: { type: GraphQLString },
  image: { type: GraphQLString },
  email: { type: GraphQLString },
  phone: { type: GraphQLInt },
  industry: { type: GraphQLString },
  address: { type: GraphQLString },
  parish: { type: GraphQLString },
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
  }),
});

const FeaturedType = new GraphQLObjectType({
  name: "featured",
  fields: () => ({
    _id: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLFloat },
    storeName: { type: GraphQLString },
  }),
});

module.exports = {
  StoreFields,
  StoreType,
  CustomerType,
  AdminType,
  ProductType,
  FeaturedType,
};
