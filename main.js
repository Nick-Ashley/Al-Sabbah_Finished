// JavaScript Document
var points = setPointCoordinates();
var gamePiece = null;
var playerSelect = true;
var playerTurn = 'qujar';
var nizariMove = 0;
var qujarMove = 0;
var numberOfDeadNizari = 0; //3
var numberOfDeadQujar = 0; //9
var timer = 0;
var timerInterval = null;

var possiblePositionData = {
    "pos1":[3,4,6,8,10],
    "pos2":[3,5,7,9,12],
    "pos3":[4,5,1,2],
    "pos4":[1,3,6,11],
    "pos5":[2,3,7,11],
    "pos6":[1,4,8,16],
    "pos7":[2,5,9,17],
    "pos8":[1,6,10,15],
    "pos9":[2,7,12,18],
    "pos10":[1,8,13,14],
    "pos11":[4,5,16,17],
    "pos12":[2,9,19,20],
    "pos13":[10,14,21,23,27],
    "pos14":[10,13,15,21],
    "pos15":[8,14,16,24],
    "pos16":[6,11,15,17,24,29],
    "pos17":[7,11,16,18,25,29],
    "pos18":[9,17,19,25],
    "pos19":[12,18,20,22],
    "pos20":[12,19,22,26,31],
    "pos21":[13,14,23,24],
    "pos22":[19,20,25,26],
    "pos23":[13,21,27,28],
    "pos24":[15,16,21,28,29,33],
    "pos25":[17,18,22,29,30,34],
    "pos26":[22,20,30,31],
    "pos27":[13,23,32,38],
    "pos28":[23,24,32,33],
    "pos29":[16,17,24,25,28,30,33,34,41,42],
    "pos30":[25,26,34,35],
    "pos31":[20,26,35,45],
    "pos32":[27,28,36,38],
    "pos33":[24,28,29,36,40,41],
    "pos34":[25,29,30,42,43,37],
    "pos35":[30,31,37,45],
    "pos36":[32,33,38,39],
    "pos37":[34,35,44,45],
    "pos38":[27,32,36,39,46],
    "pos39":[36,38,40,46],
    "pos40":[33,39,41,49],
    "pos41":[29,33,40,42,47,51],
    "pos42":[29,34,41,43,47,52],
    "pos43":[34,42,44,50],
    "pos44":[37,43,45,48],
    "pos45":[31,35,37,44],
    "pos46":[38,39,49,56],
    "pos47":[41,42,53,54],
    "pos48":[44,45,50,57],
    "pos49":[40,46,51,56],
    "pos50":[43,52,48,57],
    "pos51":[41,49,53,56],
    "pos52":[42,54,50,57],
    "pos53":[47,51,55,56],
    "pos54":[47,52,55,57],
    "pos55":[53,54,56,57],
    "pos56":[46,49,51,53,55],
    "pos57":[55,54,52,50,48]
};

createPlayers();
initializePlayerLocations();

document.getElementById('playButton').addEventListener('click', setTimer);

function setTimer() {
    document.getElementById('timerModal').style.display = 'none';

    setPlayerTurns();
}

function setPlayerTurns() {
    nizariMove = 0;
    qujarMove = 0;
    playerSelect = true;
    gamePiece = null;
    removeHighlightPoints();

    removeGameSpaceEventListeners();

    setTimeout(function(){
        if ((playerTurn == 'nizari' && ! playerSelect) || (playerTurn == 'qujar' && playerSelect)) {
            addNizariPlayerPieceEventListeners();
            document.getElementById('nizariTitle').style.color = 'red';
            document.getElementById('qujarTitle').style.color = 'black';
        } else if ((playerTurn == 'qujar' && ! playerSelect) || (playerTurn == 'nizari' && playerSelect)) {
            addQujarPlayerPieceEventListeners();
            document.getElementById('qujarTitle').style.color = 'red';
            document.getElementById('nizariTitle').style.color = 'black';
        }
    }, 100);

    countDown();
}

function countDown() {
    clearInterval(timerInterval);
    timer = document.getElementById('timerAmount').value;
    document.getElementById('timer').innerHTML = `Timer: ${timer}`;

    timerInterval = setInterval(function() {
        timer--;
        document.getElementById('timer').innerHTML = `Timer: ${timer}`;

        if (timer == 0) {
            clearInterval(timerInterval);
            //timer over

            if (gamePiece) {
                gamePiece.target.classList.remove('playerActive');
            }

            if (playerTurn == 'nizari') {
                playerTurn = 'qujar';
            } else if (playerTurn == 'qujar') {
                playerTurn = 'nizari';
            }

            setPlayerTurns();
        }
    }, 1000);
}


function setPointCoordinates() {
    var pointCount = 1;
    var points = [];

    while (pointCount <= 57) {
        var element = document.getElementById(`pos${pointCount}`).getBoundingClientRect();

        points[pointCount] = {x: element.x, y: element.y};
        pointCount++;
    }

    return points;
};



