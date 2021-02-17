const express = require('express'); 
const app = express(); 
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.set('view engine', 'ejs');
app.use(express.static('./styles'));

app.listen(5050, () =>  console.log('Server is running...'));


class Game {
    constructor(name, genre, developer, description, gameHours) {
        this.name = name;
        this.genre = genre;
        this.developer = developer;
        this.description = description;
        this.gameHours = gameHours;
    }
}

class GamesList {
    games = [
        new Game('Cyberpunk 2077', 'Action RPG', 'CDPR', 'Описание', 300),
        new Game('The Wicher 3', 'Action RPG', 'CDPR', 'Описание', 158)
    ];

    selectedGameIndex = -1;

    getGamesList() {
        return this.games;
    }

    selectGame(index){
        if (this.games[index])
        {
            this.selectedGameIndex = index;
        } else 
        {
            this.selectedGameIndex = -1;
        }
    }

    getSelectedGame() {
        return this.games[this.selectedGameIndex];
    }

    addGame(game){
        if (game instanceof Game){
            this.games.push(game);
        }
    }
}

let gamesList = new GamesList();

app.get('/', function(req, res) {
    res.render('main', {games: gamesList.getGamesList(), pageType: "main"})
});

app.get('/info/:id', function(req, res) {
    res.render('info', {games: gamesList.getGamesList(), game: gamesList.games[req.params.id], pageType: "info", gameID: req.params.id})
});

app.get('/add', urlencodedParser, function(request, response) {
    response.render('add', {pageType: "add"})
});

app.get('/info/edit/:id', urlencodedParser, function(request, response) {
    response.render('edit', {pageType: "edit", oldGame: gamesList.games[request.params.id], oldGameID: request.params.id})
})

app.post('/info/edit/:id', urlencodedParser, function(request, response) {
    if(!request.body) return response.sendStatus(400);

    if(request.body.oldGameIndex != -1){
        newGame = new Game(request.body.name, request.body.genre, request.body.developer, request.body.description, request.body.gameHours)
        gamesList.games[request.body.oldGameIndex] = newGame; 
    }
    
    response.redirect(303, "/");
})

app.get('/info/delete/:id', urlencodedParser, function(request, response) {
    response.render('delete', {pageType: "delete", gameID: request.params.id,  oldGame: gamesList.games[request.params.id]});
})

app.post("/add", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);
    const game = new Game(request.body.name, request.body.genre, request.body.developer, request.body.description, request.body.gameHours);
    gamesList.addGame(game);
    response.redirect(303, "/");
});

app.post('/info/delete/:id', urlencodedParser, function(request, response) {
    if(!request.body) return response.sendStatus(400);

    if(request.body.gameIndex != -1){
        gamesList.games.splice(request.body.gameIndex, 1);
    }
    
    response.redirect(303, "/");
})
