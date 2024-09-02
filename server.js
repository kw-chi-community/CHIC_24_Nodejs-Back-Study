const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

// 파일 업로드를 위한 multer 설정
const upload = multer({ dest: 'uploads/' }); // 업로드된 파일을 저장할 폴더 지정

// Body parser 미들웨어 설정
app.use(bodyParser.json()); // JSON 형식의 요청 바디를 파싱
app.use(bodyParser.urlencoded({ extended: true })); // URL-encoded 형식의 요청 바디를 파싱

// 정적 파일 서빙 (CSS, 이미지, JS 등)
app.use(express.static(path.join(__dirname, "public"))); // public 폴더에 있는 파일들을 정적 파일로 서빙
app.use('/uploads', express.static('uploads')); // 업로드된 파일을 서빙하는 라우트 설정

// 영화 회고록 데이터 샘플
let records = [];

// 파일에서 records 데이터를 불러옴
fs.readFile('records.json', (err, data) => {
  if (err) {
    console.error("데이터 로드 중 오류 발생:", err);
    records = []; // 오류가 발생하면 빈 배열로 초기화
  } else {
    records = JSON.parse(data); // 파일에서 데이터를 읽어와서 JSON으로 파싱
    console.log("초기 records 데이터:", records);
  }
});

// records 데이터를 파일에 저장하는 함수
const saveRecordsToFile = () => {
  fs.writeFile('records.json', JSON.stringify(records, null, 2), (err) => {
    if (err) {
      console.error("데이터 저장 중 오류 발생:", err);
    }
  });
};

// 홈 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "records.html")); // public 폴더의 records.html 파일을 응답으로 보냄
});

// 모든 records 데이터를 가져오는 라우트
app.get("/api/records", (req, res) => {
  res.json(records); // JSON 형식으로 records 데이터를 응답
});

// 특정 ID의 record를 가져오는 라우트
app.get("/api/records/:id", (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const record = records.find((r) => r.id === recordId);

  if (record) {
    res.json(record); // 해당 ID의 record를 JSON 형식으로 응답
  } else {
    res.status(404).json({ message: "Record not found" }); // 기록이 없을 경우 404 에러 응답
  }
});

// 새로운 record를 추가하는 라우트
app.post("/api/records", (req, res) => {
  const newRecord = {
    id: records.length + 1, // 새로운 ID 설정
    title: req.body.title, // 제목 설정
    image: req.body.image || "poster2.jpg", // 이미지 설정 (기본값으로 poster2.jpg 사용)
    content: req.body.content || "" // 본문 내용 설정
  };
  records.push(newRecord); // records 배열에 추가
  saveRecordsToFile(); // 파일에 저장
  res.status(201).json(newRecord); // 201 상태코드와 함께 새로 추가된 record를 응답
});

// record를 수정하는 라우트
app.put("/api/records/:id", upload.single('image'), (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const record = records.find((r) => r.id === recordId);

  if (record) {
    record.title = req.body.title || record.title; // 제목 수정
    record.content = req.body.content || record.content; // 본문 내용 수정

    if (req.file) {
      // 파일 업로드가 있는 경우
      const oldImagePath = path.join(__dirname, record.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // 기존 이미지 삭제
      }
      record.image = `/uploads/${req.file.filename}`; // 새 이미지 경로 저장
    }

    saveRecordsToFile(); // 파일에 저장
    res.json(record); // 수정된 record를 JSON 형식으로 응답
  } else {
    res.status(404).json({ message: "Record not found" }); // 기록이 없을 경우 404 에러 응답
  }
});

// record를 삭제하는 라우트
app.delete("/api/records/:id", (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const recordIndex = records.findIndex((r) => r.id === recordId);

  if (recordIndex !== -1) {
    // 이미지가 존재하면 삭제
    const record = records[recordIndex];
    const imagePath = path.join(__dirname, record.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    records.splice(recordIndex, 1); // records 배열에서 삭제
    saveRecordsToFile(); // 파일에 저장
    res.status(204).end(); // 204 상태코드로 응답 (No Content)
  } else {
    res.status(404).json({ message: "Record not found" }); // 기록이 없을 경우 404 에러 응답
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
