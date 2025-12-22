const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    console.log('🔐 Login attempt for:', username);
    
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username and password are required' 
      });
    }
    
    // Use async version of database query
    db.getAsync('SELECT * FROM users WHERE username = ?', [username])
      .then(async (user) => {
        if (!user) {
          console.log('❌ User not found:', username);
          return res.status(401).json({ 
            success: false, 
            error: 'Invalid credentials' 
          });
        }
        
        console.log('✅ User found:', user.username);
        
        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('🔐 Password valid:', isValidPassword);
        
        if (!isValidPassword) {
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
          process.env.JWT_SECRET || 'development_secret_key',
          { expiresIn: '24h' }
        );
        
        console.log('🎉 Login successful for:', user.username);
        
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
      })
      .catch(err => {
        console.error('Database error:', err);
        res.status(500).json({ 
          success: false, 
          error: 'Login failed - database error' 
        });
      });
      
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
};