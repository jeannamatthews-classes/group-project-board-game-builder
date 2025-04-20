var game = null;

var board = null;

var buttons = [];

var inventories = [];
var logical_pieces = []
var logical_board;



var globalViewer = null;
var minPlayers = -1;
var maxPlayers = -1;
var playerAmount = -1;





document.getElementById('jsonInput').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (!file || file.type !== 'application/json') {
        alert('Please select a valid JSON file.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            game = JSON.parse(e.target.result);
            console.log("Game data loaded:", game);
            document.getElementById("start-buttons").remove(); 
            getNumPlayers();

            

        } catch (err) {
            alert("Invalid JSON file.");
            console.error("Parse error:", err);
        }
    };
    reader.readAsText(file);
    
});




function getNumPlayers(){
    minPlayers = game.minPlayers;
    maxPlayers = game.maxPlayers;
    
        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'player-count-form';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = 9999;
    
        // Create modal box
        const box = document.createElement('div');
        box.style.background = '#fff';
        box.style.padding = '20px 30px';
        box.style.borderRadius = '10px';
        box.style.boxShadow = '0 0 10px rgba(0,0,0,0.4)';
        box.style.textAlign = 'center';
        box.style.fontFamily = 'sans-serif';
    
        const label = document.createElement('label');
        label.textContent = `Enter number of players (${minPlayers}–${maxPlayers}): `;
        label.style.fontSize = '16px';
        label.style.display = 'block';
        label.style.marginBottom = '10px';
    
        const input = document.createElement('input');
        input.type = 'number';
        input.min = minPlayers;
        input.max = maxPlayers;
        input.value = minPlayers;
        input.style.fontSize = '16px';
        input.style.padding = '5px';
        input.style.marginBottom = '15px';
        input.style.width = '80px';
    
        const button = document.createElement('button');
        button.textContent = 'OK';
        button.style.fontSize = '16px';
        button.style.padding = '5px 15px';
        button.style.cursor = 'pointer';
    
        button.addEventListener('click', () => {
            const val = parseInt(input.value);
            if (!isNaN(val) && val >= minPlayers && val <= maxPlayers) {
                playerAmount = val;
            
                overlay.remove();

                initializeElements();
            } else {
                input.style.border = '2px solid red';
            }

        });
    
        box.appendChild(label);
        box.appendChild(input);
        box.appendChild(button);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    
}

function initializeElements()
{
    logical_board = Board.loadCode(game.board)
    board = new GameBoard(logical_board);
    game.pieces.forEach(p => {
        let logical_piece = Piece.loadCode(p)
        logical_pieces.push(logical_piece)
    })
    currentGameState = new GameState(logical_board, logical_pieces, playerAmount)
    activeGameState = new GameState(Board.loadCode(game.board), game.pieces.map(p => Piece.loadCode(p)), playerAmount)
    game.tileTypes.forEach(t => tileTypesList.push(TileType.loadCode(t))) ;
    game.pieceTypes.forEach(t => pieceTypesList.push(PieceType.loadCode(t))) ;
    game.buttons.forEach(b => {
        let logical_button = Button.loadCode(b)    
        buttonsList.push(logical_button)
        buttons.push(new GameButton(logical_button))
    })
    game.globalVariables.forEach(gv => otherGlobalVariables.push(gv)) 
    game.globalScripts.forEach(gs => globalScripts.push(ScriptingRule.loadCode(gs)) ) 
    globalViewer = new GameGlobalVariables(otherGlobalVariables, game.globalLayout)
    board.update();

}