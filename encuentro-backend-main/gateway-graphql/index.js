require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const bodyParser = require('body-parser');

const typeDefs = require('./schema/typeDefs');
const resolvers = require('./schema/resolvers');

async function startServer() {
  const app = express();

  app.get('/', (req, res) => {
    res.status(200).send('GraphQL is running');
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server)
  );

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL Gateway is running at http://localhost:${PORT}/api`);
  });
}

startServer();
