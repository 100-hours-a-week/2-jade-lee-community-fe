import db from '../controllers/db.js';

// Board 모델
class Board {
    static findAll() {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Board';
            db.query(sql, (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static create(boardData) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Board (title, content, userId) VALUES (?, ?, ?)'; // 예시 필드
            db.query(sql, [boardData.title, boardData.content, boardData.userId], (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            });
        });
    }

    // 다른 CRUD 메서드도 추가
}

export default Board;
