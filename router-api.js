const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const url = "https://epark-project-api.herokuapp.com";

// admin login =============================================================================================
router.post("/admin-login", (req, res) => {
  const loginData = JSON.stringify({
    admin_username: req.body.username,
    admin_password: req.body.password,
  });
  axios
    .post(url + "/login-admin", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        console.log(req.session.user);

        if (response.data.payload["position"] == "admin") {
          res.redirect("/admin-dashboard");
        } else {
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

// update availability
router.post("/changt-to-inactive", (req, res) => {
  const loginData = JSON.stringify({
    slot_id: req.body.slot_id,
    availability: "Inactive",
  });
  axios
    .post(url + "/updatePark", loginData)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        console.log(response.data);
        res.redirect("/manage-parking");
      } else {
        res.redirect("/manage-parking");
      }
    })
    .catch(function (error) {
      res.redirect("/manage-parking");
    });
});

router.post("/changt-to-active", (req, res) => {
  const loginData = JSON.stringify({
    slot_id: req.body.slot_id,
    availability: "Active",
  });
  axios
    .post(url + "/updatePark", loginData)
    .then((response) => {
      console.log(response, "report!!");
      if (response.data.status["remarks"] === "success") {
        if (req.session.user.position == "admin") {
          res.redirect("/manage-parking");
        } else {
          res.redirect("/manage-parking");
        }
      } else {
        res.redirect("/manage-parking");
      }
    })
    .catch(function (error) {
      console.log(error, "report error!!");

      res.redirect("/manage-parking");
    });
});

// add new slot
router.post("/Add-slot", (req, res) => {
  axios
    .post(url + "/add-slot")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        if (req.session.user.position == "admin") {
          res.redirect("/manage-parking");
        } else {
          res.redirect("/manage-parking-clerk");
        }
      } else {
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});

// add employee/ clerk
router.post("/add-employee", (req, res) => {
  const loginData = JSON.stringify({
    admin_name: req.body.admin_name,
    admin_username: req.body.admin_username,
    admin_password: req.body.admin_password,
  });
  axios
    .post(url + "/register-admin", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        res.redirect("/user-info");
      } else {
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});

// edit-employee
router.post("/edit-employee", (req, res) => {
  const loginData = JSON.stringify({
    admin_id: req.body.admin_id,
    admin_name: req.body.admin_name,
    admin_username: req.body.admin_username,
    admin_password: req.body.admin_password,
  });
  axios
    .post(url + "/updateClerk", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        res.redirect("/user-info");
      } else {
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});

//clerk============================================================================================================
// scan-booking test

router.post("/scan-booking", (req, res) => {
  var booking_id = req.body.booking_id.split(":")[1];

  const data = JSON.stringify({
    booking_id: booking_id,
  });
  console.log(data);
  axios
    .post(url + "/scan", data)
    .then((response) => {
      var data = response.data.status["remarks"];
      console.log(data);
      res.redirect("/manage-booking-clerk");
    })
    .catch(function (error) {
      res.redirect("/manage-booking-clerk");
    });
});

// update profile
router.post("/update-profile-clerk", (req, res) => {
  const data = JSON.stringify({
    name: req.body.name,
    email: req.body.email,
    id: req.session.user.id,
    password: req.body.password,
  });
  console.log(data);
  axios
    .post(url + "/updateProfileclerk", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        req.session.user = response.data.payload;
        console.log(req.session.user);
        res.redirect("/clerk-profile");
      } else {
        res.redirect("/admin-login");
      }
    })
    .catch(function (error) {
      res.redirect("/admin-login");
    });
});

router.post("/change-rate", (req, res) => {
  const loginData = JSON.stringify({
    rate_price: req.body.rate,
    rate_type: req.body.type,
    rate_id: 1,
  });

  axios
    .post(url + "/updateRates", loginData)
    .then((response) => {
      console.log(response);
      if (response.data.status["remarks"] === "success") {
        res.redirect("/manage-parking");
      } else {
        res.redirect("/manage-parking");
      }
    })
    .catch(function (error) {
      res.redirect("/manage-parking");
    });
});

//paid booking
router.post("/update-paid", (req, res) => {
  const data = JSON.stringify({
    booking_id: req.body.booking_id,
    book_status: "paid",
  });

  axios
    .post(url + "/updateBookingstatus", data)
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

// admin log out
router.post("/admin-logout", (req, res) => {
  const data = JSON.stringify({
    admin_id: req.session.user.id,
  });
  console.log(data);
});
// users===========================================================================================================

//user login
router.post("/user-login", (req, res) => {
  const loginData = JSON.stringify({
    user_email: req.body.username,
    user_password: req.body.password,
  });

  axios
    .post(url + "/login-user", loginData)
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
    user_password: req.body.user_password,
  });

  axios
    .post(url + "/register-user", loginData)
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
    .post(url + "/getRate")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        for (var i = 0; i < rate.length; i++) {
          rates = rate[i].rate_price;
          var t = req.body.time;
          var total_price = rates * t;

          const data = JSON.stringify({
            slot_id: req.body.reserve_slot,
            user_id: req.session.user.id,
            plate: req.body.plate,
            hrs: req.body.time,
            total_price: total_price,
          });

          axios.post(url + "/addReserve", data).then((response) => {
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
    })
    .catch(function (error) {
      res.redirect("/");
    });
});

//cancel booking
router.post("/user-cancel-booking", (req, res) => {
  const data = JSON.stringify({
    booking_id: req.body.booking_id,
    book_status: "cancel",
  });

  axios
    .post(url + "/updateBookingstatus", data)
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

router.post("/clerk-cancel-booking", (req, res) => {
  const data = JSON.stringify({
    booking_id: req.body.booking_id,
    book_status: "cancel",
  });

  axios
    .post(url + "/updateBookingstatus", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        // req.session.user = response.data.payload;
        res.redirect("/manage-booking-clerk");
      } else {
        req.session.message = response.data.status["message"];
        res.redirect("/manage-booking-clerk");

        // res.redirect("/user-login");
      }
    })
    .catch(function (error) {
      res.redirect("/manage-booking-clerk");
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
    id: req.session.user.id,
  });
  axios
    .post(url + "/updateProfileuser", data)
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
