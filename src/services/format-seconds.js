function getSecondsComponents(secs) {
  var days, hours, mins, seconds;
  secs = secs > 0 ? secs : 0;
  secs = Math.round(secs);
  mins = Math.floor(secs / 60);
  seconds = secs - mins * 60;
  hours = Math.floor(mins / 60);
  mins = mins - hours * 60;
  days = Math.floor(hours / 24);
  hours = hours - days * 24;
  return {
    days: days || 0,
    hours: hours || 0,
    mins: mins || 0,
    seconds: seconds || 0
  };
}

function longFormat (seconds) {

  var sec = getSecondsComponents(seconds);
  var text = sec.seconds + ' sec';
  if (sec.mins > 0) text = sec.mins + ' min' + ' and ' + text;
  if (sec.hours > 0) text = sec.hours + ' hr' + (sec.mins > 0 ? ', ' : ' and ') + text;
  if (sec.days > 0) text = sec.days + ' day' + (sec.days > 1 ? 's' : '') + (sec.hours > 0 || sec.mins > 0 ? ', ' : ' and ') + text;
  return text;

}


function shortFormat (seconds) {

  var sec = getSecondsComponents(seconds);
  var text = sec.seconds + 's';

  if(sec.hours > 0 || sec.days > 0 || sec.mins > 0)
    text = sec.mins + 'm:' + text;
  if(sec.days > 0 || sec.hours > 0)
    text = sec.hours + 'h:' + text;
  if(sec.days > 0)
    text = sec.days + 'd:' + text;
  return text;

}


function formatSeconds(seconds, long_or_short) {
  long_or_short = long_or_short || 'long';
  return long_or_short === 'long' ? longFormat(seconds) : shortFormat(seconds);
}

export default formatSeconds


