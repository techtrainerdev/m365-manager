const fs = require('fs');
const path = require('path');

// Make sure views directory exists
const viewsDir = path.join(__dirname, 'views');
if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir);
}

// Create basic dashboard template
const dashboardTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1>M365 Management Dashboard</h1>
    <p>Welcome, <%= user.username %>!</p>
    
    <div class="row">
      <div class="col-md-3 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Users</h5>
            <p><%= stats.users %> users</p>
            <a href="/users" class="btn btn-primary">View Users</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Devices</h5>
            <p><%= stats.devices %> devices</p>
            <a href="/devices" class="btn btn-primary">View Devices</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Sites</h5>
            <p><%= stats.sites %> sites</p>
            <a href="/sharepoint" class="btn btn-primary">View Sites</a>
          </div>
        </div>
      </div>
      
      <div class="col-md-3 mb-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Teams</h5>
            <p><%= stats.teams %> teams</p>
            <a href="/teams" class="btn btn-primary">View Teams</a>
          </div>
        </div>
      </div>
    </div>
    
    <a href="/logout" class="btn btn-danger mt-3">Logout</a>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Create users template
const usersTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Users Management</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1>Users Management</h1>
    <p>Manage your Microsoft 365 users</p>
    
    <div class="mb-3">
      <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      <a href="#" class="btn btn-primary">Add User</a>
    </div>
    
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <% users.forEach(user => { %>
          <tr>
            <td><%= user.name %></td>
            <td><%= user.email %></td>
            <td><%= user.department %></td>
            <td>
              <% if (user.status === 'Active') { %>
                <span class="badge bg-success">Active</span>
              <% } else { %>
                <span class="badge bg-danger">Disabled</span>
              <% } %>
            </td>
            <td>
              <a href="#" class="btn btn-sm btn-outline-primary">Edit</a>
              <a href="#" class="btn btn-sm btn-outline-danger">Delete</a>
            </td>
          </tr>
        <% }) %>
      </tbody>
    </table>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Create devices template
const devicesTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Devices Management</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <h1>Devices Management</h1>
    <p>Manage your Microsoft 365 devices</p>
    
    <div class="mb-3">
      <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
      <a href="#" class="btn btn-primary">Add Device</a>
    </div>
    
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Device Name</th>
          <th>Type</th>
          <th>OS</th>
          <th>Owner</th>
          <th>Compliance</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <% devices.forEach(device => { %>
          <tr>
            <td><%= device.name %></td>
            <td><%= device.type %></td>
            <td><%= device.os %></td>
            <td><%= device.owner %></td>
            <td>
              <% if (device.compliance === 'Compliant') { %>
                <span class="badge bg-success">Compliant</span>
              <% } else { %>
                <span class="badge bg-danger">Non-compliant</span>
              <% } %>
            </td>
            <td>
              <a href="#" class="btn btn-sm btn-outline-primary">View</a>
              <a href="#" class="btn btn-sm btn-outline-danger">Remove</a>
            </td>
          </tr>
        <% }) %>
      </tbody>
    </table>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Create coming-soon template
const comingSoonTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title><%= service %> - Coming Soon</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5 text-center">
    <h1><%= service %></h1>
    <div class="mt-5">
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="currentColor" class="bi bi-tools text-primary" viewBox="0 0 16 16">
        <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3c0-.269-.035-.53-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814L1 0Zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708ZM3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026L3 11Z"/>
      </svg>
      <h2 class="mt-4">Coming Soon</h2>
      <p class="text-muted">This feature is currently under development.</p>
      <a href="/dashboard" class="btn btn-primary mt-3">Return to Dashboard</a>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Create index template
const indexTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>M365 Management Portal</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5 text-center">
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="#0078d4" class="bi bi-microsoft" viewBox="0 0 16 16">
      <path d="M7.462 0H0v7.19h7.462V0zM16 0H8.538v7.19H16V0zM7.462 8.211H0V16h7.462V8.211zm8.538 0H8.538V16H16V8.211z"/>
    </svg>
    <h1 class="display-4 mt-3">Microsoft 365 Management Portal</h1>
    <p class="lead">Unified management for your Microsoft 365 environment</p>
    
    <div class="mt-5">
      <% if (isAuthenticated) { %>
        <a href="/dashboard" class="btn btn-primary btn-lg">Go to Dashboard</a>
      <% } else { %>
        <a href="/login" class="btn btn-primary btn-lg">Sign In</a>
      <% } %>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Create error template
const errorTemplate = `
<!DOCTYPE html>
<html>
<head>
  <title>Error</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
  <div class="container mt-5">
    <div class="card border-danger">
      <div class="card-header bg-danger text-white">
        <h3 class="mb-0">Error</h3>
      </div>
      <div class="card-body">
        <h5 class="card-title"><%= message %></h5>
        <% if (typeof error !== 'undefined' && error) { %>
          <div class="mt-4">
            <h6>Error Details:</h6>
            <pre class="bg-light p-3"><%= JSON.stringify(error, null, 2) %></pre>
          </div>
        <% } %>
        <div class="mt-4">
          <a href="/" class="btn btn-primary">Back to Home</a>
        </div>
      </div>
    </div>
  </div>
  
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`;

// Write all templates to disk
const templates = {
  'dashboard.ejs': dashboardTemplate,
  'users.ejs': usersTemplate,
  'devices.ejs': devicesTemplate,
  'coming-soon.ejs': comingSoonTemplate,
  'index.ejs': indexTemplate,
  'error.ejs': errorTemplate
};

let successCount = 0;
let errorCount = 0;

Object.entries(templates).forEach(([fileName, content]) => {
  try {
    fs.writeFileSync(path.join(viewsDir, fileName), content);
    console.log(`✅ Successfully created/updated: ${fileName}`);
    successCount++;
  } catch (error) {
    console.error(`❌ Error creating/updating ${fileName}:`, error);
    errorCount++;
  }
});

console.log(`\nTemplate update complete: ${successCount} succeeded, ${errorCount} failed`);
console.log('You can now restart your application');