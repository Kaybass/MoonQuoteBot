
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
load quotes here
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

//event handler for message in a chat the bot is connected to or a DM
client.on('message', function(message) {
    var messageSplit = message.content.match(/("[^"]*")|[^ ]+/g);
    //console.log(messageSplit);

    //First we see if they gave the quote command with an option
    if(messageSplit.length > 1 && messageSplit[0] == "/quote"){
        
        //Next we determine what option they used if they didn't fuck up
        if(messageSplit[1] == "-a" || messageSplit[1] == "--add"){

            if(messageSplit.length == 4 && messageSplit[2] != "" && messageSplit[3] != ""){

                //Store to disk and memory
                meme.run(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,""));
                quotes.push(new Array(messageSplit[2].replace(/\"/g,""),messageSplit[3].replace(/\"/g,"")))

                //Say that all is well
                message.reply(Responses.QUOTE_ADDED);
            
            //John will eventually hit this
            } else {
                message.reply(Responses.ADD_QUOTES_PROPER_USAGE)
            }
        //List the quotes, will in the future return a link to a webpage containing quotes
        } else if (messageSplit[1] == "-l" || messageSplit[1] == "--list") {
            var response = "\n";

            quotes.forEach(function(quote){
                response += '"' + quote[0] + '" -' + quote[1] + '\n';
            });

            message.reply(response);
        
        //Help
        } else if (messageSplit[1] == "-h" || messageSplit[1] == "--help"){
            message.reply(Responses.HELP_MESSAGE);
        //If they fucked up we give them help
        } else {
            message.reply(Responses.HELP_MESSAGE);
        }
    //For John
    } else if (messageSplit.length > 0 && messageSplit.includes("@everyone")) {
        message.reply(Responses.SOMEONE_SAID_ATEVERYONE);

    // if they just say /quote we also print the help message
    } else if (messageSplit.length == 1 && messageSplit[0] == "/quote"){
        message.reply(Responses.HELP_MESSAGE);
    }

});


/*
Web Client
*/

//This is going to be a fancy responsive page-o when I get to writing it
app.get('/', function (req, res) {
    res.render('index');
});

//This is just a plain old page-o
app.get('/plainlist', function (req, res) {
    
    res.render('plainlist', {
        quotes : quotes
    });
});

app.listen(Settings.port, function () {
    console.log('MoonBot web frontend listening on port',Settings.port,'!');
});
