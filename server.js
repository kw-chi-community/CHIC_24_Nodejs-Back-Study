const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

// Set up multer for file uploads
const upload = multer({ dest: 'uploads/' }); // 저장할 폴더 설정

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving (CSS, Images, JS)
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static('uploads')); // 업로드된 파일을 서빙

// 영화 회고록 데이터 샘플
let records = [];

// Load records from file
fs.readFile('records.json', (err, data) => {
  if (err) {
    console.error("Error loading data:", err);
    records = []; // Empty array if error occurs
  } else {
    records = JSON.parse(data);
    console.log("Initial records:", records);
  }
});

// Save records to file
const saveRecordsToFile = () => {
  fs.writeFile('records.json', JSON.stringify(records, null, 2), (err) => {
    if (err) {
      console.error("Error saving data:", err);
    }
  });
};

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get all records
app.get("/api/records", (req, res) => {
  res.json(records);
});

// Get a single record by ID
app.get("/api/records/:id", (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const record = records.find((r) => r.id === recordId);

  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: "Record not found" });
  }
});

// Add a new record
app.post("/api/records", (req, res) => {
  const newRecord = {
    id: records.length + 1,
    title: req.body.title,
    image: req.body.image || "poster2.jpg",
    content: req.body.content || ""
  };
  records.push(newRecord);
  saveRecordsToFile();
  res.status(201).json(newRecord);
});

// Update a record
app.put("/api/records/:id", upload.single('image'), (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const record = records.find((r) => r.id === recordId);

  if (record) {
    record.title = req.body.title || record.title;
    record.content = req.body.content || record.content;

    if (req.file) {
      // Handle file upload
      const oldImagePath = path.join(__dirname, record.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Delete old image
      }
      record.image = `/uploads/${req.file.filename}`; // Save new image path
    }

    saveRecordsToFile();
    res.json(record);
  } else {
    res.status(404).json({ message: "Record not found" });
  }
});

// Delete a record
app.delete("/api/records/:id", (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const recordIndex = records.findIndex((r) => r.id === recordId);

  if (recordIndex !== -1) {
    // Delete image if exists
    const record = records[recordIndex];
    const imagePath = path.join(__dirname, record.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    records.splice(recordIndex, 1);
    saveRecordsToFile();
    res.status(204).end();
  } else {
    res.status(404).json({ message: "Record not found" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
