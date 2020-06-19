var express = require("express"),
  mymods = require("./scripts/mymods.js"),
  body_parser = require("body-parser");


var savedropbox = mymods.saveDropbox;
var json2csv = mymods.json2csv;

var app = express();

// STATIC MIDDLEWARE
app.use(express.static(__dirname + "/public"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use(body_parser.json());

// VIEW LOCATIONS
app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// ROUTING
app.get("/", function(request, response){
  response.render("index.html")
});
app.get("/finish", function(request, response){
  response.render("finish.html")
});

app.post('/experiment-data', function(request, response) {
    // convert json to csv
    DATA_CSV = json2csv(request.body);

    // Get filename from data
    var rows = DATA_CSV.split("\n");

  //  console.log("rows[0] = " + rows[0]);
  //  ID_DATE_index = rows[0].split(",").indexOf('"ID_DATE"');
  //  ID_DATE = rows[1].split(",")[ID_DATE_index];
  //  ID_DATE = "gekkeHenkie";
  var TODAY = new Date();
  var SEC = String(TODAY.getSeconds()).padStart(2, '0');  // fh
  var MN = String(TODAY.getMinutes()).padStart(2, '0');  // fh
  var HH = String(TODAY.getHours()).padStart(2, '0');  // fh
  var DD = String(TODAY.getDate()).padStart(2, '0');
  var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
  var YYYY = TODAY.getFullYear();
  const DATE = YYYY + MM + DD + "_" + HH + MN + SEC;

    ID_DATE = DATE;
    console.log("ID_DATE = " + ID_DATE);

//    ID_DATE = ID_DATE.replace(/"/g, "");
    var filename = ID_DATE + ".csv";
//    var filename = "provaXXX.csv";
    savedropbox(DATA_CSV, filename);
    response.end();
    // console.log(DATA_CSV)
});


var server = app.listen(process.env.PORT, function(){
  console.log("In ascolto sulla porta %d", server.address().port)
});
