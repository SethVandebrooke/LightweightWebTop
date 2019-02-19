function date_time(id) {
  date = new Date;
  year = date.getFullYear();
  month = date.getMonth();
  months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'Jully', 'August', 'September', 'October', 'November', 'December');
  d = date.getDate();
  day = date.getDay();
  days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
  h = date.getHours();
  var period = "am";
  if (h > 12) {
    h = h - 12;
    period = "pm";
  }
  m = date.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  s = date.getSeconds();
  if (s < 10) {
    s = "0" + s;
  }
  result = '' + days[day] + ' ' + months[month] + ' ' + d + ' ' + year + ' ' + h + ':' + m + ' ' + period;
  document.getElementById(id).innerHTML = result;
  setTimeout(function () {
    date_time(id);
  }, 1000);
  return true;
}

date_time("datetime");