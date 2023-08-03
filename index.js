const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const { hashSync, compareSync } = require("bcryptjs");
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "5002186",
  database: "jwt",
});

app.post("/register", (req, res) => {
  if (req.body) {
    if (!req.body.email) {
      return res.json("please enter the email");
    }
    if (!req.body.password) {
      return res.json("please enter the password");
    }

    if (req.body.email && req.body.password) {
      const sql2 = "SELECT * FROM users WHERE `email` = ? ";
      db.query(sql2, [req.body.email], (err, data) => {
        if (err) {
          return res.json("Error");
        }
        if (data.length > 0) {
          return res.json("The email is already registered");
        } else {
          const sql = "INSERT INTO users (`email`, `password`) VALUES (?,?)";
          const password = hashSync(req.body.password, 10);
          const values = [req.body.email, password];
          db.query(sql, values, (err, data) => {
            if (err) {
              return res.json("error");
            }
            return res.json({ messgae: "successfully Signed Up", data: data });
          });
        }
      });
    }
  }
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE `email` = ? ";
  db.query(sql, [req.body.email], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    if (data.length > 0) {
      const id = data[0].id;
      const isMatching = compareSync(req.body.password, data[0].password);
      if (!isMatching) {
        return res.json("Invalid Credentials");
      }
      const token = jwt.sign({ id }, "jwtSecretKey", { expiresIn: 3000 });
      return res.json({ message: "Login Successfull", token, data });
    }
  });
});

const verifyJWT = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json("We need a valid token, please provide it");
  } else {
    jwt.verify(token, "jwtSecretKey", (err, decoded) => {
      if (err) {
        return res.json("Invalid Token");
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.get("/CheckAuth", verifyJWT, (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    res.json({
      message: "Authenticated",
      data: data,
    });
  });
});

app.post('/ForgotPassword', (req,res) =>{
  const sql1 = 'SELECT * FROM users WHERE `email` = ? ';
  db.query(sql1,req.body.email,(err,data)=>{
      if(err){
          return res.json("the entered email is invalid")
      }
      if(data.length > 0){
          const id = data[0].id;
          const sql2 = 'UPDATE users SET `password`= ? WHERE `email` =? ';
          const password = hashSync(req.body.password,10);
          db.query(sql2,[password,req.body.email],(err,data) =>{
              if(err){
                  return res.json("error")
              }
              res.json({
                  message:'your password has been updated'
              })
          }
              )
      }
  })
})

const port = 3308;
app.listen(port, () => {
  console.log("server is running on " + port);
});