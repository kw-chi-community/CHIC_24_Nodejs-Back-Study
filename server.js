const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const app = express();
const PORT = 3000;

// 파일 업로드를 위한 multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 파일이 저장될 경로 설정
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // 파일 이름 설정
  }
});

const upload = multer({ storage: storage }); // multer 설정

// Body parser 미들웨어 설정
app.use(express.json()); // JSON 형식의 요청 바디를 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 형식의 요청 바디를 파싱

// 정적 파일 서빙 (CSS, 이미지, JS 등)
app.use(express.static(path.join(__dirname, "public"))); // public 폴더를 정적 파일로 서빙
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // 업로드된 파일을 서빙하는 라우트 설정

// 영화 회고록 데이터 샘플
let records = [];

// 파일에서 records 데이터를 불러옴
fs.readFile("records.json", (err, data) => {
  if (err) {
    if (err.code === 'ENOENT') {
      console.log("records.json 파일을 찾을 수 없어 새로 생성합니다.");
      records = [];
      saveRecordsToFile(); // 파일 생성
    } else {
      console.error("데이터 로드 중 오류 발생:", err);
      return;
    }
  } else {
    try {
      records = JSON.parse(data); // JSON 파싱
    } catch (parseErr) {
      console.error("JSON 파싱 중 오류 발생:", parseErr);
      records = [];
    }
  }
});

// records 데이터를 파일에 저장하는 함수
const saveRecordsToFile = () => {
  fs.writeFile("records.json", JSON.stringify(records, null, 2), (err) => {
    if (err) {
      console.error("데이터 저장 중 오류 발생:", err);
    }
  });
};

// 글쓰기 페이지 라우트
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "write.html")); // write.html의 정확한 경로 설정
});

// 마이페이지 라우트
app.get("/mypage", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "mypage.html")); // mypage.html의 정확한 경로 설정
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
app.post("/api/records", upload.single("photo"), (req, res) => {
  const { title, content, rating } = req.body; // write.html에서 전송된 텍스트 데이터
  if (!title || !rating) {
    return res.status(400).json({ message: "제목과 별점은 필수 항목입니다." });
  }

  const photoPath = req.file ? `/uploads/${req.file.filename}` : "default.jpg"; // 업로드된 이미지 파일 경로

  const newRecord = {
    id: records.length + 1, // 새로운 ID 설정
    title,
    content,
    rating,
    image: photoPath, // 이미지 경로 설정
  };

  records.push(newRecord); // records 배열에 추가
  saveRecordsToFile(); // 파일에 저장
  res.status(201).json(newRecord); // 201 상태코드와 함께 새로 추가된 record를 응답
});

// record를 수정하는 라우트
app.put("/api/records/:id", upload.single("image"), (req, res) => {
  const recordId = parseInt(req.params.id, 10);
  const record = records.find((r) => r.id === recordId);

  if (record) {
    record.title = req.body.title || record.title; // 제목 수정
    record.content = req.body.content || record.content; // 본문 내용 수정

    if (req.file) {
      const oldImagePath = path.join(__dirname, record.image);
      if (fs.existsSync(oldImagePath)) {
        try {
          fs.unlinkSync(oldImagePath); // 기존 이미지 삭제
        } catch (err) {
          console.error("이미지 삭제 중 오류 발생:", err);
        }
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
    const record = records[recordIndex];
    const imagePath = path.join(__dirname, record.image);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath); // 이미지 삭제
      } catch (err) {
        console.error("이미지 삭제 중 오류 발생:", err);
      }
    }

    records.splice(recordIndex, 1); // records 배열에서 삭제
    saveRecordsToFile(); // 파일에 저장
    res.status(204).send(); // 204 상태코드로 응답 (No Content)
  } else {
    res.status(404).json({ message: "Record not found" }); // 기록이 없을 경우 404 에러 응답
  }
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`파일 업로드 경로: ${path.join(__dirname, 'uploads')}`);
});
