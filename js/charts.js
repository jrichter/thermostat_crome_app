var forecast;

function get_forecast() {
  return $.ajax({
    url: 'http://5.jetfive.com',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      forecast = data.forecastIO;
  }});
};

function init() {
  
  $('#charts-close-button').click(function() {
    window.close($('#charts-window'));
  });
  
}

$(document).ready(init);
