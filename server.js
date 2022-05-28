const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');

const app = express();
const PORT = process.env.PORT || 3001;

// importing connection to sequelize
const sequelize = require('./config/connection');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

// sets up handlebars.js as app's template engine of choice
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// express.static() middleware takes all of the folder contents and serves them as static assets 
app.use(express.static(path.join(__dirname, 'public')));

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});