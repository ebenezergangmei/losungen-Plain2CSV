document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();

  var subject = document.getElementById('subject').value;
  var fileInput = document.getElementById('file');
  var notificationTime = document.getElementById('notification').value;
  var startDate = new Date(document.getElementById('startDate').value);
  var startTime = document.getElementById('startTime').value;
  var alarmTime = document.getElementById('alarm').value;

  if (fileInput.files.length === 0) {
    alert('Please select a file.');
    return;
  }

  var file = fileInput.files[0];
  var reader = new FileReader();

  reader.onload = function(e) {
    var contents = e.target.result;
    var lines = contents.split('#');
    var data = [];

    var currentDate = new Date(startDate);

    lines.forEach(function(line) {
      line = line.trim();
      if (line.length > 0) {
        var startDateFormatted = formatDate(currentDate);
        var startTimeFormatted = formatTime(startTime);
        var endDateFormatted = formatDate(currentDate);
        var endTimeFormatted = formatTime(startTime);
        var reminderDate = formatDate(currentDate);
        var reminderTime = notificationTime;
        var alarmTimeFormatted = formatTime(alarmTime);

        // Create an array for each row
        var row = [
          subject,
          startDateFormatted,
          startTimeFormatted,
          endDateFormatted,
          endTimeFormatted,
          'FALSE',
          reminderDate,
          reminderTime,
          line, // Keep the Nepali script unchanged
          '',   // Location
          ''    // Private
        ];

        data.push(row);

        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Create CSV content
    var csvContent = Papa.unparse({
      fields: ["Subject", "Start Date", "Start Time", "End Date", "End Time", "All Day Event", "Reminder Date", "Reminder Time", "Description", "Location", "Private"],
      data: data
    });

    // Convert CSV content to Blob
    var csvBlob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8' });

    // Create download link for calendar.csv
    var csvURL = URL.createObjectURL(csvBlob);
    var downloadLink = document.createElement('a');
    downloadLink.href = csvURL;
    downloadLink.download = 'calendar.csv';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Create download link for TEST.txt
    var testBlob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), contents], { type: 'text/plain;charset=utf-8' });
    var testURL = URL.createObjectURL(testBlob);
    var testLink = document.createElement('a');
    testLink.href = testURL;
    testLink.download = 'TEST.txt';
    document.body.appendChild(testLink);
    testLink.click();
    document.body.removeChild(testLink);
  };

  reader.readAsText(file, 'UTF-8');
});

function formatDate(date) {
  var year = date.getFullYear();
  var month = padZero(date.getMonth() + 1);
  var day = padZero(date.getDate());
  return `${year}-${month}-${day}`;
}

function formatTime(time) {
  var hours = padZero(time.split(':')[0]);
  var minutes = padZero(time.split(':')[1]);
  return `${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}
