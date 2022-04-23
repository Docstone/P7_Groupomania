const express = require('express')
const { sequelize } = require('./models')
const rateLimit = require("express-rate-limit");
const helmet = require('helmet');
const xss = require('xss-clean');



const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();

if (process.env.NODE_ENV === 'production') {  
  app.use(helmet());
}

app.use(xss());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many request from this IP"
});
  

app.use(limiter);

app.use(express.json());

app.use('/auth', userRoutes);
app.use('/post', postRoutes)

app.listen({port: 5000}, async () => {
    console.log('Server up on http://localhost:5000')
    await sequelize.authenticate()
    console.log('Database Connected!')
})

module.exports = app;