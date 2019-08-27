const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect DB
connectDB();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API Runing'));

app.listen(PORT, () => console.log(`Server is running at port: ${PORT}`));
