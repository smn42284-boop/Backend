const db = require('../config/database');

exports.submitContact = async (req, res) => {
  try {
    const {
      name,
      job_title,
      email,
      phone,
      country,
      company,
      requirements,
      source,
      privacy_consent,
      newsletter
    } = req.body;
    
    // Convert checkbox values to SQLite boolean (0 or 1)
    const privacyConsent = privacy_consent ? 1 : 0;
    const newsletterSub = newsletter ? 1 : 0;
    
    const result = await db.runAsync(
      `INSERT INTO contacts (
        name, job_title, email, phone, country, company, 
        requirements, source, privacy_consent, newsletter
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        job_title,
        email,
        phone || null,
        country,
        company || null,
        requirements,
        source || null,
        privacyConsent,
        newsletterSub
      ]
    );
    
    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully',
      data: { id: result.id }
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit contact form' 
    });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await db.allAsync(
      'SELECT * FROM contacts ORDER BY submitted_at DESC'
    );
    
    res.json({ 
      success: true, 
      data: contacts 
    });
    
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch contacts' 
    });
  }
};

exports.getContactStats = async (req, res) => {
  try {
    const stats = await db.getAsync(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new,
        SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved
      FROM contacts
    `);
    
    res.json({ 
      success: true, 
      data: stats 
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch contact statistics' 
    });
  }
};