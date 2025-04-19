let game = null;

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


            var gameBoard = new GameBoard(Board.loadCode(game.board));

        } catch (err) {
            alert("Invalid JSON file.");
            console.error("Parse error:", err);
        }
    };
    reader.readAsText(file);
    
});

