const express = require("express");
const router = express.Router();
const axios = require("axios").default;

sampledata = [
  {
    slot: "no data",
    availability: "no data",
  }
];
userbook = [];
rates = [];
// routes -------------------------------

// user route
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/user-login", (req, res) => {
  res.render("user-login", { message: req.session.message });
});

router.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/user-login");
  
  const data = JSON.stringify({   
     id : req.session.user.id
  });
  
  // get user booking info
  axios
  .post("http://localhost/e-parkapi/getuserbook", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
        console.log(book);
      } else {
         userbook = null;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
        userbook = null;
      });


  // available today slot
    axios
      .post("http://localhost/e-parkapi/getTodayBookings", sampledata)
        .then((response) => {
          if (response.data.status["remarks"] === "success") {
            const slot = response.data.payload;
            sampledata = slot;
          } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          }).catch(function (error) {
          });
 
  // get current rates
  axios
      .post("http://localhost/e-parkapi/getRate", sampledata)
        .then((response) => {
          console.log(response);
          if (response.data.status["remarks"] === "success") {
            const rate = response.data.payload;
            rates = rate;
            console.log('aaaaaaaaaaaaaaa',rates);
          } else {
              res.redirect("/home");
              console.log(error);
            }
          }).catch(function (error) {
          });
 
    res.render("main",{
            slots:sampledata,
            userbook:userbook,
            rates:rates,
            currentUsers:req.session.user
        });
    });

router.get("/login", (req, res) => {
  res.render("user-login");
});

router.get("/register", (req, res) => {
  res.render("user-register");
});

router.get("/user-profile", (req, res) => {
  res.render("user-profile");
});


// admin route
router.get("/admin-login", (req, res) => {
  res.render("adminclerk-login", { message: req.session.message });
});

router.get("/admin-changepass", (req, res) => {
  res.render("admin-change-password");
});

router.get("/admin-dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("dashboard");
});

router.get("/manage-parking", (req, res) => {
  console.log('aaaaaaaaaaaaa',req.session.name);

  if (!req.session.user) return res.redirect("/admin-login");

  res.render("manage-parking", { sampledata: sampledata });
});

router.get("/manage-booking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("manage-booking");
});

router.get("/user-info", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("user-info");
});

router.get("/user-logs", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("user-logs");
});

router.get("/settings", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("settings");
});

// clerk route
// wala yung change pass (sangayon) wala talaga si admin gagawa nun

router.get("/clerk-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("clerk-profile");
});

router.get("/manage-booking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("manage-booking-clerk");
});

router.get("/manage-parking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("manage-parking-clerk");
});


module.exports = router;
