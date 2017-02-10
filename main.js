
/**
MoonBot

Takes quotes -> website

yay!!!!
*/

//Discord.js
var Discord = require("discord.js");

//Settings
var Settings = require("./settings/settings.json");
var Responses = require("./responses.json");

var client = new Discord.Client();

var express = require('express');
var app = express();

app.set('view engine','ejs');

/*
Maybe load quotes here
*/
var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('quotes.db');

var meme = db.prepare("INSERT INTO quotes VALUES (?,?)");

var quotes = new Array();

db.each("SELECT quote, author FROM quotes", function(err, row){
    //console.log('"' + row.quote + '" ' + row.author);
    quotes.push(new Array(row.quote, row.author))
});

/*
Discord bot
*/
client.login(Settings.token);
console.log(Responses.LOGGED_INTO_DISCORD);

client.on('message', function(message) {
    var messageSplit = message.content.match(/("[^"]*")|[^ ]+/g);
    //console.log(messageSplit);

    if(messageSplit.length > 1 && messageSplit[0] == "/quote"){

        if(messageSplit[1] == "-a" || messageSplit[1] == "--add"){
            if(messageSplit.length == 4 && messageSplit[2] != "" && messageSplit[3] != ""){
                meme.run(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,""));
                //console.log(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,""));
                quotes.push(new Array(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,"")))

                message.reply(Responses.QUOTE_ADDED);

            } else {
                message.reply(Responses.ADD_QUOTES_PROPER_USAGE)
            }

        } else if (messageSplit[1] == "-l" || messageSplit[1] == "--list") {
            var response = "\n";

            quotes.forEach(function(quote){
                response += '"' + quote[0] + '" -' + quote[1] + '\n';
            });

            message.reply(response);
        } else if (messageSplit[1] == "-h" || messageSplit[1] == "--help"){
            message.reply(Responses.HELP_MESSAGE);
        }
    } else if (messageSplit.length > 0 && messageSplit.includes("@everyone")) {
        message.reply(Responses.SOMEONE_SAID_ATEVERYONE);
    }
});


/*
Web Client
*/
app.get('/', function (req, res) {
    res.render('index');
});

app.get('/plainlist', function (req, res) {
    var response = "";

    quotes.forEach(function(quote){
        response += '<h1>"' + quote[0] + '"</h1> <h2>-' + quote[1] + '</h2>\n';
    });
    res.send(response);
});

app.listen(Settings.port, function () {
    console.log('MoonBot web frontend listening on port',Settings.port,'!');
});


/*
Shell
*/
