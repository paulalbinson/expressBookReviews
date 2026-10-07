const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    // Write the authentication mechanism here
});
 
const PORT = 3002;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => {
    console.log("Server is running");

    // Tell PM2 this specific worker is fully booted and safe to handle traffic - Remove this if the app isn't managed by PM2
    if (process.send) {
        process.send('ready');
    }
});