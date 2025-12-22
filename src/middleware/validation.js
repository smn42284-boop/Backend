const validateContact = (req, res, next) => {
  console.log('🔍 Validating contact form data...');
  
  const { 
    name, 
    job_title, 
    email, 
    country, 
    requirements, 
    privacy_consent 
  } = req.body;
  
  const errors = [];
  
  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  
  // Job title validation
  if (!job_title || job_title.trim().length === 0) {
    errors.push('Please select your job title');
  }
  
  // Email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }
  
  // Country validation
  if (!country || country.trim().length === 0) {
    errors.push('Please select your country');
  }
  
  // Requirements validation
  if (!requirements || requirements.trim().length < 10) {
    errors.push('Please describe your project (at least 10 characters)');
  }
  
  // Privacy consent validation
  if (!privacy_consent) {
    errors.push('You must agree to the privacy policy');
  }
  
  if (errors.length > 0) {
    console.log('❌ Validation failed:', errors);
    return res.status(400).json({
      success: false,
      error: 'Please fix the following errors:',
      details: errors
    });
  }
  
  console.log('✅ Validation passed');
  next();
};

module.exports = { validateContact };