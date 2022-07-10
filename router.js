const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const url = "https://epark-project-api.herokuapp.com";

sampledata = [
  {
    slot: "no data",
    availability: "no data",
  },
];
userbook = [];
sampledata2 = [];
rates = [];
// routes -------------------------------

// user route ==================================================================================
// --ok
router.get("/", (req, res) => {
  axios
    .post(url + "/getTodayBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log("slot available today", slot);
        res.render("index", { slots: sampledata });
      } else {
        sampledata = sampledata;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

router.get("/user-login", (req, res) => {
  if (req.session.user) return res.redirect("/home");

  let message = req.session.message;
  req.session = null;

  res.render("user-login", { message: message });
});

router.get("/logout", (req, res) => {
  req.session = null;

  res.redirect("/user-login");
});

router.get("/admin-logout", (req, res) => {
  req.session = null;

  res.redirect("/admin-login");
});

// --ok
router.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/user-login");

  // get current rates
  axios
    .post(url + "/getRate")
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
        console.log("Rate", rates);

        // available today slot
        axios
          .post(url + "/getTodayBookings")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
              console.log("slot available today", slot);

              const data = JSON.stringify({
                id: req.session.user.id,
              });

              // get user booking info
              axios
                .post(url + "/getuserbook", data)
                .then((response) => {
                  if (response.data.status["remarks"] === "success") {
                    const book = response.data.payload;
                    userbook = book;

                    console.log("book", book);
                    // check user booking
                    for (var i = 0; i < book.length; i++) {
                      //check if the book is either paid or it is stil no expired
                      if (
                        book[i].book_status == "paid" ||
                        book[i].book_status != "expired"
                      ) {
                        var paid_date = new Date(book[i].paid_date);
                        var date_expiration = new Date(
                          paid_date.getTime() + 60 * 60000
                        );
                        var now = new Date();

                        //update book status if the aloted time overlap to the time givin
                        if (
                          now > date_expiration &&
                          book[i].date_entry == null
                        ) {
                          if (
                            book[i].book_status != "expired" &&
                            book[i].paid_date != null
                          ) {
                            const data = JSON.stringify({
                              booking_id: book[i].booking_id,
                              book_status: "expired",
                            });

                            axios
                              .post(url + "/updateBookingstatus", data)
                              .then((response) => {
                                console.log(
                                  "update to expired success!!!!!!!!!!!!!!!!!"
                                );
                              })
                              .catch(function (error) {
                                res.redirect("/user-login");
                              });
                          }
                        }
                      }
                    }
                  } else {
                    userbook = null;

                    console.log(error);
                  }
                  // navigation
                  res.render("main", {
                    slots: sampledata,
                    userbook: userbook,
                    rates: rates,
                    currentUsers: req.session.user,
                  });
                })
                .catch(function (error) {
                  userbook = null;
                  // navigation
                  res.render("main", {
                    slots: sampledata,
                    userbook: userbook,
                    rates: rates,
                    currentUsers: req.session.user,
                  });
                });
            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

router.get("/login", (req, res) => {
  res.render("user-login");
});

router.get("/register", (req, res) => {
  res.render("user-register");
});

router.get("/user-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/user-login");
  res.render("user-profile", { currentUsers: req.session.user });
});

// admin route ===================================================================================
router.get("/admin-login", (req, res) => {
  let message = req.session.message;
  req.session = null;

  res.render("adminclerk-login", { message: message });
});

router.get("/admin-changepass", (req, res) => {
  res.render("admin-change-password");
});

// --ok
router.get("/admin-dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  console.log(req.session.user.position);

  //get parking slot
  axios
    .post(url + "/getSlot", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        userbook = slot;
        console.log("slot", slot);

        // get all user
        axios
          .post(url + "/getAlluser", sampledata)
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
              console.log("users", slot);

              // available today slot
              axios
                .post(url + "/getTodayBookings", sampledata)
                .then((response) => {
                  if (response.data.status["remarks"] === "success") {
                    const slot = response.data.payload;
                    sampledata2 = slot;
                    console.log("slot available today", slot);
                  } else {
                    // sampledata = sampledata;
                    res.redirect("/home");
                    console.log(error);
                  }

                  // navigation
                  res.render("dashboard", {
                    slots: userbook,
                    users: sampledata,
                    available: sampledata2,
                  });
                })
                .catch(function (error) {});
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        // sampledata = sampledata;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

// --ok
router.get("/manage-parking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  // get current rates
  axios
    .post(url + "/getRate", sampledata)
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
        console.log("Rate", rates);

        // available today slot
        axios
          .post(url + "/getTodayBookings", sampledata)
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
              console.log("slot available today", slot);
            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
            // navigation
            res.render("manage-parking", {
              parkings: sampledata,
              rates: rates,
            });
          })
          .catch(function (error) {});
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

// --ok
router.get("/manage-booking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // expiration get user booking info
  axios
    .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        sampledata = book;
        // console.log('book',book);
        // check user booking
        for (var i = 0; i < book.length; i++) {
          //check if the book is either paid or it is stil no expired
          if (
            book[i].book_status == "paid" ||
            book[i].book_status != "expired"
          ) {
            var paid_date = new Date(book[i].paid_date);
            var date_expiration = new Date(paid_date.getTime() + 60 * 60000);
            var now = new Date();

            //update book status if the aloted time overlap to the time givin
            if (now > date_expiration && book[i].date_entry == null) {
              if (
                book[i].book_status != "expired" &&
                book[i].paid_date != null
              ) {
                const data = JSON.stringify({
                  booking_id: book[i].booking_id,
                  book_status: "expired",
                });

                axios
                  .post(url + "/updateBookingstatus", data)
                  .then((response) => {
                    console.log("update to expired success!!!!!!!!!!!!!!!!!");
                  })
                  .catch(function (error) {
                    res.redirect("/user-login");
                  });
              }
            }
          }
        }

        // available today slot
        axios
          .post(url + "/getTodayBookings")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              userbook = slot;

              // naviigation
              res.render("manage-booking", {
                allbooking: sampledata,
                slots: userbook,
              });
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        userbook = null;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {
      userbook = null;
    });
});

