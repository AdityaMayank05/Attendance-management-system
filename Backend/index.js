const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const createUserRoute = require('./Routes/CreateUser'); // Ensure this path is correct
const studentsRoute = require('./Routes/students');
const teachersRoute = require('./Routes/teachers');
const attendanceRoutes = require('./Routes/attendance');

const app = express();
const port = 5000;

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://adityamayank708:Mayank123@cluster0.c81ywks.mongodb.net/STUDENTSMERN?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
connectDB();

// Enable CORS
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use('/api', createUserRoute);
app.use('/api', studentsRoute);
app.use('/api', teachersRoute);
app.use('/api/attendance', attendanceRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
