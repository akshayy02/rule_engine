const VALID_ATTRIBUTES = ['age', 'department', 'salary', 'experience'];

function validateAttributes(req, res, next) {
  const userData = req.body;
  const invalidAttributes = Object.keys(userData).filter(attr => !VALID_ATTRIBUTES.includes(attr));
  
  if (invalidAttributes.length > 0) {
    return res.status(400).json({ error: `Invalid attributes: ${invalidAttributes.join(', ')}` });
  }
  
  next();
}

module.exports = validateAttributes;