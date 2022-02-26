const { ApolloServer, gql } = require("apollo-server");
// const { getDB } = require("./mysql");
const db = require('./database');

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Todo {
    id: Int,
    description: String
    isFinished: Boolean
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }
  
  type Mutation {
    updateTodo(
      id: Int, 
      description: String
      isFinished: Boolean
    ): String
    createTodo(
      description: String,
    ): String
    deleteTodo(id: Int): String
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    todos: async () => db.todos.findAll(),
    todo: async (obj, args, context, info) =>
        db.todos.findByPk(args.id),
  },
  Mutation: {
    createTodo: async (root, args, context, info) => {
      let todo = await db.todos.create({
        description: args.description,
        // isFinished: args.isFinished,
      });
      return todo.id;
    },
    updateTodo: async (root, args, context, info) => {
      if (!args.id) return;
      let todo = await db.todos.update({
        description: args.description,
        isFinished: args.isFinished,
      }, {
        where: {id: args.id}
      });
      return 'Update Success!';
    },
    deleteTodo: async (root, args, context, info) => {
      if (!args.id) return;
      let todo = await db.todos.destroy({
        where: {
          id: args.id
        }
      })
      return 'Delete success!';
    }
  }
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
