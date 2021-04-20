let playerName;
let playerID;
let chatMsg;
let muteOn = false;
on('chat:message', function(msg) {
   if (msg.type == "api" && msg.content.indexOf("!m") === 0) {
       (muteOn == true)? muteOn = false : muteOn = true;
       if ( muteOn == true ) {
        playerName = msg.content.replace('!m ',"");
        log("입력된 이름: "+playerName)
        playerID = findObjs({ type: 'player', _displayname: playerName });
        playerID = playerID[0].get('_id');
       }
   }
   if ( msg.playerid == playerID && muteOn == true ) {
       chatMsg = msg.content.replace('!m ',"");
       if ( chatMsg != playerName ) {
           sendChat("음소거", "/direct "
           +"<div style='position:absolute; bottom: 67px; left: 0; padding: 8px 10px; min-width: 100%;padding-left: 30px; background: #fff; font-size: 14px; font-weight: bold;' class='mute'>음소거 되었습니다. <span style='color: #fff;'>"
           + chatMsg 
           +"<span></div>" 
           + "음소거 된 내용입니다. 내용을 읽기 위해서는 위의 흰 영역을 드래그 해주세요.");
       }
   }
});
