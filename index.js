const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const schema = require('./database/schema/schema');
const connectDB = require('./database/config/db');
const cors = require('cors');
const port = process.env.PORT;

const app = express();

// Connect to db
connectDB();
app.use(cors());

app.use(
    '/graphql', 
    graphqlHTTP({
        schema,
        graphiql: 'development' === process.env.NODE_ENV,
})
);

app.listen(port, console.log(`Server running on ${port}`));