const express = require('express');
const bodyp = require('body-parser');
const geoip = require('geoip-lite');
const app = express();
const https = require('https');
const func1 = require(__dirname + "/func1.js");
app.set('view engine', 'ejs');

app.use(bodyp.urlencoded({
  extended: true
}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.render('main');
});

app.get("/mult_days", function(req, res) {
  res.render('mult_main');
});

app.get("/about", function(req, res){
  var geo = geoip.lookup(req.connection.remoteAddress);
  res.render("about", {
    location:geo
  });
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
        tmax: wdata.main.temp_max
      });
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
        res.render('list_mult', {
          input: inp,
          city: wdata.city.name
        });
      }, 100);
    } else {
      res.render('error');
    }
  }, 300);
});

app.listen(3000, function() {
  console.log('server listening on port 3000');
})
