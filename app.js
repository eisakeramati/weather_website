const express = require('express');
const bodyp = require('body-parser');
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
  var day = req.body.day;
  var temp_type;
  wdata = func1.manage_second_page(city, kind);
  setTimeout(function() {
    console.log(wdata.list[0].main);
    console.log(wdata.list[0].weather);
  }, 500);
});

app.listen(3000, function() {
  console.log('server listening on port 3000');
})
