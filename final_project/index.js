const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const SECRET_KEY = process.env.SECRET_KEY || 'strong-secret-key'

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) return res.status(401).json({success: false, message: 'Token not provided!'});
  
    // Verify the token
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({success: false, message: 'Invalid token!'});
  
      req.user = user;
      next();
    });
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on port",PORT));

