const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");

const StoreFields = {
  firstName: { type: GraphQLString },
  lastName: { type: GraphQLString },
  businessName: { type: GraphQLString },
  businessURL: { type: GraphQLString },
  email: { type: GraphQLString },
  phone: { type: GraphQLInt },
  industry: { type: GraphQLString },
  address: { type: GraphQLString },
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

const ProductType = new GraphQLObjectType({
  name: "products",
  fields: () => ({
    _id: { type: GraphQLString },
    name: { type: GraphQLString },
    image: { type: GraphQLString },
    price: { type: GraphQLFloat },
    tags: { type: new GraphQLList(GraphQLString) },
    store: { type: StoreType },
    inStock: { type: GraphQLBoolean },
  }),
});

module.exports = {
  StoreFields,
  StoreType,
  ProductType,
};
