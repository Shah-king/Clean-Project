require('dotenv').config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = express();


const PORT = process.env.PORT || 8080;

mongoose.set('strictQuery', false);


const admin = require("./firebase-admin-sdk/admin"); // Firebase Admin SDK

// firebase admin sdk token verification
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach the user data to the request
    next(); // Continue to the actual route handler
  } catch (err) {
    console.error("Token verification failed:", err);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};




// Middleware to parse JSON
app.use(express.json());
app.use(cors());               
mongoose.set('bufferCommands', false); // Disable buffering to catch issues early


// Define User Schema & Model
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: String,
  role: String,
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const ReportSchema = new mongoose.Schema({
  creator_id: { type: String, required: true}, // user Firebase id of the one who created report.
  handler_id: {type: String, required: false}, // staff id of the one who took the report and was assigned to complete it can be null
  author_name: {type: String, required:true},
  handler_name: {type: String, required:false},
  title: { type: String, required: true, unique: false}, // title of the report
  description:{type: String, required: true, unique: false }, // the description of the report
  image:{type: String, required: false, unique: false }, // the link to the image stored in cloud
  location: {type: String, required: true, unique: false}, // location of the place on campus
  status: {type: String, default: 'new'}, //  status of report (new, in progress, completed). Will be detetmined by system.
  createdAt: { type: Date, default: Date.now }, // timestamp of the report being posted
});

const User = mongoose.model('User', userSchema);
const Report = mongoose.model('Report', ReportSchema);

// POST /api/users - Add a new user
app.post('/api/users', verifyToken, async (req, res) => {
  const { uid, name, role, email } = req.body;

  // comparing uid in token with what's being submitted
  if (req.user.uid !== uid) {
    return res.status(403).json({ error: "UID mismatch" });
  }

  try {
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ uid, name, role, email });
    await newUser.save();

    console.log("User saved to DB:", newUser);
    res.status(201).json({ message: 'User saved', user: newUser });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users - Retrieve user by uid
app.get('/api/user/:uid', async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Create a new report
app.post('/api/create/report', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ error: err.message });
  }
});

// get all reports created or taken by a certain user 
// (For student numnber of taken reports is alway zero as they cant take report only post)
app.get('/api/reports/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const reports = await Report.find({
      $or: [
        { creator_id: uid },
        { handler_id: uid }
      ]
    }).sort({ createdAt: -1 });

    res.json(reports);
  } catch (err) {
    console.error('Error fetching user reports:', err);
    res.status(500).json({ error: err.message });
  }
});

// get all reports
app.get('/api/reports/', async (req, res) => {
  try {
    const reports = await Report.find({ status: { $ne: "completed" } }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ error: err.message });
  }
});


// get the specific repoort by report id
app.get('/api/report/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.json(report);
  } catch (err) {
    console.error('Error fetching report by ID:', err);
    res.status(500).json({ error: err.message });
  }
});


// Update report status
app.put('/api/update/report/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // This should include handler_id and/or status

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Update fields conditionally
    if (updateData.handler_id !== undefined) {
      report.handler_id = updateData.handler_id;
    }
     if (updateData.handler_name !== undefined) {
      report.handler_name = updateData.handler_name;
    }
    if (updateData.status !== undefined) {
      report.status = updateData.status;
    }

    await report.save();

    res.json(report);
  } catch (err) {
    console.error('Error updating report by ID:', err);
    res.status(500).json({ error: err.message });
  }
});





mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000, // Optional timeout
})
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ Mongoose disconnected');
});