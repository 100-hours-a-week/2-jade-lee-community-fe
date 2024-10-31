import express from 'express';
import timeout from 'connect-timeout';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import userRoutes from './routes/userRoutes.js';
import boardRoutes from './routes/boardRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import dotenv from 'dotenv';
import colors from 'colors';
import moment from 'moment';
import mysql from 'mysql2';
import path from 'path'; // 추가된 import
import { fileURLToPath } from 'url'; // 추가된 import
import { dirname } from 'path'; // 추가된 import

// 현재 모듈의 디렉토리 이름 정의
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // .env에서 포트를 가져오거나 기본값 3000 사용

// 정적 파일 서빙 설정
app.use(express.static(path.join(__dirname, 'public')));


// MySQL 연결 설정
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// 미들웨어 설정
app.use(timeout('5s')); 
app.use(express.json()); 
app.use(helmet()); 

// 속도 제한 설정
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 100, 
    message: '너무 많은 요청을 보내셨습니다. 잠시 후 다시 시도해 주세요.'
});
app.use(limiter); 

// SQL 쿼리 실행 및 콘솔 로깅 함수
function executeQuery(sql, params, res) {
    const startTime = moment();
    db.query(sql, params, (error, results) => {
        const endTime = moment();
        const duration = endTime.diff(startTime, 'milliseconds');
        const currentTime = startTime.format('YYYY-MM-DD HH:mm:ss');

        if (error) {
            console.error(`[${currentTime}] SQL Error:`.red, error);
            res.status(500).send('Database error');
        } else {
            console.log(`[${currentTime}]`.green + ` SQL Query:`.yellow, sql);
            console.log(`Execution time: ${duration} ms`.cyan);
            res.status(200).json(results);
        }
    });
}

// 라우트 설정
app.use('/api', userRoutes);
app.use('/api', boardRoutes); // Board 라우트 추가
app.use('/api', commentRoutes); // Comment 라우트 추가

// 로그인 페이지 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // 로그인 페이지 제공
});

// 회원가입 페이지 라우트 추가
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

// 회원가입 페이지 라우트 추가
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/boardList', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardList.html'));
});

app.get('/boardWrite', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardWrite.html'));
});

app.get('/boardDetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardDetail.html'));
});

app.get('/boardUpdate', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardUpdate.html'));
});

app.get('/myinfo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'myinfo.html'));
});

app.get('/changePassword', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'changePassword.html'));
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 실행 중입니다.`.cyan);
});
