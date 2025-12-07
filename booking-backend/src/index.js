const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes/index');
const adminRoutes = require('./routes/adminRoutes/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
