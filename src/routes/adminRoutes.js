const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const db = require('../config/database');

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, (req, res) => {
  const stats = {};
  
  db.serialize(() => {
    db.get('SELECT COUNT(*) as total FROM contacts', (err, row) => {
      if (!err) stats.totalContacts = row.total;
    });
    
    db.get('SELECT COUNT(*) as new FROM contacts WHERE status = "new"', (err, row) => {
      if (!err) stats.newContacts = row.new;
    });
    
    db.get('SELECT COUNT(*) as total FROM users', (err, row) => {
      if (!err) stats.totalUsers = row.total;
    });
    
    db.get('SELECT COUNT(*) as total FROM products', (err, row) => {
      if (!err) stats.totalProducts = row.total;
    });
    
    setTimeout(() => {
      res.json({ 
        success: true, 
        data: stats 
      });
    }, 100);
  });
});

module.exports = router;