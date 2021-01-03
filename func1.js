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
module.exports.manage_profile = manage_profile;
function manage_profile(city, city2, city3, func) {
  const fs = require('fs');
  var key = fs.readFileSync(__dirname + "/key.txt").toString();
  key = key.substring(0, key.length - 1);
  var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key + "&units=" + "metric";
  https.get(url, function(response) {
    response.on('data', function(data) {
      wdata = JSON.parse(data);
      var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city2 + "&appid=" + key + "&units=" + "metric";
      https.get(url, function(response) {
        response.on('data', function(data) {
          wdata2 = JSON.parse(data);
          var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city3 + "&appid=" + key + "&units=" + "metric";
          https.get(url, function(response) {
            response.on('data', function(data) {
              wdata3 = JSON.parse(data);
              data = {"d1":wdata, "d2":wdata2, "d3":wdata3};
              func(data);
            })
          });
        })
      });
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


module.exports.data_edit = data_edit;

function data_edit(data){
  for (let i = 0; i < data.list.length; i++) {
    data.list[i].weather.icon = 'http://openweathermap.org/img/wn/'+ data.list[i].weather[0].icon +'@2x.png';
  }
  return data;
}

module.exports.num = num;

function num(data, day){
  var arr =[];
  var ind = 2;
  for (let i = day; day >0 ; day--) {
    arr.push(data.list[ind]);
    ind = ind + 9;
  }
  return arr;
}
