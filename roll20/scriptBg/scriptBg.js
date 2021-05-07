//글로벌 상수
const regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"\s]/gi;
const regEn_B = /[A-Za-z]/g;
const regEn_S = /[lijtf]/g;
//글로벌 변수
let line = 0;
let scriptBg;
let scriptPos;
let namePos;
let boxH;
let scriptApiOn = false;
let pause = true;
let chkSendChat = 0;
let chatStop = false;
let intervalTime = 80;
let settingData;
let fontColor = {
    'scriptColor': "#ffffff",
    'nameColor': '#ffffff',
    'descColor': '#ffffff'
} //기본 글씨색

on('change:graphic', function(obj, prev){
    settingData = findObjs({ type: 'graphic', name: 'ssTok' }); 
    if ( !settingData[0] ) {
        return;
    } else {
        fontColor['scriptColor'] = settingData[0].get('bar1_value') || '#ffffff';
        fontColor['nameColor'] = settingData[0].get('bar2_value') || '#ffffff';
        fontColor['descColor'] = settingData[0].get('bar3_value') || '#ffffff';
    }

    if (!scriptBg) {
        scriptBg = getBg()[0];
    } else {
        scriptApiOn = scriptBg.get('bar1_value');
        //문자열로 받아오기 때문에 배경 토큰에서 값 입력시 0, 1 로만 입력할 것
        intervalTime = scriptBg.get('bar2_value');
    }
})

on('chat:message', function(msg) {
    if (msg.type == "api" && msg.content.indexOf("!sbOn") === 0) {
        scriptApiOn = true;
    }
    // 기본 초기화
    var scriptText;
    var chatMsg = msg.content;
    var chatName = msg.who;
    let character;
    scriptBg = getBg()[0];
    
    if (scriptApiOn == true) {
        chatStop = (msg.who == "scriptBG")? true : false;
        if (!scriptBg && chatStop == false ) {
            sendChat("scriptBG", "/w gm 스크립트가 출력될 배경을 설정해주세요! 배경의 이름은 반드시 'scriptBg' 여야 합니다.", chatStop = true);
        } else if ( scriptBg ) {
            log("ok");
            scriptPos = {
                'top': scriptBg.get('top'),
                'left': scriptBg.get('left'),
                'width': scriptBg.get('width'),
                'height': scriptBg.get('height'),
            }
            namePos = {
                'left': scriptPos['left'] - (scriptPos['width'] / 2) + 20,
                'top': scriptPos['top'] - (scriptPos['height'] / 2) + 30,
            }
            boxH = scriptPos['height'];

            if (msg.type == "api" && msg.content.indexOf("!ss") === 0) {
                createObj('text', {
                    _pageid: Campaign().get("playerpageid"),
                    text: "이름 출력 영역",
                    layer: "objects",
                    color: "#ffffff",
                    font_size: 16,
                    font_family: "Arial",
                    top: namePos['top'],
                    left: namePos['left'] + 50,
                    controlledby: ""
                });
                createObj('text', {
                    _pageid: Campaign().get("playerpageid"),
                    text: "채팅 텍스트 출력 시작점",
                    layer: "objects",
                    color: "#ffffff",
                    font_size: 14,
                    font_family: "Arial",
                    top: scriptPos['top'],
                    left: scriptPos['left'],
                    controlledby: ""
                });
            }

            let scriptArr;
            let textW;
            let textH;
            let nameW;
            let alignLeft;
            if (msg.type == "general") {
                // 일반채팅 초기화
                scriptArr = chatMsg.split('');
                textW = lengWidthCal(chatMsg);
                textH = 0;
                nameW = lengWidthCal(chatName);
                alignLeft = scriptPos['left'];
                log(chatMsg); //채팅 메세지 확인
                scriptText = getText();

                if ( chkSendChat == 1) {
                    return;
                } else {
                    if (textW >= scriptPos['width']) {
                        // 1줄이상일 경우 처리
                        scriptArr = autoEnter(scriptPos['width'], chatMsg, scriptArr);
                        chatMsg = scriptArr.join('');
                        textH = parseInt(line) * 20;
                        if (scriptText[0] !== 0) {
                            log(scriptText);
                            scriptText[0].set({
                                text: chatName,
                                font_size: 16,
                                color: fontColor['nameColor'],
                                top: namePos['top'],
                                left: alignLeftScript(nameW) + 30,
                                controlledby: ""
                            });
                            scriptText[1].set({
                                text: chatMsg,
                                font_size: 14,
                                color: fontColor['scriptColor'],
                                top: alignTopScript(textH),
                                left: alignLeft,
                                controlledby: ""
                            });
                        }
                    } else {
                        // 1줄일 경우 처리
                        alignLeft = alignLeftScript(textW) + 30;
                        chatMsg = scriptArr.join('');
                        if (scriptText[0] !== 0) {
                            log(scriptText);
                            scriptText[0].set({
                                text: chatName,
                                font_size: 16,
                                color: fontColor['nameColor'],
                                top: namePos['top'],
                                left: alignLeftScript(nameW) + 30,
                                controlledby: ""
                            });
                            scriptText[1].set({
                                text: chatMsg,
                                font_size: 14,
                                color: fontColor['scriptColor'],
                                top: scriptPos['top'],
                                left: alignLeft,
                                controlledby: ""
                            });
                        }
                    }
                }

            }
            //타이핑 효과 모드
            if (msg.type == "api" && msg.content.indexOf("!tp") === 0) {
                // 일반채팅 초기화
                chatMsg = chatMsg.replace('!tp', '');
                sendChat(msg.who, chatMsg, chkSendChat=1);
                scriptArr = chatMsg.split('');
                textW = lengWidthCal(chatMsg);
                textH = 0;
                nameW = lengWidthCal(chatName);
                alignLeft = scriptPos['left'];
                log(chatMsg); //채팅 메세지 확인
                scriptText = getText();
                scriptArr = autoEnter(scriptPos['width'], chatMsg, scriptArr);
                chatMsg = scriptArr.join('');
                textH = parseInt(line) * 20;
                log("타이핑모드")
                pause = false;
                if (scriptText[0] !== 0) {
                    if (pause == false) {
                        log(scriptText);
                        scriptText[0].set({
                            text: chatName,
                            font_size: 16,
                            color: fontColor['nameColor'],
                            top: namePos['top'],
                            left: alignLeftScript(nameW) + 30,
                            controlledby: ""
                        });
                        var i = 0;
                        chatMsg = "";
                        var it = setInterval(function () {
                            if (i++ < scriptArr.length) {
                                chatMsg += scriptArr[i - 1];
                                scriptText[1].set({
                                    text: chatMsg,
                                    font_size: 14,
                                    color: fontColor['scriptColor'],
                                    top: alignTopScript(textH),
                                    left: alignLeft,
                                    controlledby: ""
                                });

                            } else {
                                clearInterval(it);
                                chkSendChat=0;
                            }
                        }, intervalTime);
                    } else {
                        clearInterval(it);
                    }
                }

            }

            if (msg.type == "desc") {
                //desc 처리
                //초기화
                scriptArr = chatMsg.split('');
                textW = lengWidthCal(chatMsg);
                textH = 0;
                nameW = lengWidthCal(chatName);
                alignLeft = scriptPos['left'];
                log(chatMsg); //채팅 메세지 확인
                scriptText = getText();
                if (textW >= scriptPos['width']) {
                    // 1줄이상일 경우 처리
                    scriptArr = autoEnter(scriptPos['width'], chatMsg, scriptArr);
                    chatMsg = scriptArr.join('');
                    textH = parseInt(line) * 20;
                    if (scriptText[0] !== 0) {
                        log(scriptText);
                        scriptText[0].set({
                            text: chatName,
                            font_size: 16,
                            top: namePos['top'],
                            left: alignLeftScript(nameW) + 30,
                            controlledby: ""
                        });
                        scriptText[1].set({
                            text: chatMsg,
                            font_size: 14,
                            color: fontColor['descColor'],
                            top: alignTopScript(textH),
                            left: scriptPos['left'],
                            controlledby: ""
                        });
                    }
                } else {
                    // 1줄일 경우 처리
                    alignLeft = alignLeftScript(textW) + 30;
                    chatMsg = scriptArr.join('');
                    if (scriptText[0] !== 0) {
                        log(scriptText);
                        scriptText[0].set({
                            text: chatName,
                            font_size: 16,
                            top: namePos['top'],
                            left: alignLeftScript(nameW) + 30,
                            controlledby: ""
                        });
                        scriptText[1].set({
                            text: chatMsg,
                            font_size: 14,
                            color: fontColor['descColor'],
                            top: scriptPos['top'],
                            left: scriptPos['left'],
                            controlledby: ""
                        });
                    }
                }
            }
        }        
    } else {
        log("스크립트를 실행시켜 주세요! 명령어는 !sbOn 입니다.");
    } 

    //정렬 처리 함수
    function alignLeftScript(stringW) {
        return scriptPos['left'] - (scriptPos['width'] / 2) + stringW/2;
    }

    function alignTopScript(stringH) {
        return scriptPos['top'] - (scriptPos['height'] / 2) + stringH/2 + 70;
    }

});


