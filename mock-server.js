const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockUser = {
  id: 1,
  email: "Younus@t57.a23",
  mobile: "8897877654",
  role_id: 5,
  token: "mock-jwt-token-12345"
};

// Mock endpoints
app.post('/api/auth/login', (req, res) => {
  console.log('Login request:', req.body);
  res.json({
    success: true,
    message: "Login successful",
    data: mockUser,
    token: mockUser.token
  });
});

app.post('/api/auth/register', (req, res) => {
  console.log('Register request:', req.body);
  res.json({
    success: true,
    message: "Registration successful",
    data: mockUser
  });
});

app.get('/api/countries', (req, res) => {
  res.json([
    { id: 1, name: "United States" },
    { id: 2, name: "India" },
    { id: 3, name: "Canada" }
  ]);
});

app.get('/api/states', (req, res) => {
  res.json([
    { id: 1, name: "California", country_id: 1 },
    { id: 2, name: "New York", country_id: 1 },
    { id: 3, name: "Maharashtra", country_id: 2 }
  ]);
});

app.get('/api/cities', (req, res) => {
  res.json([
    { id: 1, name: "Mumbai", state_id: 3 },
    { id: 2, name: "Pune", state_id: 3 },
    { id: 3, name: "Los Angeles", state_id: 1 }
  ]);
});

// Catch-all for other API endpoints
app.use('/api', (req, res) => {
  console.log(`${req.method} ${req.path} - Mock response`);
  res.json({
    success: true,
    message: "Mock response",
    data: {},
    mock: true
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock server running on http://localhost:${PORT}`);
  console.log(`📱 Update baseUrl to: http://localhost:${PORT}/api/`);
});
