on('chat:message', function (msg) {
    macroCall(msg, "!명령어1", "#test1");
    macroCall(msg, "!명령어2", "#test2");
    //사용하고 싶은 만큼 복제해서 사용
});

function macroCall(msg, key, macro) {
    if (msg.type == "api" && msg.content.indexOf(key) === 0) {
        sendChat('', macro);
    }
}
