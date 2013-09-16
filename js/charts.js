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

function make_series(data) {
  array = []
  $.each(data,function (index,value) {
    array.push([new Date(value.time * 1000), value.apparentTemperature])
  });
  return array
};

function make_chart() { 
  hourly_series = make_series(forecast.hourly.data);

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
        hour: '%H'
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
      pointStart: forecast.hourly.data[0].time * 1000 - (new Date(forecast.hourly.data[0].time * 1000).getTimezoneOffset() * 60 * 1000),
      pointInterval: 3600 * 1000
    }]
  });
};

function init_charts() {
  get_forecast();
  setTimeout(function() {make_chart()}, 800);
  $('#charts-close-button').click(function() {
    window.close($('#charts-window'));
  });

}

$(document).ready(init_charts);
