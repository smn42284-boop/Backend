const express = require('express');
const router = express.Router();
const { validateContact } = require('../middleware/validation');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const db = require('../config/database');

// Submit contact form
router.post('/submit', validateContact, (req, res) => {
  const { name, email, phone, company, requirements } = req.body;
  
  db.run(
    'INSERT INTO contacts (name, email, phone, company, requirements) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || null, company || null, requirements],
    function(err) {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to submit contact form' 
        });
      }
      
      res.status(201).json({
        success: true,
        message: 'Contact form submitted successfully',
        data: { id: this.lastID }
      });
    }
  );
});

// Get all contacts (admin only)
router.get('/all', authMiddleware, adminMiddleware, (req, res) => {
  db.all('SELECT * FROM contacts ORDER BY submitted_at DESC', [], (err, contacts) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch contacts' 
      });
    }
    
    res.json({ 
      success: true, 
      data: contacts 
    });
  });
});

module.exports = router;