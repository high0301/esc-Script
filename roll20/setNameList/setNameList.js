let player = [];
let macroText;
on('chat:message', function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!list") === 0) {
        player = findObjs({ type: 'character'});
        macroText = "?{캐릭터 리스트"
        for (var i=0; i<player.length; i++) {
            macroText += "|"+player[i].get('name');
        }
        macroText += "}";
        log(macroText);
        createObj('macro', {
            name: "nameList",
            action : macroText,
            playerid : msg.playerid,
        });
    }
 });