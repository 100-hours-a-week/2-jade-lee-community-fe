import express from 'express';
import timeout from 'connect-timeout';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path, { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
import fs from 'fs';  // fs 모듈을 import로 추가
import multer from 'multer';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
const app = express();
const port = process.env.PORT || 3000;
const jsonFilePath = path.join(__dirname, 'public', 'json', 'users.json'); // 수정된 JSON 파일 경로 설정

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());  // JSON 형식 데이터를 파싱

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 업로드 폴더 설정
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일명에 타임스탬프 추가
    }
});

const upload = multer({ storage: storage });
app.post('/signup', upload.single('profileImage'), (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
        profileImage: req.file ? req.file.path : null // 업로드된 이미지 경로
    };

    // 기존 users.json 파일을 읽고 데이터 추가
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' }); 
        }
        let users = [];
        if (data) {
            try {
                users = JSON.parse(data); // 기존 사용자 데이터 읽기
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ error: '사용자 데이터 파싱 오류' });
            }
        }
        users.push(userData);
        // 데이터를 다시 파일에 저장
        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('파일을 저장하는 중 오류가 발생했습니다.', err);
                return res.status(500).json({ error: '파일을 저장하는 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '회원가입이 완료되었습니다.' });
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // users.json 파일에서 사용자 데이터 읽기
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' });
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data); // 기존 사용자 데이터 읽기
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ error: '사용자 데이터 파싱 오류' });
            }
        }

        // 사용자 이메일과 비밀번호 확인
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            // 로그인 성공
            res.status(200).json({ message: '로그인 성공' });
        } else {
            // 로그인 실패
            res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }
    });
});

// 미들웨어 설정
app.use(timeout('5s'));
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "img-src": ["'self'", "data:", "blob:"],
            "script-src": ["'self'", "'unsafe-inline'"],
        },
    },
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

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

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('서버에서 문제가 발생했습니다.');
});

// 서버 실행
app.listen(port, () => {
    console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
