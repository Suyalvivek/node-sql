const faker = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app= express();
const path = require("path");//from express
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
//CONNECTION
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "root@1004",
});

// let getRandomUser = () => {
//   return [
//     faker.string.uuid(),
//     faker.internet.username(),
//     faker.internet.email(),
//     faker.internet.password(),
//   ];
// };

// //INSERTING NEW DATA
// let q = "INSERT INTO user(id,username,email,password) VALUES ?";
// let data = [];
// for (let i = 1; i <= 100; i++) {
//   data.push(getRandomUser());
//   //100 fake users data
// }


// let users = [
//   ["789", "abc@789", "abc789@gmail.com", "789abc"],
//   ["456", "abc@456", "abc456@gmail.com", "456abc"],
// ];
// try {
//   connection.query(q, [data], (err, result) => {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log(result);
//       // console.log(result.length);
//       // console.log(result[0]);
//       // console.log(result[1]);
//     }
//   });
// } catch (error) {
//   console.log(error);
// }

//DESTROYING CONNECTIONn
// connection.end();

app.get("/",(req,res)=>{
    let q = "SELECT count(*) FROM USER";
    try {
          connection.query(q, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              let count = result[0]["count(*)"];
              res.render("home.ejs",{count});
            }
          });
        } catch (error) {
          console.log(error);
          res.send("some error in db");
        }
})
// SHOW ROUTE
app.get("/user",(req,res)=>{
    let q = `SELECT * FROM USER`;
    try {
        connection.query(q, (err, users) => {
          if (err)throw err
          res.render("showusers.ejs",{users});
        });
      } catch (error) {
        console.log(error);
        res.send("some error in db");
      }
})
//EDIT ROUTE
app.get("/user/:id/edit",(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM USER WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
          if (err)throw err
        //   console.log(result[0]);
        let user = result[0];
          res.render("edit.ejs",{user});
        });
      } catch (error) {
        console.log(error);
        res.send("some error in db");
      }
})
//UPDATE ROUTE(DB)
app.patch("/user/:id/",(req,res)=>{
  // 1.search id.
  // 2.check if password is same
  // 3.if same update
    let {id} = req.params;
    let {password:formPassword,username:newUsername} = req.body;
    let q = `SELECT * FROM USER WHERE id = '${id}'`;
    try {
        connection.query(q, (err, result) => {
          if (err)throw err
        //   console.log(result[0]);
        let user = result[0];
        if(formPassword!=user.password){
          res.send("Wrong Password");
        }
        else{
          let q2 = `UPDATE USER SET username = '${newUsername}' WHERE id = '${id}'`;
          connection.query(q2, (err, result) => {
            if (err)throw err
            res.redirect("/user");
          });
        }
        });
      } catch (error) {
        console.log(error);
        res.send("some error in db");
      }

})
app.listen("8080",()=>{
    console.log("server is listening on port 8080");
})