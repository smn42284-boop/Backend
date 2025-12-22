const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Login route - FIXED VERSION
router.post('/login', async (req, res) => {
  console.log('Login attempt:', req.body);
  
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    // Query the database
    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ 
          success: false, 
          error: 'Database error' 
        });
      }
      
      if (!user) {
        console.log('User not found:', username);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }
      
      console.log('User found:', user.username);
      
      // Compare passwords
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        console.log('Invalid password for user:', username);
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid credentials' 
        });
      }
      
      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          email: user.email,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log('Login successful for user:', username);
      
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed',
      details: error.message 
    });
  }
});

// Verify token endpoint for debugging
router.post('/verify', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ valid: false, error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.status(401).json({ valid: false, error: error.message });
  }
});

module.exports = router;