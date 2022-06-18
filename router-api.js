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
        if(response.data.payload['position'] == 'admin')
        {
          res.redirect("/admin-dashboard");
        }else{
          res.redirect("/manage-parking-clerk");
        }
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});
//clerk============================================================================================================

// update profile

router.post("/update-profile-clerk", (req, res) => {

  const data = JSON.stringify({
    name: req.body.name,
    email: req.body.email,
    id:  req.session.user.id,
    password:  req.body.password
  });
  console.log(data);
  axios
    .post("http://localhost/e-parkapi/updateProfileclerk", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        console.log(req.session.user);
        res.redirect("/clerk-profile");
      } else {
        // req.session.message = response.data.status["message"];
        res.redirect("/adminclerk-login");
      }
    })
    .catch(function (error) {
      res.redirect("/adminclerk-login");
    });
});

router.post("/change-rate", (req, res) => {
  const loginData = JSON.stringify({
    rate_price: req.body.rate,
    rate_type: req.body.type,
    rate_id: 1
  });

  axios
    .post("http://localhost/e-parkapi/updateRates", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        res.redirect("/manage-parking-clerk");
      } else {
        res.redirect("/user-login");
      }
    })
    .catch(function (error) {
      res.redirect("/user-login");
    });
});


//paid booking 
router.post("/update-paid", (req, res) => {
  const data = JSON.stringify({
    booking_id: req.body.booking_id,
    book_status: 'paid'
  });

  axios
    .post("http://localhost/e-parkapi/updateBookingstatus", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        res.redirect("/manage-booking-clerk");
      } else {
        res.redirect("/manage-booking-clerk");
      }
    })
    .catch(function (error) {
      res.redirect("/user-login");
      console.log(error);
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
        // req.session.user = response.data.payload;
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


//user profile update

router.post("/update-profile", (req, res) => {

  const data = JSON.stringify({
    name: req.body.user_name,
    mobile: req.body.user_mobile,
    email: req.body.user_email,
    password: req.body.user_password,
    id:  req.session.user.id
  });
  axios
    .post("http://localhost/e-parkapi/updateProfileuser", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        res.redirect("/user-profile");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/user-login");
      }
    })
    .catch(function (error) {
      res.redirect("/user-login");
    });
});

module.exports = router;
