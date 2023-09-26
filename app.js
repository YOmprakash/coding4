const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });

    app.listen(3000, () =>
      console.log("server starting at https://localhost/3000/")
    );
  } catch (e) {
    console.log(`DB Error ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponse = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

//api 1
app.get("/players/", async (request, response) => {
  const getQuery = `
    SELECT * FROM cricket_team;
    `;
  const players = await db.all(getQuery);
  response.send(players.map((each) => convertDbObjectToResponse(each)));
});

//api 2
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postQuery = `
    INSERT INTO cricket_team(player_name,jersey_name,role)
    VALUES ('${playerName}','${jerseyNumber}','${role}');
    `;
  const player = await db.run(postQuery);
  response.send("Player Added to Team");
});

//api 3

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayersQuery = `
    SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
  const player = await db.get(getPlayersQuery);
  respond.send(convertDbObjectToResponse(player));
});

//api 4

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;

  const putQuery = `
    UPDATE cricket_team
    SET 
    player_name = '${playerName}',
    jersey_number = '${jerseyNumber}'
    role = '${role}'
    WHERE 
    player_id = ${playerId};`;
  await db.run(putQuery);
  response.send("Player Details Updated");
});
//api 5
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
DELETE FROM 
cricket_team
WHERE 
player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.export = app;
