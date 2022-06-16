const express = require("express");
const router = express.Router();
const axios = require("axios").default;


// admin login
router.post("/admin-login", (req, res) => {
  const loginData = JSON.stringify({
    admin_username: req.body.username,
    admin_password: req.body.password,
  });
  axios
    .post("http://localhost/e-parkapi/login-admin", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        res.redirect("/admin-dashboard");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});

// users===========================================================================================================

//user login
router.post("/user-login", (req, res) => {
  const loginData = JSON.stringify({
    user_email: req.body.username,
    user_password: req.body.password,
  });

  axios
    .post("http://localhost/e-parkapi/login-user", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        res.redirect("/home");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/user-login");
      }
    })
    .catch(function (error) {
      res.redirect("/user-login");
    });
});

//user registration
router.post("/register-user", (req, res) => {
  const loginData = JSON.stringify({
    user_name: req.body.user_name,
    user_email: req.body.user_email,
    user_mobile: req.body.user_mobile,
    user_password: req.body.user_password
  });

  axios
    .post("http://localhost/e-parkapi/register-user", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        res.redirect("/user-login");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/register");
      }
    })
    .catch(function (error) {
      res.redirect("/register");
    });
});

//add reservation 
router.post("/add-reservation", (req, res) => {


  //get current rate 
  var rates = 0;
  axios
  .post("http://localhost/e-parkapi/getRate")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        for(var i = 0; i < rate.length; i++){
           rates = rate[i].rate_price;
        
              
          var t = req.body.time;

          var total_price = rates * t;


          const data = JSON.stringify({
            slot_id: req.body.reserve_slot,
            user_id: req.session.user.id,
            plate: req.body.plate,
            total_price: total_price
          });
     
          axios
            .post("http://localhost/e-parkapi/addReserve", data)
            .then((response) => {
              if (response.data.status["remarks"] === "success") {
                   res.redirect("/home");
              } else {
                  res.redirect("/home");

              }
            });
           }
    } else {
      res.redirect("/home");
      console.log(error);
    }
  }).catch(function (error) {
    res.redirect("/");
  });    
});

//cancel booking 
router.post("/user-cancel-booking", (req, res) => {
  const data = JSON.stringify({
    booking_id: req.body.booking_id,
    book_status: 'cancel'
  });

  axios
    .post("http://localhost/e-parkapi/updateBookingstatus", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        res.redirect("/home");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/home");

        // res.redirect("/user-login");
      }
    })
    .catch(function (error) {
      res.redirect("/user-login");
      console.log(error);
    });
});


module.exports = router;
