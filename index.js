const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const { hashSync, compareSync, compare } = require("bcryptjs");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const otpGenerator = require("otp-generator");
const cron = require("node-cron");

app.use(express.json());
app.use(cors());
app.use(
    session({
        secret: "jwtSecretKey",
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 1800000,
        }
        })
    );

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
  const sql = "SELECT * FROM users WHERE `email` = ?";

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



app.post('/emailverification', (req, res) => {
    const {email} = req.body;
    const sql = 'SELECT COUNT(*) as count FROM users WHERE `email` = ?';
    db.query(sql,[email],(err, results) => {
      if (err) {
        console.error('Error checking email existence: ', err);
        res.status(500).json({ error: 'An error occurred while checking email existence' });
      } else {
        const count = results[0].count;
        if (count > 0) {
          req.session.email = email;          
          res.json("email exits");
        } else {
          res.status(404).json({ error: 'Email not found in the database' });
        }
      }
    });
  });

  const emailverificationAndOldPassword = (req, res, next) => {
    const email = req.session.email;
    if (!email) {
      res.status(400).json({ error: 'Email not found in the session' });
      return;
    }
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql,email, (err, data) => {
      if (err) {
        return res.json("error");
      }
      if (data.length === 0) {
        return res.json({ message: "Email does not exist" });
      }
      if(data.length > 0){
      const isMatching = compareSync(req.body.password,data[0].password);
      if (!isMatching) {
        return res.json({ message: "Invalid  password" });
      } else {
        req.session.oldPassword = req.body.password;
        req.userData = data[0]; 
        const otp = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
      const updateOtpSql = "UPDATE users SET otp = ? WHERE email = ?";
      db.query(updateOtpSql, [otp, email], (err) => {
        if (err) {
          console.error('Error while updating OTP: ', err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        req.userData.otp = otp; 
       next();
      })
    }};
  })
};

  app.post('/checkOldPassword',emailverificationAndOldPassword, (req, res) => {
    return res.json({ message: "Old password is correct",otp : req.userData.otp});
  });

  app.post("/verifyOtp", (req, res) => {
    const email = req.session.email;
    const {otp} = req.body;  
    if (!email) {
      return res.status(400).json({ error: 'Email not found in the session' });
    }  
    if (!otp) {
      return res.status(400).json({ error: 'Please provide the OTP' });
    }    
    const sql = "SELECT * FROM users WHERE email = ? AND otp = ?";
    db.query(sql, [email, otp], (err, data) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }  
      if (data.length > 0) {
        const foundOtp = data[0].otp;
        const otpMatching = compare(otp,foundOtp);
        if(!otpMatching){
        return res.status(404).json({ error: "Invalid OTP" });
      } if(otpMatching){
        return res.json("The Otp is Valid");
      }
    }
    if(data.length === 0){
      return res.json("This OTP is Expired");
    }
  })
  })

  app.post('/CreateNewPassword', (req,res) =>{
    const email = req.session.email;
    if (!email) {
      return res.status(400).json({ error: 'Email not found in the session' });
    }
    if (!req.body.password) {
      return res.status(400).json({ error: 'Please provide the New Password' });
    }
    const sql1 = 'SELECT * FROM users WHERE `email` = ? ';
    db.query(sql1,[email,req.body.password],(err,data)=>{
        if(err){
            return res.json("Error");
        }
        if(data.length > 0){
            const matchPassword = compareSync(req.body.password,data[0].password);
            if(matchPassword){
              return res.json("This Password is already Exist.Please enter the New Password")
            }else{
            const sql2 = 'UPDATE users SET `password`= ? WHERE `email` =? ';
            const password = hashSync(req.body.password,10);
            db.query(sql2,[password,email],(err,data) =>{
                if(err){
                    return res.json("error")
                }
                res.json({
                    message:'your password has been updated'
                })
            }
                )
        }
      }
    })
})

const deleteExpiredOTP = () => {
 const sql = "UPDATE users SET otp = NULL WHERE otp IS NOT NULL AND created_at < (NOW() - INTERVAL 30 MINUTE)";

 db.query(sql, (err, res) => {
     if (err) {
       console.error("Error deleting expired OTPs: ", err);
     } 
   });
 };

 cron.schedule("* */10 * * * *", function() {
   deleteExpiredOTP();
 })

 const port = 3308;
app.listen(port, () => {
  console.log("server is running on " + port);
});
