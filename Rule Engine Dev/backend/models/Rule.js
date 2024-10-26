const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
  type: String,
  left: mongoose.Schema.Types.Mixed,
  right: mongoose.Schema.Types.Mixed,
  value: String
});

const RuleSchema = new mongoose.Schema({
  name: String,
  ast: NodeSchema,
  str: String,
});

module.exports = mongoose.model('Rule', RuleSchema);