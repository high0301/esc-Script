const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
let today;
let utc;
let kr_today;

//글로벌 변수
let logDate = [];
let logTime = [];
let logHour;
let logMin;
let logYear;
let logMonth;
let logDay;
let logFullTime;

on('chat:message', function (msg) {
    today = new Date();
    utc = today.getTime() + (today.getTimezoneOffset() * 60 * 1000);
    kr_today = new Date(utc + (KR_TIME_DIFF));
    log(kr_today);
    if (msg.type == "api" && msg.content.indexOf("!time") === 0) {
        logHour = kr_today.getHours();
        logMin = kr_today.getMinutes();
        logTime = logHour + ":" + logMin;
        sendChat("", "/desc " + logTime);
    }
    if (msg.type == "api" && msg.content.indexOf("!date") === 0) {
        logYear = kr_today.getFullYear();
        logMonth = kr_today.getMonth()+1;
        logDay = kr_today.getDate();
        logDate = logYear + "/" + logMonth + "/" + logDay;
        sendChat("", "/desc " + logDate);
    }
    if (msg.type == "api" && msg.content.indexOf("!fulltime") === 0) {
        logHour = kr_today.getHours();
        logMin = kr_today.getMinutes();
        logTime = logHour + ":" + logMin;
        logYear = kr_today.getFullYear();
        logMonth = kr_today.getMonth() + 1;
        logDay = kr_today.getDate();
        logDate = logYear + "/" + logMonth + "/" + logDay;
        logFullTime = logDate +" " + logTime;
        sendChat("", "/desc " + logFullTime);

    }
});