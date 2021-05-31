window.addEventListener('load',function() {
  var deadline = '2021/06/08 12:00 PST';

  function pad(num, dimZero = false) {
  	if(num >= 10) return num;
    else if(num === 0 && dimZero) "<span class='dim-gray-text'>00</span>"
    else return (dimZero ? "<span class='dim-gray-text'>0</span>" : "0") + num;
  }

  // fixes "Date.parse(date)" on safari
  function parseDate(date) {
    const parsed = Date.parse(date);
    if (!isNaN(parsed)) return parsed
    return Date.parse(date.replace(/-/g, '/').replace(/[a-z]+/gi, ' '));
  }

  function getTimeRemaining(endtime) {
    let total = parseDate(endtime) - Date.parse(new Date())
    let seconds = Math.floor((total / 1000) % 60)
    let minutes = Math.floor((total / 1000 / 60) % 60)
    let hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    let days = Math.floor(total / (1000 * 60 * 60 * 24))

    return { total, days, hours, minutes, seconds };
  }

  function clock(id, endtime) {
    let days = document.getElementById(id + '-days')
    let hours = document.getElementById(id + '-hours')
    let minutes = document.getElementById(id + '-minutes')
    let seconds = document.getElementById(id + '-seconds')

    $(days).css('width',$(days).width())
    $(hours).css('width',$(hours).width())
    $(minutes).css('width',$(minutes).width())
    $(seconds).css('width',$(seconds).width())

    var timeinterval = setInterval(function () {
      var time = getTimeRemaining(endtime);

      if (time.total <= 0) {
        clearInterval(timeinterval);
      } else {
        days.innerHTML = pad(time.days, (time.days < 10 || time.day === 0));
        hours.innerHTML = pad(time.hours, (time.days < 1));
        minutes.innerHTML = pad(time.minutes, (time.days < 1 && time.hours < 1));
        seconds.innerHTML = pad(time.seconds, (time.days < 1 && time.hours < 1 && time.minutes < 1));
      }
    }, 1000);
  }

  clock('js-clock', deadline);
});
