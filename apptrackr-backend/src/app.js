const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const connectMongo = require('./config/mongodb');  // ADD THIS
connectMongo();                                     // ADD THIS

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');  // ADD THIS

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);  // ADD THIS

app.get('/', (req, res) => res.send('AppTrackr API running 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));