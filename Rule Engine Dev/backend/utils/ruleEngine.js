function createRule(ruleString) {
    const tokens = tokenize(ruleString);
    return parseExpression(tokens);
  }
  
  function tokenize(ruleString) {
    return ruleString.match(/$$|$$|AND|OR|[a-zA-Z0-9]+|[<>=]+|'[^']*'/g);
  }
  
  function parseExpression(tokens) {
    const output = [];
    const operators = [];
    const precedence = { 'AND': 2, 'OR': 1 };
  
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === '(') {
        operators.push(token);
      } else if (token === ')') {
        while (operators.length && operators[operators.length - 1] !== '(') {
          output.push(operators.pop());
        }
        operators.pop(); // Remove the '('
      } else if (token === 'AND' || token === 'OR') {
        while (operators.length && precedence[operators[operators.length - 1]] >= precedence[token]) {
          output.push(operators.pop());
        }
        operators.push(token);
      } else {
        output.push(token);
      }
    }
  
    while (operators.length) {
      output.push(operators.pop());
    }
  
    return buildAST(output);
  }
  
  function buildAST(tokens) {
    const stack = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token === 'AND' || token === 'OR') {
        const right = stack.pop();
        const left = stack.pop();
        stack.push({
          type: 'operator',
          value: token,
          left,
          right
        });
      } else {
        if (i + 2 < tokens.length && (tokens[i + 1] === '>' || tokens[i + 1] === '<' || tokens[i + 1] === '=')) {
          stack.push({
            type: 'operand',
            left: token,
            value: tokens[i + 1],
            right: tokens[i + 2]
          });
          i += 2;
        } else {
          stack.push(token);
        }
      }
    }
    return stack[0];
  }
  
  function combineRules(rules) {
    if (!rules.length) {
      throw new Error("No rules provided");
    }
    
    if (rules.length === 1) {
      return createRule(rules[0]);
    }
    
    return {
      type: 'operator',
      value: 'AND',
      left: createRule(rules[0]),
      right: combineRules(rules.slice(1))
    };
  }
  function combineRules(rules) {
    if (!rules.length) {
      throw new Error("No rules provided");
    }
    
    if (rules.length === 1) {
      return rules[0];
    }
    
    return rules.reduce((combined, rule) => ({
      type: 'operator',
      value: 'AND',
      left: combined,
      right: rule
    }));
  }
  
  function evaluateRule(node, data) {
    // console.log('Evaluating node:', JSON.stringify(node));
    // console.log('With data:', JSON.stringify(data));
  
    if (typeof node === 'string') {
    //   console.log('Node is a string, returning:', node);
      return node;
    }
  
    if (node.type === 'operator') {
      if (node.value === 'AND') {
        const leftResult = evaluateRule(node.left, data);
        const rightResult = evaluateRule(node.right, data);
        // console.log(`AND operation: ${leftResult} && ${rightResult}`);
        return leftResult && rightResult;
      } else if (node.value === 'OR') {
        const leftResult = evaluateRule(node.left, data);
        const rightResult = evaluateRule(node.right, data);
        // console.log(`OR operation: ${leftResult} || ${rightResult}`);
        return leftResult || rightResult;
      }
    } else if (node.type === 'operand') {
      const leftValue = data[node.left];
      const rightValue = node.right.replace(/'/g, '');
      
      let result;
      switch (node.value) {
        case '=':
          result = String(leftValue) === rightValue;
          break;
        case '>':
          result = parseFloat(leftValue) > parseFloat(rightValue);
          break;
        case '<':
          result = parseFloat(leftValue) < parseFloat(rightValue);
          break;
        default:
          result = false;
      }
    //   console.log(`Operand evaluation: ${node.left} ${node.value} ${rightValue} = ${result}`);
      return result;
    }
    
    // console.log('Fallback case, returning false');
    return false;
  }
  
  module.exports = { createRule, combineRules, evaluateRule };