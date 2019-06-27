const exampleScore = {
  nick: "Ojej",
  points: 100,
  lastest:true
}

const path = require("path");
const bodyParser = require('body-parser')
const app = require('express')()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 5555

const stf = path.join(__dirname, 'index.html');
app.get('/', (req, res) => res.sendFile(stf))


let scores = [exampleScore,exampleScore,exampleScore,exampleScore];
let limit = 10;
const password = "q";

function log(txt){
  io.emit("log",txt);
}

function addScore(score){
  if(score.points === NaN) {
    log("wynik odrzucony - nieprawidłowa liczba pkt.")
    return;
  }
  if(scores.lenght >= limit ){
    const najgorszyWynik = scores[scores.lenght - 1];
    if(najgorszyWynik.points >= score.points) {
      log("wynik odrzucony - zbyt mało pkt.");
    }
  }  
  if(!score.nick) score.nick = "owca"; 
  scores.push(score);
  scores.sort((a,b)=> b.points - a.points );
  scores = scores.slice(0,limit);
  io.emit("update",scores);
  log(`dodano wynik ${score.nick}:${score.points}, (${scores.length}/${limit})`);
  
} 


app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
app.use(bodyParser.json())

app.get('/highscores', (req, res) => {
  log("Ktoś zapytał o wynik")
  res.json(scores)
})
app.post('/highscores', (req, res) => {
  log(JSON.stringify(req.body))
  const newScore = req.body;
  newScore.points = Number(newScore.points);
  addScore(newScore)
  res.json({});
})
app.post('/limit', (req, res) => {
  //
})
app.delete('/highscores', (req, res) => {
  //
})

io.on('connection', function (socket) {
  socket.on('update', function (data) {
    // add score
  });
});

server.listen(port, () => console.log(`Example app listening on port ${port}!`))