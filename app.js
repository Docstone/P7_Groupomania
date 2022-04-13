const express = require('express')

const { sequelize } = require('./models')

async function main(){
    await sequelize.sync()
}

main()
const userRoutes = require('./routes/user');
const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use(express.json());

app.use('/auth', userRoutes);

app.listen({port: 5000}, async () => {
    console.log('listening to port:5000')
    await sequelize.sync()
    console.log('Database Synced')
})

module.exports = app;