function createPlayers() {
    var qujarPieceCount = 0; // 9
    var nizariPieceCount = 0; // 3

    while (qujarPieceCount < 9)
    {
        document.getElementById('qujarsContainer').innerHTML += `<img id="qujarPlayer${qujarPieceCount}" class="qujarPlayer" src="./images/qujar_game_piece.png" alt="Qujars">`;
        document.getElementById('qujarGraveyard').innerHTML += `<img id="qujarGraveyardPlayer${qujarPieceCount}" class="qujarGraveyardPlayer" src="./images/qujar_game_piece.png" alt="Qujars">`;
        qujarPieceCount++;
    }

    while (nizariPieceCount < 3)
    {
        document.getElementById('nizariContainer').innerHTML += `<img id="nizariPlayer${nizariPieceCount}" class="nizariPlayer" src="./images/nizari_game_piece.png" alt="Nizari">`;
        document.getElementById('nizariGraveyard').innerHTML += `<img id="nizariGraveyardPlayer${nizariPieceCount}" class="nizariGraveyardPlayer" src="./images/nizari_game_piece.png" alt="Nizari">`;
        nizariPieceCount++;
    }
};


function initializePlayerLocations() {
    var nirzariWidthOffset = 50;
    var nirzariHeightOffset = 70;
    var qujarWidthOffset = 50;
    var qujarHeightOffset = 70;

    // narzari players
    // width: 75px, height: 96px ---> ~38px, ~48px --->
    document.getElementById('nizariPlayer0').style.left = `${points[1].x - nirzariWidthOffset}px`;
    document.getElementById('nizariPlayer0').style.top = `${points[1].y - nirzariHeightOffset}px`;
    document.getElementById('nizariPlayer0').dataset.position = 'pos1';
    document.getElementById('nizariPlayer1').style.left = `${points[2].x - nirzariWidthOffset}px`;
    document.getElementById('nizariPlayer1').style.top = `${points[2].y - nirzariHeightOffset}px`;
    document.getElementById('nizariPlayer1').dataset.position = 'pos2';
    document.getElementById('nizariPlayer2').style.left = `${points[3].x - nirzariWidthOffset}px`;
    document.getElementById('nizariPlayer2').style.top = `${points[3].y - nirzariHeightOffset}px`;
    document.getElementById('nizariPlayer2').dataset.position = 'pos3';

    // qujar players
    document.getElementById('qujarPlayer0').style.left = `${points[38].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer0').style.top = `${points[38].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer0').dataset.position = 'pos38';
    document.getElementById('qujarPlayer1').style.left = `${points[46].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer1').style.top = `${points[46].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer1').dataset.position = 'pos46';
    document.getElementById('qujarPlayer2').style.left = `${points[45].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer2').style.top = `${points[45].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer2').dataset.position = 'pos45';
    document.getElementById('qujarPlayer3').style.left = `${points[48].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer3').style.top = `${points[48].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer3').dataset.position = 'pos48';
    document.getElementById('qujarPlayer4').style.left = `${points[51].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer4').style.top = `${points[51].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer4').dataset.position = 'pos51';
    document.getElementById('qujarPlayer5').style.left = `${points[56].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer5').style.top = `${points[56].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer5').dataset.position = 'pos56';
    document.getElementById('qujarPlayer6').style.left = `${points[52].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer6').style.top = `${points[52].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer6').dataset.position = 'pos52';
    document.getElementById('qujarPlayer7').style.left = `${points[57].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer7').style.top = `${points[57].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer7').dataset.position = 'pos57';
    document.getElementById('qujarPlayer8').style.left = `${points[55].x - qujarWidthOffset}px`;
    document.getElementById('qujarPlayer8').style.top = `${points[55].y - qujarHeightOffset}px`;
    document.getElementById('qujarPlayer8').dataset.position = 'pos55';
};

function qujarPlayerClicked(event) {
    if (playerSelect) {
        gamePiece = {type: 'qujar', target: event.target};
        playerSelect = false;
        playerTurn = 'nizari';
        var currentLocation = event.target.dataset.position;

        highlightPoints(currentLocation);

        gamePiece.target.classList.add('playerActive');

        removeQujarPlayerPieceEventListeners();

        setTimeout(function(){
            addGameSpaceEventListeners();
        }, 100);
    } else {
        console.log('click some where to move');
    }
}

function nizariPlayerClicked(event) {
    if (playerSelect) {
        gamePiece = {type: 'nizari', target: event.target};
        playerSelect = false;
        playerTurn = 'qujar';
        var currentLocation = event.target.dataset.position;

        highlightPoints(currentLocation);

        gamePiece.target.classList.add('playerActive');

        removeNizariPlayerPieceEventListeners();

        setTimeout(function(){
            addGameSpaceEventListeners();
        }, 100);
    } else {
        console.log('click some where to move');
    }
}

function highlightPoints(currentLocation) {
    possiblePositionData[currentLocation].forEach(function(pointNumber) {
        document.getElementById(`pos${pointNumber}`).style.visibility = 'visible';
    });

    if (playerTurn == 'qujar') {
        document.querySelectorAll('.nizariPlayer').forEach(function(nizari) {
            document.getElementById(`${nizari.dataset.position}`).style.visibility = 'hidden';
        });
    } else if (playerTurn == 'nizari') {
        document.querySelectorAll('.qujarPlayer').forEach(function(qujar) {
            document.getElementById(`${qujar.dataset.position}`).style.visibility = 'hidden';
        });
    }
}

function removeHighlightPoints() {
    document.querySelectorAll('.positionPoint').forEach(function(point) {
        point.style.visibility = 'hidden';
    });
}


function gameBoardClicked(event) {
    var nirzariWidthOffset = 50;
    var nirzariHeightOffset = 70;
    var qujarWidthOffset = 50;
    var qujarHeightOffset = 70;

    if (! playerSelect) {
        if (gamePiece.type == 'nizari') {
            gamePiece.target.style.left = `${event.clientX - nirzariWidthOffset}px`;
            gamePiece.target.style.top = `${event.clientY - nirzariHeightOffset}px`;

            gamePiece.target.dataset.position = event.target.id;

            nizariMove++;
            if (nizariMove == 1) {
                removeHighlightPoints();
                highlightPoints(gamePiece.target.dataset.position);
            }

            document.querySelectorAll('.qujarPlayer').forEach(function(qujar) {
                if (gamePiece.target.dataset.position == qujar.dataset.position) {
                    qujar.style.display = 'none';
                    document.getElementById('qujarGraveyard').children[numberOfDeadQujar].style.visibility = 'visible';

                    if (numberOfDeadQujar == 8) {
                        document.getElementById('gameOverModal').style.display = 'block';
                        clearInterval(timerInterval);
                        return;
                    }

                    numberOfDeadQujar++;
                }
            });

        } else {
            gamePiece.target.style.left = `${event.clientX - qujarWidthOffset}px`;
            gamePiece.target.style.top = `${event.clientY - qujarHeightOffset}px`;
            qujarMove++;

            gamePiece.target.dataset.position = event.target.id;

            document.querySelectorAll('.nizariPlayer').forEach(function(nizari) {
                if (gamePiece.target.dataset.position == nizari.dataset.position) {

                    nizari.style.display = 'none';
                    document.getElementById('nizariGraveyard').children[numberOfDeadNizari].style.visibility = 'visible';

                    if (numberOfDeadNizari == 2) {
                        document.getElementById('gameOverModal').style.display = 'block';
                        clearInterval(timerInterval);
                        return;
                    }

                    numberOfDeadNizari++;
                }
            });
        }

        if ((gamePiece.type == 'nizari' && nizariMove == 2) || (gamePiece.type == 'qujar' && qujarMove == 1)) {
            gamePiece.target.classList.remove('playerActive');

            nizariMove = 0;
            qujarMove = 0;
            playerSelect = true;
            gamePiece = null;

            removeHighlightPoints();

            countDown();
            removeGameSpaceEventListeners();

            setTimeout(function(){
                if (playerTurn == 'nizari') {
                    addNizariPlayerPieceEventListeners();
                    document.getElementById('nizariTitle').style.color = 'red';
                    document.getElementById('qujarTitle').style.color = 'black';
                } else if (playerTurn == 'qujar') {
                    addQujarPlayerPieceEventListeners();
                    document.getElementById('qujarTitle').style.color = 'red';
                    document.getElementById('nizariTitle').style.color = 'black';
                }
            }, 100);
        }

    } else {
        console.log('select a game piece first!');
    }
}

function addGameSpaceEventListeners() {
    // click on game space
    document.querySelectorAll('.positionPoint').forEach(function(point) {
        point.addEventListener('click', gameBoardClicked);
    });
}

function removeGameSpaceEventListeners() {
    // click on game space
    document.querySelectorAll('.positionPoint').forEach(function(point) {
        point.removeEventListener('click', gameBoardClicked);
    });
}

function addNizariPlayerPieceEventListeners() {
    // click on nizari game pieces
    document.querySelectorAll('.nizariPlayer').forEach(function(nizari) {
        nizari.style.pointerEvents = 'auto';
        nizari.addEventListener('click', nizariPlayerClicked);
    });
}

function addQujarPlayerPieceEventListeners() {
    // click on qujar game pieces
    document.querySelectorAll('.qujarPlayer').forEach(function(qujar) {
        qujar.style.pointerEvents = 'auto';
        qujar.addEventListener('click', qujarPlayerClicked);
    });
}

function removeNizariPlayerPieceEventListeners() {
    // click on qujar game pieces
    document.querySelectorAll('.nizariPlayer').forEach(function(nizari) {
        nizari.style.pointerEvents = 'none';
        nizari.removeEventListener('click', nizariPlayerClicked);
    });
}

function removeQujarPlayerPieceEventListeners() {
    // click on game pieces
    document.querySelectorAll('.qujarPlayer').forEach(function(qujar) {
        qujar.style.pointerEvents = 'none';
        qujar.removeEventListener('click', qujarPlayerClicked);
    });
}