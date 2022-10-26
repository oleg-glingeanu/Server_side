const express = require('express');
require('dotenv').config();
const { graphqlHTTP } = require('express-graphql');
const colors = require('colors');
const schema = require('./database/schema/schema');
const connectDB = require('./database/config/db');
const cors = require('cors');
const port = 7000;

const app = express();

// Connect to db
connectDB();
app.use(cors());
app.get('/', (req, res) =>{
    res.send('App is running')
})
app.use(
    '/graphql', 
    graphqlHTTP({
        schema,
        graphiql: true,
})
);

app.listen(port, console.log(`Server running on ${port}`));