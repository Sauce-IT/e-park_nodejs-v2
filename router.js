const express = require("express");
const SerialPort = require("serialport");
const router = express.Router();
const axios = require("axios").default;
const url = "https://epark-project-api.herokuapp.com";

const parsers = SerialPort.parsers;

const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const port = new SerialPort("COM3", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

sampledata = [
  {
    slot: "no data",
    availability: "no data",
  }
];
userbook = [];
sampledata2 = [];
rates = [];
// routes -------------------------------

// user route ==================================================================================
router.get("/", (req, res) => {

  axios
  .post(url + "/getTodayBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  res.render("index",{slots:sampledata});
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
  .post(url + "/getuserbook", data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
        console.log('book',book);
              // check user booking
               for(var i = 0; i < book.length; i++){

                //check if the book is either paid or it is stil no expired
                if(book[i].book_status == 'paid' || book[i].book_status != 'expired')
                {
                  var paid_date = new Date(book[i].paid_date);
                  var date_expiration = new Date(paid_date.getTime() + (30 * 60000));
                  var now = new Date();
                  
                  //update book status if the aloted time overlap to the time givin 
                  if(now > date_expiration && book[i].date_entry == '0000-00-00 00:00:00')
                  {
                    if(book[i].book_status != 'expired' && book[i].paid_date != null){
                      const data = JSON.stringify({
                        booking_id: book[i].booking_id,
                        book_status: 'expired'
                      });

                      axios
                      .post(url + "/updateBookingstatus", data)
                      .then((response) => {
                            console.log('update to expired success!!!!!!!!!!!!!!!!!');
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
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
        userbook = null;
      });


  // available today slot
    axios
      .post(url + "/getTodayBookings", sampledata)
        .then((response) => {
          if (response.data.status["remarks"] === "success") {
            const slot = response.data.payload;
            sampledata = slot;
            console.log('slot available today',slot);
          } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          }).catch(function (error) {
          });
 
  // get current rates
  axios
      .post(url + "/getRate", sampledata)
        .then((response) => {
          // console.log(response);
          if (response.data.status["remarks"] === "success") {
            const rate = response.data.payload;
            rates = rate;
            console.log('Rate',rates);
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
  if (!req.session.user) return res.redirect("/user-login");
  res.render("user-profile",{currentUsers: req.session.user});
});


// admin route ===================================================================================
router.get("/admin-login", (req, res) => {
  res.render("adminclerk-login", { message: req.session.message });
});

router.get("/admin-changepass", (req, res) => {
  res.render("admin-change-password");
});

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
        console.log('slot',slot);
      } else {
          // sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });
      
  // get all user 
  axios
  .post(url + "/getAlluser", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('users',slot);
      } else {
          // sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  // available today slot
  axios
  .post(url + "/getTodayBookings", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata2 = slot;
        console.log('slot available today',slot);
      } else {
          // sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

     res.render("dashboard",{slots:userbook,users:sampledata,available:sampledata2});
});

router.get("/manage-parking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");


  // available today slot
  axios
  .post(url + "/getTodayBookings", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  // get current rates
  axios
  .post(url + "/getRate", sampledata)
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
        console.log('Rate',rates);
      } else {
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  res.render("manage-parking", { parkings:sampledata,rates:rates });
});

router.get("/manage-booking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  
 
  // get user booking info
  axios
  .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
        console.log('book',book);
              // check user booking
               for(var i = 0; i < book.length; i++){

                //check if the book is either paid or it is stil no expired
                if(book[i].book_status == 'paid' || book[i].book_status != 'expired')
                {
                  var paid_date = new Date(book[i].paid_date);
                  var date_expiration = new Date(paid_date.getTime() + (30 * 60000));
                  var now = new Date();
                  
                  //update book status if the aloted time overlap to the time givin 
                  if(now > date_expiration && book[i].date_entry == '0000-00-00 00:00:00')
                  {
                    if(book[i].book_status != 'expired' && book[i].paid_date != null){
                      const data = JSON.stringify({
                        booking_id: book[i].booking_id,
                        book_status: 'expired'
                      });

                      axios
                      .post(url + "/updateBookingstatus", data)
                      .then((response) => {
                            console.log('update to expired success!!!!!!!!!!!!!!!!!');
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
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
        userbook = null;
      });

  // All booking
  axios
  .post(url + "/getAllBookings", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  // available today slot
      axios
      .post(url + "/getTodayBookings", sampledata)
        .then((response) => {
          if (response.data.status["remarks"] === "success") {
            const slot = response.data.payload;
            userbook = slot;
            console.log('slot available today',slot);
          } else {
              res.redirect("/home");
              console.log(error);
            }
          }).catch(function (error) {
          });
  res.render("manage-booking",{allbooking:sampledata,slots:userbook});
});

router.get("/user-info", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  
 // get employee info
 axios
 .post(url + "/getEmployee")
   .then((response) => {
     if (response.data.status["remarks"] === "success") {
       const book = response.data.payload;
       userbook = book;
       console.log('book',book);
     } else {
        userbook = sampledata;
         res.redirect("/home");
         console.log(error);
       }
     }).catch(function (error) {
       userbook = sampledata;
     });


  res.render("user-info",{employee:userbook});
});

router.get("/user-logs", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");


  // All booking
  axios
  .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/user-logs");
          console.log(error);
        }
      });
  
  res.render("user-logs",{booking: sampledata});
});

router.get("/settings", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("settings");
});

// clerk route=================================================================================

router.get("/clerk-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  console.log(req.session.user);
  res.render("clerk-profile",{currentUsers: req.session.user});
});

router.get("/manage-booking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
    parser.on("data", function (data) {
      if (data.includes("camera")) {
        const check = data.split(":");
    
        if (check[1] === "detected") {
          console.log("detected", data);
        } else {
          console.log("not detected", data);
        }
      } else {
        console.log("not", data);
      }
    
      //console.log(data);
    });
  // All booking
  axios
  .post(url + "/getAllBookings", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  // available today slot
      axios
      .post(url + "/getTodayBookings", sampledata)
        .then((response) => {
          if (response.data.status["remarks"] === "success") {
            const slot = response.data.payload;
            userbook = slot;
            console.log('slot available today',slot);
          } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          }).catch(function (error) {
          });

      res.render("manage-booking-clerk",{allbooking:sampledata,slots:userbook});

});

router.get("/manage-parking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");


  // available today slot
  axios
  .post(url + "/getTodayBookings", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        console.log('slot available today',slot);
      } else {
          sampledata = sampledata;
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  // get current rates
  axios
  .post(url + "/getRate", sampledata)
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
        console.log('Rate',rates);
      } else {
          res.redirect("/home");
          console.log(error);
        }
      }).catch(function (error) {
      });

  res.render("manage-parking-clerk",{parkings:sampledata,rates:rates});
});


module.exports = router;
