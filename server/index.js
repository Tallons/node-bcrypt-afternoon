require("dotenv").config();
const express = require("express"),
      massive = require("massive"),
      session = require("express-session"),
      authCtrl = require("./controllers/authController"),
      treasureCtrl = require('./controllers/treasureController'),
      auth = require("./middleware/authMiddleware"),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env,
      port = SERVER_PORT,
      app = express();

  app.use(express.json());

  app.use(session({
    resave:false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
  }))

  massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
  }).then (db => {
    app.set("db", db);
    console.log("(DB) IT'S ALIVE!!!");
  })

  app.post("/auth/register", authCtrl.register);
  app.post("/auth/login", authCtrl.login);  
  app.get("/auth/logout", authCtrl.logout);
  
  app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure);
  app.get("/api/treasure/user", auth.userOnly, treasureCtrl.getUserTreasure);
  app.post("/api/treasure/user", auth.userOnly, treasureCtrl.addUserTreasure);
  app.get("/api/treasure/all", auth.userOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

app.listen(port, () => console.log("Running on Port " + port));