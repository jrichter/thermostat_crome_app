var forecast;
var hourly_series;
var hourly_real;
var index_sunrise;
var index_sunset;
function get_forecast() {
  return $.ajax({
    url: 'http://5.jetfive.com',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      forecast = data.forecastIO;
  }});
};

function decide_on_current_day(time,sun,index) { //pass in time to check against
  var index = index || 0;
  if (sun == "sunrise") {
    time2 = forecast.daily.data[index].sunriseTime;
  }
  else {
    time2 = forecast.daily.data[index].sunsetTime;
  }

  if (index > 8) {
    console.log("failed");
    index = 0;
  }
  else if (time < time2) {
    console.log(index);
    console.log("returning the index for " + sun);
  }
  else {
    console.log("recursion");
    index += 1;
    decide_on_current_day(time,sun,index);
  }
  return index;
 };

function show_summary() {
  $('#summary').html(forecast.daily.summary);
};

function show_five_day() {
  html = []
  $.each(forecast.daily.data,function(index,value){
    html.push('<tr><th>' +  + '</th></tr>')
    html.push('<tr><td>Max: ' + value.apparentTemperatureMax + '</td><td>Min: ' + value.apparentTemperatureMin + '</td></tr>')
  });
  $('#five-day').html(html.join(" "));
};

function make_series_apparent(data) {
  array = []
  $.each(data,function (index,value) {
    array.push([new Date(value.time * 1000), value.apparentTemperature])
  });
  return array
};

function make_series(data) {
  array = []
  $.each(data,function (index,value) {
    array.push([new Date(value.time * 1000), value.temperature])
  });
  return array
};

function make_chart() {
  hourly_series = make_series_apparent(forecast.hourly.data);
  hourly_real = make_series(forecast.hourly.data)
  index_sunrise = decide_on_current_day(forecast.hourly.data[0].time,"sunrise",0)
  index_sunset = decide_on_current_day(forecast.hourly.data[0].time,"sunset",0)
  var offset = (new Date(forecast.hourly.data[0].time * 1000).getTimezoneOffset() * 60 * 1000);
  $('#container').highcharts({
    chart: {
      type: 'spline'
    },
    title: {
      text: 'Weather Forecast'
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: {
        day: '%e of %b',
      }
    },
    yAxis: {
      title: {
        text: 'Temperature'
      }
    },
    plotOptions: {
      series: {
        marker: {
          fillColor: 'none',
          lineColor: null
        }
      }
    },
    series: [{
      name: "Apparent Temp",
      data: hourly_series,
      pointStart: forecast.hourly.data[0].time * 1000 - offset,
      pointInterval: (forecast.hourly.data[1].time - forecast.hourly.data[0].time) * 1000
    },
    {
      name: "Real Temp",
      data: hourly_real,
      pointStart: forecast.hourly.data[0].time * 1000 - offset,
      pointInterval: (forecast.hourly.data[1].time - forecast.hourly.data[0].time) * 1000
    },

    {
      type: 'column',
      name: 'Sunrise',
      pointStart: forecast.daily.data[index_sunrise].sunriseTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunset',
      pointStart: forecast.daily.data[index_sunset].sunsetTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunrise',
      pointStart: forecast.daily.data[(index_sunrise + 1)].sunriseTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunset',
      pointStart: forecast.daily.data[(index_sunset + 1)].sunsetTime * 1000 - offset,
      data: [110]
     }
]
  });
};

function init_charts() {
  get_forecast();
  setTimeout(function() {make_chart()}, 800);
  setTimeout(function() {show_summary()}, 800);
  setTimeout(function() {show_five_day()}, 800);
  $('#charts-close-button').click(function() {
    window.close($('#charts-window'));
  });

}

$(document).ready(init_charts);
