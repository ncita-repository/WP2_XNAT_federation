// server.js
console.log('XNAT fed app is GO!')

// requirements from node
const express = require('express');

//requirements from exports
const search = require('./routes/search');

// start an instance of Express
const app = express();
const PORT = 3000;

// configure view engine for ejs
app.set('views', './views');
app.set('view engine', 'ejs');

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes:
// homepage
app.get('/', (req, res) => {
  res.render('home');
});

// search results
app.use('', search)

// listen...
app.listen(PORT, () => console.log(`...and listening on port ${PORT}`));
