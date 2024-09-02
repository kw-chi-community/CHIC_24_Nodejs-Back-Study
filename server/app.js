// server/app.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// 정적 파일 제공 위치 설정
app.use(express.static(path.join(__dirname, '../'))); // 프로젝트 최상위 폴더를 정적 파일 제공 경로로 설정

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html')); // index.html의 정확한 경로 설정
});

// 마이페이지 라우트
app.get('/mypage', (req, res) => {
    res.sendFile(path.join(__dirname, '../mypage.html')); // mypage.html의 정확한 경로 설정
});

// 서버 실행
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
