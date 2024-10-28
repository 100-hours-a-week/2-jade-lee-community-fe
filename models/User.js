import db from '../controllers/db.js'; 

// User 모델
class User {
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM User';
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static create(userData) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO User (name, email) VALUES (?, ?)'; // 예시 필드
            db.query(sql, [userData.name, userData.email], (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            });
        });
    }

    // 다른 CRUD 메서드도 추가
}

export default User;
