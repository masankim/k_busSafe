const express = require('express')
const router = express.Router()
const mysql = require('mysql2')

var connection = mysql.createConnection({
    //host: "192.168.0.5",
    host: "localhost",
    port: 3306, // db 포트
    user: "root", // user 이름
    password: "1234", // 비밀번호
    database: "bussafe", // database 이름
  });




//localhost:8080/signup get방식으로 요청이 들어오면 signup.ejs파일 errormessage로 데이터와 함께 HTML DOCUMENT를 변환한 데이터를 클라이언트에게 전송
router.get("/signup", function (req, res) {
  res.render("signup", { errormessage: null });
});


router.post("/signup", function (req, res) {
    // console.log(req.body)
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const division = req.body.division;
    let sql =  `select post_id from user_list where post_id=?`
    connection.query(sql,[id],
        function (err, users) {
        if (err) {
            res.render("signup", {
            errormessage: "오류 발생",
            user: req.session.loggedIn,
            });
        } else if (users.length > 0) {
            res.render("signup", {
            errormessage: "이미 존재하는 이메일",
            user: req.session.loggedIn,
            });
        } else {
            console.log(id);
            console.log(password);
            console.log(name);
            console.log(division);
            let sql = `insert into user_list (post_id, password, name, division, linkcode) values (?, ?, ?, ?, 1)`
            connection.query(sql,[id, password, name, division],
            function (err2, result) {
                if (err2) {
                res.render("signup", {
                    errormessage: "생성 오류",
                    user: req.session.loggedIn,
                });
                } else {
                console.log("생성완료");
                res.redirect("/login");
                }
            }
            );
        }
        }
    );
});


router.get("/login", function (req, res) {
    res.render("login", { error: false, user: req.session.loggedIn });
  });

router.post("/login", function (req, res) {
    const id = req.body.id;
    const password = req.body.password;
    let sql = "select * from user_list WHERE post_id=? and password=?"
    connection.query(sql,[id, password],
      function (err, users) {
        if (err) {
          console.log(err); // 오류
          res.send("error");
        } else if (users.length > 0) {
          req.session.loggedIn = users[0];
          if (users[0].linkcode == 0) {
            connection.query(
              "SELECT * FROM user_list where post_id = ?",
              [req.session.loggedIn.post_id],
              function (err, result, fields) {
                if (err) {
                  console.log(err);
                } else {
                  res.render("m_select_menu", {
                    userlist: result,
                    user: req.session.loggedIn,
                  });
                }
              }
            );
          } else {
            res.redirect("/car_list");
          }
        } else {
          //users "빈 list"
          res.render("login", { error: true, user: req.session.loggedIn });
        }
      }
    );
});
module.exports= router