// 입력된 스크립트, 스크립트 배경 가져오기
function getText() {
    var mapText = findObjs({ type: 'text', controlledby: '' });
    return mapText;
}

function getBg() {
    var target = findObjs({ type: 'graphic', name: 'scriptBg' }); 
    return target;
}


//문자열 가로길이 계산
function lengWidthCal(string) {
    //문자 폭 추정값 입력
    const text = 16;
    const spe = 5;
    const engB = 10;
    const engS = 4;
    let result = 0;
    let cntnotText = (string.match(regExp)||[]).length;
    let cntEngSText = (string.match(regEn_S)||[]).length;
    let cntEngBText = (string.match(regEn_B)||[]).length - cntEngSText;
    let cntText = string.length - cntnotText - cntEngBText - cntEngSText;

    result = cntnotText*spe + cntText*text + cntEngBText*engB + cntEngSText*engS;

    return result;
}

//줄바꿈 처리
function autoEnter(width, script, scriptArr) {
    let stringW = lengWidthCal(script);
    let wordW = 0;
    let lineCnt = 0;
    if (stringW >= width) {
        for (var i in script) {
            console.log(script[i]);
            if (script[i].match(regExp)) {
                wordW += 5
            } else {
                wordW += 16
            }

            if (wordW >= width) {
                lineCnt = i;
                break;
            }
        }
        line = (script.length) / lineCnt;
        
        for (var j = 1; j < line; j++) {
            scriptArr.splice(lineCnt * j, 0, "\n");
            if ( (j*20) >= (boxH-100) ) {
                //스크립트 배경 칸 넘어갈 경우 자르기
                scriptArr.splice(lineCnt * j, script.length, "..." );
                line = j;
                break;
            }
        }
    }

    return scriptArr;
}