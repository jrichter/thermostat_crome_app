var outsideTemp;
var insideTemp;
var currentState;


function get_temps() {
  return $.ajax({
    url: 'http://5.jetfive.com',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      outsideTemp = data.outsideTemp;
      insideTemp = data.insideTemp;
      currentState = data.state;
  }});
};

function set_html() {
  $('#showtemps').html("Outside: <em>" + outsideTemp + "</em><br/>Inside: <em>" + insideTemp + '</em>');
};

function refresh() {
  $('#showtemps').html("Updating...");
  get_temps();
  setTimeout(function() { set_html() }, 800);
};

function init() {
  $('#showtemps').html("Loading...");
  refresh();
  setInterval(function() {
    refresh();
  },300000);
  
  $('#close-button').click(function() {
    window.close();
  });

  $('#refresh-button').click(function() {
    refresh();
  });

  $('#chart-link').click(function() {
    chrome.app.window.create('charts.html', {
      'id': 'charts-window',
      'bounds': {
        'width': 600,
        'height': 900,
        'left': 2,
        'top': screen.availHeight -445
      },
      'frame': 'none'
    });
  });
  
};


$(document).ready(init);
