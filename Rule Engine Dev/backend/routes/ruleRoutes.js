const express = require('express');
const Rule = require('../models/Rule');
const { createRule, combineRules, evaluateRule } = require('../utils/ruleEngine');
const validateAttributes = require('../middleware/validateAttributes');

const router = express.Router();

router.post('/rules', async (req, res) => {
    try {
      const { name, ast } = req.body;
      let parsedAst;
      try {
        parsedAst = createRule(ast);
      } catch (parseError) {
        return res.status(400).json({ error: `Invalid rule format: ${parseError.message}` });
      }
      const rule = new Rule({ name, ast: parsedAst, str: ast });
      await rule.save();
      res.status(201).json({ id: rule._id, name: rule.name, ast: rule.ast, str: ast });
    } catch (error) {
      res.status(500).json({ error: `Server error: ${error.message}` });
    }
  });

router.get('/rules',async (req,res)=>{
    try{
        const rules = await Rule.find();
        if(!rules){
            return res.json({message: "No rule exists"})
        }
        res.json(rules);
    } catch(err){
        res.status(400).json({ error: error.message });
    }
})

router.get('/rules/:id', async (req, res) => {
  try {
    const rule = await Rule.findById(req.params.id);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.post('/evaluate', validateAttributes, async (req, res) => {
    try {
      const userData = req.body;
      const rules = await Rule.find();
      
      if (rules.length === 0) {
        return res.status(400).json({ error: 'No rules found' });
      }
  
      const combinedRule = combineRules(rules.map(rule => rule.ast));
      const result = evaluateRule(combinedRule, userData);
      
      res.json({ eligible: result });
    } catch (error) {
      
        sole.error('Evaluation error:', error);
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;