// ok
router.get("/user-info", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // get employee info
  axios
    .post(url + "/getEmployee")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
        console.log("book", book);
      } else {
        userbook = sampledata;
        res.redirect("/home");
        console.log(error);
      }

      res.render("user-info", { employee: userbook });
    })
    .catch(function (error) {
      userbook = sampledata;
    });
});

router.get("/user-logs", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // All booking
  axios.post(url + "/getAllBookings").then((response) => {
    if (response.data.status["remarks"] === "success") {
      const slot = response.data.payload;
      sampledata = slot;
      console.log("slot available today", slot);
    } else {
      sampledata = sampledata;
      res.redirect("/user-logs");
      console.log(error);
    }
    res.render("user-logs", { booking: sampledata });
  });
});

router.get("/settings", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("settings");
});

// clerk route=================================================================================

// --ok
router.get("/clerk-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  console.log(req.session.user);
  res.render("clerk-profile", { currentUsers: req.session.user });
});

// --ok
router.get("/manage-booking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // ===========================================================================Scanning=============
  // expiration get user booking info
  axios
    .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        sampledata = book;
        // console.log('book',book);
        // check user booking
        for (var i = 0; i < book.length; i++) {
          //check if the book is either paid or it is stil no expired
          if (
            book[i].book_status == "paid" ||
            book[i].book_status != "expired"
          ) {
            var paid_date = new Date(book[i].paid_date);
            var date_expiration = new Date(paid_date.getTime() + 60 * 60000);
            var now = new Date();

            //update book status if the aloted time overlap to the time givin
            if (now > date_expiration && book[i].date_entry == null) {
              if (
                book[i].book_status != "expired" &&
                book[i].paid_date != null
              ) {
                const data = JSON.stringify({
                  booking_id: book[i].booking_id,
                  book_status: "expired",
                });

                axios
                  .post(url + "/updateBookingstatus", data)
                  .then((response) => {
                    console.log("update to expired success!!!!!!!!!!!!!!!!!");
                  })
                  .catch(function (error) {
                    res.redirect("/user-login");
                  });
              }
            }
          }
        }

        // available today slot
        axios
          .post(url + "/getTodayBookings")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              userbook = slot;

              // naviigation
              res.render("manage-booking-clerk", {
                allbooking: sampledata,
                slots: userbook,
              });
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        userbook = null;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {
      userbook = null;
    });
});

// --ok
router.get("/manage-parking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // get current rates
  axios
    .post(url + "/getRate")
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
        console.log("Rate", rates);

        // available today slot
        axios
          .post(url + "/getTodayBookings")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
              console.log("slot available today", slot);

              res.render("manage-parking-clerk", {
                parkings: sampledata,
                rates: rates,
              });
            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
        // end available
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

module.exports = router;
