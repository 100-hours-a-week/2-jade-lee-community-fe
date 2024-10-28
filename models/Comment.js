import db from '../controllers/db.js';

// Comment 모델
class Comment {
    static findAll(boardId) {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM Comment WHERE boardId = ?';
            db.query(sql, [boardId], (error, results) => {
                if (error) return reject(error);
                resolve(results);
            });
        });
    }

    static create(commentData) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO Comment (content, userId, boardId) VALUES (?, ?, ?)'; // 예시 필드
            db.query(sql, [commentData.content, commentData.userId, commentData.boardId], (error, results) => {
                if (error) return reject(error);
                resolve(results.insertId);
            });
        });
    }

    // 다른 CRUD 메서드도 추가
}

export default Comment;
