// Required packages
const express = require('express');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const msal = require('@azure/msal-node');
const Database = require('better-sqlite3');
const getAccessToken = require('./services/getAccessToken');
const getDevices = require('./services/getDevices');

// Load environment variables
dotenv.config();

// Validate environment variables
const requiredEnvVars = ['AUTH_CLIENT_ID', 'AUTH_CLIENT_SECRET', 'AUTH_REDIRECT_URI', 'AUTH_TENANT_ID', 'SESSION_SECRET'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

// Initialize the database
const db = new Database('app.db');

// Enable WAL mode to improve concurrent reads/writes
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    microsoft_id TEXT UNIQUE,
    display_name TEXT,
    email TEXT
  );
  CREATE TABLE IF NOT EXISTS Tenants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    tenant_name TEXT,
    tenant_id TEXT,
    client_id TEXT,
    client_secret TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
  );
`);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Set up the view engine for rendering EJS templates
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Microsoft OAuth configuration
let msalClient;
try {
  const msalConfig = {
    auth: {
      clientId: process.env.AUTH_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.AUTH_TENANT_ID}`,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
    },
  };

  msalClient = new msal.ConfidentialClientApplication(msalConfig);
} catch (error) {
  console.error('Error creating MSAL client. Check your environment variables.');
  process.exit(1);
}

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

// Routes

// Home route
app.get('/', (req, res) => {
  res.render('login');
});

// Login with Microsoft
app.get('/auth/login', async (req, res) => {
  try {
    const authUrl = await msalClient.getAuthCodeUrl({
      scopes: ['User.Read'],
      redirectUri: process.env.AUTH_REDIRECT_URI,
    });
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).send('Failed to generate authentication URL. Please try again later.');
  }
});

// OAuth callback
app.get('/auth/redirect', async (req, res) => {
  const tokenRequest = {
    code: req.query.code,
    scopes: ['User.Read'],
    redirectUri: process.env.AUTH_REDIRECT_URI,
  };

  try {
    const tokenResponse = await msalClient.acquireTokenByCode(tokenRequest);
    const user = tokenResponse.account;

    const existingUser = db.prepare('SELECT * FROM Users WHERE microsoft_id = ?').get(user.homeAccountId);

    if (!existingUser) {
      db.prepare('INSERT INTO Users (microsoft_id, display_name, email) VALUES (?, ?, ?)').run(
        user.homeAccountId,
        user.name,
        user.username
      );
    }

    req.session.user = user;
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Error during OAuth callback:', error.message);
    res.status(500).send('Authentication failed. Check the logs for details.');
  }
});

// User dashboard
app.get('/dashboard', isAuthenticated, (req, res) => {
  const user = req.session.user;
  const dbUser = db.prepare('SELECT * FROM Users WHERE microsoft_id = ?').get(user.homeAccountId);
  const tenants = db.prepare('SELECT * FROM Tenants WHERE user_id = ?').all(dbUser.id);

  res.render('dashboard', {
    title: 'Dashboard',
    user: dbUser,
    tenants,
  });
});

// View devices for a tenant (from Microsoft Graph API)
app.get('/tenants/:id/devices', isAuthenticated, async (req, res) => {
  try {
    const accessToken = await getAccessToken(process.env.AUTH_TENANT_ID, process.env.AUTH_CLIENT_ID, process.env.AUTH_CLIENT_SECRET);
    const devices = await getDevices(accessToken);

    res.render('tenant-devices', { tenantId: req.params.id, devices });
  } catch (error) {
    console.error('Error fetching devices:', error.message);
    res.status(500).send('Failed to fetch devices. Please try again later.');
  }
});

// Logout
app.get('/auth/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});