module.exports.manage_first_page = manage_first_page;
const https = require('https');

  function manage_first_page(city, kind) {
    var kind2;
    var temp_type;
    var img_url;
    const fs = require('fs');
    if (kind == "option2") {
      kind2 = "metric";
      temp_type = "Celsius";
    } else if (kind == "option1") {
      kind2 = "imperial";
      temp_type = "Fahrenheit";
    } else {
      kind2 = "";
      temp_type = "Kelvin";
    }
    var key = fs.readFileSync(__dirname + "/key.txt").toString();
    key = key.substring(0, key.length - 1);
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=" + kind2;
    https.get(url, function(response) {
      response.on('data', function(data) {
        wdata = JSON.parse(data);
        return wdata;
      })
    });
  }
module.exports.manage_second_page = manage_second_page;
  function manage_second_page(city, kind) {
    var kind2;
    var temp_type;
    var img_url;
    const fs = require('fs');
    if (kind == "option2") {
      kind2 = "metric";
      temp_type = "Celsius";
    } else if (kind == "option1") {
      kind2 = "imperial";
      temp_type = "Fahrenheit";
    } else {
      kind2 = "";
      temp_type = "Kelvin";
    }
    var key = fs.readFileSync(__dirname + "/key.txt").toString();
    key = key.substring(0, key.length - 1);
    var url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + key + "&units=" + kind2;
    https.get(url, function(response) {
      response.on('data', function(data) {
        wdata = JSON.parse(data);
        return wdata;
      })
    });
  }
