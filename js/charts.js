var forecast;
var hourly_series;

function get_forecast() {
  return $.ajax({
    url: 'http://5.jetfive.com',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      forecast = data.forecastIO;
  }});
};

function show_summary() {
  $('#summary').html(forecast.daily.summary);
};

function show_five_day() {
  html = []
  $.each(forecast.daily.data,function(index,value){
    html.push('Max: ' + value.apparentTemperatureMax + 'Min: ' + value.apparentTemperatureMin + '</br>')
  });
  $('#five-day').html(html.toString()); // need to join instead of just output the array as a string - loose commas
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
      pointStart: forecast.daily.data[0].sunriseTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunset',
      pointStart: forecast.daily.data[0].sunsetTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunrise',
      pointStart: forecast.daily.data[1].sunriseTime * 1000 - offset,
      data: [110]
     },
     {
      type: 'column',
      name: 'Sunset',
      pointStart: forecast.daily.data[1].sunsetTime * 1000 - offset,
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
