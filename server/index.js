const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = path.join(__dirname, 'attendance.json');

// Enable CORS for all origins (or specify your github pages URL)
app.use(cors());
app.use(bodyParser.json());

// Initialize file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify({ attendance: {}, metaData: {} }));
}

// GET attendance data
app.get('/api/attendance', (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error("Error reading data:", error);
    res.json({ attendance: {}, metaData: {} });
  }
});

// POST attendance data
app.post('/api/attendance', (req, res) => {
  try {
    const { attendance, metaData } = req.body;
    const newData = JSON.stringify({ attendance, metaData });
    fs.writeFileSync(DATA_FILE, newData);
    res.json({ status: 'ok' });
  } catch (error) {
    console.error("Error writing data:", error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
