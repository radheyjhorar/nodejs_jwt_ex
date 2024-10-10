const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = "my-secret-key";

const app = express();

app.post('/login', (req, res) => {
  const user = {
    id: 1,
    username: 'johndoe',
    email: 'johndoe@example.com'
  }
  jwt.sign({user}, secretKey, {expiresIn : '300s'}, (err, token) => {
    res.json({token})
  })
})

app.post('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if(err) {
      res.send({result: 'Invalid token!', error: err});
    } else {
      res.json({
        message: "Profile accessed!",
        authData,
      });
    }
  })
})

function verifyToken(req, res, next) { 
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({result: 'Token is not valid'});
  }
  next()  
}

app.get('/', (req, res) => {
  res.json({
    message: "A Smaple API"
  })
})

app.listen(8080, () =>{
  console.log("App is running on 8080 port");
})