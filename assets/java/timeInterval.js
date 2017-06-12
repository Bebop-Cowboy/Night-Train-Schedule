
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB4sjKdEuJRYA_RwLvNR_IW91MhIUL22lM",
    authDomain: "dattrain-592c4.firebaseapp.com",
    databaseURL: "https://dattrain-592c4.firebaseio.com",
    projectId: "dattrain-592c4",
    storageBucket: "dattrain-592c4.appspot.com",
    messagingSenderId: "419663848081"
  };
  firebase.initializeApp(config);


var database = firebase.database();

$(document).ready(function() {
  // DOM elements
  var $trainName = $('#trainName');
  var $destination = $('#destination');
  var $startTime = $('#startTime');
  var $frequencyRate = $('#frequencyRate');
  var $addTrainBtn = $('#addTrainBtn');
  var $trainTableBody = $('#trainDataTableBody');
  var $hideForm = $('#hideForm');

  $hideForm.on('click', function() {
    $('#addTrainForm').slideToggle();
    if ($hideForm.text().startsWith('Hide')) {
      $hideForm.text('Show Form');
    } else {
      $hideForm.text('Hide Form');
    }
  });

  function makeTrainRow(name, destination, startTime, frequencyRate, months, totalComp) {
    var $tableRow = $('<tr></tr>');
    var $nameData = $('<td></td>').text(name);
    var $destinationData = $('<td></td>').text(destination);
    var $startTimeData = $('<td></td>').text(startTime);
    var $frequencyRateData = $('<td></td>').text(frequencyRate);
    var $months = $('<td></td>').text(months);
    var $totalComp = $('<td></td>').text(`$${totalComp}`);

    return $tableRow.append([$nameData, $destinationData, $startTimeData, $frequencyRateData, $months, $totalComp]);
  }

  // Attach listeners
  $addTrainBtn.on('click', function(e) {
    e.preventDefault();

    // get values from form fields
    var trainName = $trainName.val().trim();
    var destination = $destination.val().trim();
    var startTime = $startTime.val().trim();
    console.log($startTime.val());
    var frequencyRate = $frequencyRate.val().trim();

    // add values to database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      startTime: startTime,
      frequencyRate: frequencyRate
    });
  });

  database.ref().on(
    'child_added',
    function(snap, prevChildKey) {
      // retrieve values from snapshot
      var name = snap.val().trainName;
      var destination = snap.val().destination;
      var startTime = snap.val().startTime;
      var frequencyRate = snap.val().frequencyRate;

      var monthDiff = moment().diff(moment(startTime, 'YYYY-MM-DD'), 'months');

      var totalComp = monthDiff * frequencyRate;

      // add new train row
      $trainTableBody.prepend(makeTrainRow(name, destination, startTime, frequencyRate, monthDiff, totalComp));
    },
    function(errorObject) {
      console.log('Error with database read:', errorObject);
    }
  );
});
