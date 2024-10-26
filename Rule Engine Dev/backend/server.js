const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ruleRoutes = require('./routes/ruleRoutes');
const dotenv = require('dotenv')

dotenv.config()
const app = express();
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.use('/api', ruleRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});