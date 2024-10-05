const express = require("express");
const app = express();
const serverConfig = require("./configs/server.config");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dbConfig = require("./configs/db.config");
const init = require("./init");
const cors = require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on("error", () => {
  console.log("#### Error while connecting to mongoDB ####");
});
db.once("open", () => {
  console.log("#### Connected to mongoDB ####");
  init();
});

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/movie.routes")(app);
require("./routes/theatre.routes")(app);
require("./routes/booking.route")(app);
require("./routes/payment.routes")(app);
app.get('/',(req,res)=>{
  res.send('backend working.')
})

app.listen(serverConfig.PORT, () => {
  console.log(
    `#### connected to server at port no.: ${serverConfig.PORT} ####`
  );
});

module.exports = app;