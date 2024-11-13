const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const db = require("./db.js");
const knex = require("./database.js");

const typeDefs = `
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]! # One user can have many posts
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User! # Each post has one author
}

type Query {
  users: [User !]!
  posts: [Post!]!
  user(id: ID!): User
}
  input createUserInput {
    name: String!
    email: String!
    }
    type facility{
id: ID!
    name: String!
membercost: Int!
guestcost: Int!
initialoutlay: Int!
monthlymaintenance: Int!
    }

input insertfacility{
name: String!
membercost: Int!
guestcost: Int!
initialoutlay: Int!
monthlymaintenance: Int!
    }
input deleteFacility{
id: ID!}

  type Mutation {
    createFacility(input:insertfacility!): facility!
    deleteFacility(input: ID!): facility!
  }
`;

const resolvers = {
  Query: {
    users() {
      return db.users;
    },
    user(_, a) {
      return db.users.find((user) => user.id === a.id);
    },
  },
  User: {
    posts(parent) {
      return db.posts.filter((post) => post.author === parent.id);
    },
  },
  Mutation: {
    async createFacility(_, { input }) {
      try {
        const dbData = await knex("facility").insert(input).returning("*");
        return dbData[0];
      } catch (error) {
        console.log("intenel server error", error);
        throw error;
      }
    },
  },
  //   async deleteFacility(_, { input }) {
  //     try {
  //       const { id } = input;
  //       const dbData = await knex("facility")
  //         .where({ id: id })
  //         .del()
  //         .returning("*");
  //       return dbData[0];
  //     } catch (error) {
  //       console.log("intenel server error", error);
  //       throw error;
  //     }
  //   },
  // },
};

// const typeDefs = require("./schema.graphql/typeDef.js");
// const resolvers = require("./schema.graphql/resolvers.js");

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Start the server in an immediately invoked async function
(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });
  console.log(`🚀  Server ready at: ${url}`);
})();
