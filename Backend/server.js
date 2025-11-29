const express = require('express');
const app = express();
const  morgan = require('morgan');
const { readdirSync } = require('fs');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const path = require('path');

app.use(morgan('dev'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cors());
connectDB();

readdirSync('./routes').map((r) => {
  app.use('/api/v1', require(`./routes/${r}`));
});

app.use('/uploads', express.static(path.join(__dirname,'uploads')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});