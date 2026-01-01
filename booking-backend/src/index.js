const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('query parser', 'extended'); // giúp nhận array từ query
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})

