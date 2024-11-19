import express from 'express';
import timeout from 'connect-timeout';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path, { dirname } from 'path'; 
import { fileURLToPath } from 'url'; 
import fs from 'fs';
import multer from 'multer';
import session from 'express-session'; // 세션 모듈 추가
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
const app = express();
const port = process.env.PORT || 3000;
const jsonFilePath = path.join(__dirname, 'public', 'json', 'users.json');

// 세션 설정
app.use(session({
    secret: 'your-secret-key',  // 세션 암호화 키
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000 }  // `secure: true`는 HTTPS에서만 작동하므로 개발 중에는 `false`로 설정
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// 파일 업로드 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 회원가입 처리
app.post('/signup', upload.single('profileImage'), (req, res) => {
    const userData = {
        email: req.body.email,
        password: req.body.password,
        nickname: req.body.nickname,
        profileImage: req.file ? req.file.path : null
    };

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' });
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ error: '사용자 데이터 파싱 오류' });
            }
        }

        users.push(userData);

        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('파일을 저장하는 중 오류가 발생했습니다.', err);
                return res.status(500).json({ error: '파일을 저장하는 중 오류가 발생했습니다.' });
            }
            res.status(200).json({ message: '회원가입이 완료되었습니다.' });
        });
    });
});

// 로그인 처리
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' });
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ error: '사용자 데이터 파싱 오류' });
            }
        }

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            req.session.user = user;  // 로그인 성공 시 세션에 사용자 정보 저장
            res.status(200).json({ message: '로그인 성공' });
        } else {
            res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
        }
    });
});

// 세션 정보를 이용해 로그인된 사용자 정보 확인
app.get('/profile', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });  // 로그인된 사용자 정보 반환
    } else {
        res.status(401).json({ error: '로그인하지 않았습니다.' });
    }
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
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'boardList.html'));  // Static HTML file
    } else {
        res.redirect('/login');  // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    }
});

app.get('/boardWrite', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'boardWrite.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/boardDetail', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardDetail.html'));
});

app.get('/boardUpdate', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'boardUpdate.html'));
});

app.get('/myinfo', (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, 'views', 'myinfo.html'));
    } else {
        res.redirect('/login');
    }
});

app.get('/myinfo-data', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user }); 
    } else {
        res.status(401).json({ error: '로그인하지 않았습니다.' });
    }
});
// 사용자 정보 업데이트 처리
app.post('/update-user', upload.single('profileImage'), (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: '로그인하지 않았습니다.' });
    }

    const updatedUserData = {
        email: req.body.email || req.session.user.email,
        nickname: req.body.nickname || req.session.user.nickname,
        password: req.session.user.password,
        profileImage: req.file ? req.file.path : req.session.user.profileImage 
    };

    // users.json 파일을 읽어와서 데이터 업데이트
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ error: '파일을 읽는 중 오류가 발생했습니다.' });
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ error: '사용자 데이터 파싱 오류' });
            }
        }

        // 해당 사용자를 찾아서 업데이트
        const userIndex = users.findIndex(user => user.email === req.session.user.email);
        if (userIndex === -1) {
            return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        users[userIndex] = updatedUserData; // 사용자 정보 업데이트

        // 업데이트된 데이터를 users.json에 저장
        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('파일을 저장하는 중 오류가 발생했습니다.', err);
                return res.status(500).json({ error: '파일을 저장하는 중 오류가 발생했습니다.' });
            }
            req.session.user = updatedUserData; // 세션의 사용자 정보도 업데이트
            res.status(200).json({ success:true, message: '사용자 정보가 성공적으로 업데이트되었습니다.' });
        });
    });
});

// 사용자 삭제 처리
app.delete('/delete-user', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: '로그인하지 않았습니다.' });
    }

    // users.json 파일을 읽어서 데이터 삭제
    fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('파일을 읽는 중 오류가 발생했습니다.', err);
            return res.status(500).json({ success: false, message: '파일을 읽는 중 오류가 발생했습니다.' });
        }

        let users = [];
        if (data) {
            try {
                users = JSON.parse(data);
            } catch (parseErr) {
                console.error('JSON 파싱 오류:', parseErr);
                return res.status(500).json({ success: false, message: '사용자 데이터 파싱 오류' });
            }
        }

        // 로그인한 사용자의 정보를 찾아 삭제
        const userIndex = users.findIndex(user => user.email === req.session.user.email);
        if (userIndex === -1) {
            return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
        }

        // 해당 사용자를 배열에서 제거
        users.splice(userIndex, 1);

        // 업데이트된 데이터를 users.json에 저장
        fs.writeFile(jsonFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('파일을 저장하는 중 오류가 발생했습니다.', err);
                return res.status(500).json({ success: false, message: '파일을 저장하는 중 오류가 발생했습니다.' });
            }

            // 세션에서 사용자 정보 제거
            req.session.destroy((err) => {
                if (err) {
                    console.error('세션 삭제 중 오류가 발생했습니다.', err);
                }
            });

            res.status(200).json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
        });
    });
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
