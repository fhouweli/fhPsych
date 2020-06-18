require("dotenv").config();
var Dropbox = require("dropbox").Dropbox;
const fetch = require("node-fetch");

const dbx = new Dropbox({
  accessToken: process.env.DROPBOXACCESSTOKEN,
  //accessToken: 'qKaEk_RbyS8AAAAAAAA6neDwZG-MZ2MUXakwLyoaF0coZsHUjt0-4QDFZmWQGfL3',
  fetch
});

saveDropbox = function(content, filename){

  if (dbx.accessToken != 'qKaEk_RbyS8AAAAAAAA6neDwZG-MZ2MUXakwLyoaF0coZsHUjt0-4QDFZmWQGfL3'){
    console.log("ERRORE: " + dbx.accessToken);
    console.log("NON E'  " + 'qKaEk_RbyS8AAAAAAAA6neDwZG-MZ2MUXakwLyoaF0coZsHUjt0-4QDFZmWQGfL3');
  }

  dbx.filesUpload({
    path: "/" + filename,
    contents: content
  }).then(function() {
        console.log("Completed");
    })
        .catch(function(error) {
            console.error(error);
        });
};

function json2csv(objArray){
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var line = '';
    var result = '';
    var columns = [];

    var i = 0;
    for (var j = 0; j < array.length; j++) {
        for (var key in array[j]) {
            var keyString = key + "";
            keyString = '"' + keyString.replace(/"/g, '""') + '",';
            if (!columns.includes(key)) {
                columns[i] = key;
                line += keyString;
                i++;
            }
        }
    }

    line = line.slice(0, -1);
    result += line + '\r\n';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var j = 0; j < columns.length; j++) {
            var value = (typeof array[i][columns[j]] === 'undefined') ? '' : array[i][columns[j]];
            var valueString = value + "";
            line += '"' + valueString.replace(/"/g, '""') + '",';
        }

        line = line.slice(0, -1);
        result += line + '\r\n';
    }

    return result;

};

module.exports.saveDropbox = saveDropbox;
module.exports.json2csv = json2csv;
