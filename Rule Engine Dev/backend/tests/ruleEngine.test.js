const { createRule, combineRules, evaluateRule } = require('../utils/ruleEngine');

describe('Rule Engine', () => {
  test('createRule', () => {
    const ruleString = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const ast = createRule(ruleString);
    expect(ast.type).toBe('operator');
    expect(ast.value).toBe('AND');
  });

  test('combineRules', () => {
    const rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";
    const combinedAst = combineRules([rule1, rule2]);
    expect(combinedAst.type).toBe('operator');
    expect(combinedAst.value).toBe('AND');
  });

  test('evaluateRule', () => {
    const rule = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
    const ast = createRule(rule);
    
    const data1 = { age: 35, department: 'Sales', salary: 60000, experience: 3 };
    expect(evaluateRule(ast, data1)).toBe(true);
    
    const data2 = { age: 28, department: 'Marketing', salary: 45000, experience: 2 };
    expect(evaluateRule(ast, data2)).toBe(false);
  });
});