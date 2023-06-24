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
        var csvContent = "Subject,Start Date,Start Time,End Date,End Time,All Day Event,Reminder Date,Reminder Time,Description,Location,Private\n";

        var currentDate = new Date(startDate);
        var currentYear = currentDate.getFullYear();

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

            csvContent += `${subject},${startDateFormatted},${startTimeFormatted},${endDateFormatted},${endTimeFormatted},FALSE,${reminderDate},${reminderTime},"${line.replace(/"/g, '""').replace(/[\u{0080}-\u{FFFF}]/gu, '')}",,`;
            csvContent += '\n';

            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        var csvBlob = new Blob([csvContent], { type: 'text/csv' });
        var csvURL = URL.createObjectURL(csvBlob);
        var downloadLink = document.createElement('a');
        downloadLink.href = csvURL;
        downloadLink.download = 'calendar.csv';
        downloadLink.click();
      };

      reader.readAsText(file);
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
