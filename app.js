const express = require('express');
const bodyp = require('body-parser');
const geoip = require('geoip-lite');
const app = express();
const https = require('https');
const func1 = require(__dirname + "/func1.js");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const publicIp = require('public-ip');
app.set('view engine', 'ejs');
var localIpV4Address = require("local-ipv4-address");

app.use(session({
  secret: "my weather secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://admin-eisa:@cluster0.4vxhn.mongodb.net/WAUsers?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("useCreateIndex", true);


const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  city1: String,
  city2: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


app.use(bodyp.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  if (req.isAuthenticated()){
  res.render('main', {opt:1});}
  else{
    res.render('main', {opt:0});
  }
});

app.get("/mult_days", function(req, res) {
  if (req.isAuthenticated()){
    res.render('mult_main', {opt:1});}
  else{
    res.render('mult_main', {opt:0});
  }
});

app.get("/about", function(req, res){
  if (req.isAuthenticated()){
  var geo = geoip.lookup(req.connection.remoteAddress);
  console.log(geo);
  res.render("about", {
    location:geo,
    auth: 1
  });}
  else {
    res.render("about", {
      location:geo,
      auth: 0
    });
  }
});

app.get("/how", function(req, res){
  if (req.isAuthenticated()){
    res.render('how', {opt:1});}
  else{
    res.render('how', {opt:0});
  }
});

app.get("/auth", function(req, res){
  if (req.isAuthenticated()){

  }
  else{
  res.render('auth', {
    opt: 0
  });}
});

app.post("/auth", function(req, res){
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  req.login(user, function(err){
    if (err){
      res.render('auth', {
        opt: 1
      });
      console.log(err);
    }else{
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      });
    }
  });
});

app.get("/register", function(req, res){
  if (req.isAuthenticated()){}
  else{
  res.render('register');}
});

app.post("/register", function(req, res){
  User.register({username: req.body.username, city1:"Hawaii", city2:"Lhasa"}, req.body.password, function (err, user) {
    if(err){
      console.log(err);
      res.redirect("/register");
    } else{
      passport.authenticate("local")(req, res, function () {
        res.redirect("/");
      })
    }
  });
});

app.get("/logout", function(req, res){
  if (req.isAuthenticated()){
  req.logout();
  res.redirect("/");}
  else{

  }
});

app.post("/", function(req, res) {
  var city = req.body.city;
  var kind = req.body.radio;
  var temp_type;

  wdata = func1.manage_first_page(city, kind);
  if (kind == "option2") {
    temp_type = "Celsius";
  } else if (kind == "option1") {
    temp_type = "Fahrenheit";
  } else {
    temp_type = "Kelvin";
  }
  setTimeout(function() {
    if (wdata.cod == "200") {
      img_url = "http://openweathermap.org/img/wn/" + wdata.weather[0].icon + "@2x.png";
      if (req.isAuthenticated()){
        User.updateOne(
            {_id: req.user._id},
            {$set:{city2: req.user.city1,
            city1: city}}
        , function (err){
          if (err){ console.log(err);
          console.log("error")};
        });
        req.session.reload(function () {

        });
      res.render('list', {
        weather: wdata.weather[0].description,
        city: wdata.name,
        type: wdata.main.temp,
        ttype: temp_type,
        pic: img_url,
        feel: wdata.main.feels_like,
        hum: wdata.main.humidity,
        press: wdata.main.pressure,
        tmin: wdata.main.temp_min,
        tmax: wdata.main.temp_max,
        opt:1
      });}else{
        res.render('list', {
          weather: wdata.weather[0].description,
          city: wdata.name,
          type: wdata.main.temp,
          ttype: temp_type,
          pic: img_url,
          feel: wdata.main.feels_like,
          hum: wdata.main.humidity,
          press: wdata.main.pressure,
          tmin: wdata.main.temp_min,
          tmax: wdata.main.temp_max,
          opt:0
        });
      }
    } else {
      res.render('error');
    }
  }, 500);
});

app.post("/mult_days", function(req, res) {
  var city = req.body.city;
  var kind = req.body.radio;
  var day = parseInt(req.body.day);

  var temp_type;
  wdata = func1.manage_second_page(city, kind);
  setTimeout(function() {
    if (wdata.cod == "200") {
      wdata = func1.data_edit(wdata);
      setTimeout(function() {
        inp = func1.num(wdata, day);
        if (req.isAuthenticated()){
          User.updateOne(
              {_id: req.user._id},
              {$set:{city2: req.user.city1,
                  city1: city}}
              , function (err){
                if (err){ console.log(err);
                  console.log("error")};
              });
          req.session.reload(function () {

          });
        res.render('list_mult', {
          input: inp,
          city: wdata.city.name,
          opt:1
        });}else{
          res.render('list_mult', {
            input: inp,
            city: wdata.city.name,
            opt:0
          });
        }
      }, 100);
    } else {
      res.render('error');
    }
  }, 300);
});

app.get("/profile", function(req, res){
  if (req.isAuthenticated()){
    //var geo = geoip.lookup(req.connection.remoteAddress);
    var ip;
    localIpV4Address().then(function(ipAddress){
      ip = ipAddress;
      // My IP address is 10.4.4.137
    });
    var geo = geoip.lookup("69.158.246.65");
    var wdata, img_url, img_url3;
    func1.manage_profile(geo.city, req.user.city1, req.user.city2, function (wdata) {
      img_url = "http://openweathermap.org/img/wn/" + wdata.d1.weather[0].icon + "@2x.png";
      img_url3 = "http://openweathermap.org/img/wn/" + wdata.d3.weather[0].icon + "@2x.png";
      img_url2 = "http://openweathermap.org/img/wn/" + wdata.d2.weather[0].icon + "@2x.png";
      res.render('profile', {
        weather: wdata.d1.weather[0].description,
        city: wdata.d1.name,
        type: wdata.d1.main.temp,
        pic: img_url,
        feel: wdata.d1.main.feels_like,
        tmin: wdata.d1.main.temp_min,
        tmax: wdata.d1.main.temp_max,
        weather2: wdata.d2.weather[0].description,
        city2: wdata.d2.name,
        type2: wdata.d2.main.temp,
        pic2: img_url2,
        feel2: wdata.d2.main.feels_like,
        tmin2: wdata.d2.main.temp_min,
        tmax2: wdata.d2.main.temp_max,
        weather3: wdata.d3.weather[0].description,
        city3: wdata.d3.name,
        type3: wdata.d3.main.temp,
        pic3: img_url3,
        feel3: wdata.d3.main.feels_like,
        tmin3: wdata.d3.main.temp_min,
        tmax3: wdata.d3.main.temp_max,
      });
    });
  }
  else{}
});


app.listen(process.env.PORT || 3000, function() {
  console.log('server listening on port 3000');
})
