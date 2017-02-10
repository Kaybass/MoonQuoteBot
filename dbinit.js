var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('quotes.db');
db.run("CREATE TABLE quotes (quote TEXT, author TEXT)");