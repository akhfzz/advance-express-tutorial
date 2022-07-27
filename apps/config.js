const exp = require('express');
const route = require('./route-api/api');

const app = exp();

app.use(exp.json())
app.use(route)

app.use((req, res, next) => {
    const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
         res.setHeader('Access-Control-Allow-Credentials', true)
         res.setHeader('Authorization')
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


module.exports = app