import express from 'express';
import { getComments, createComment } from '../controllers/commentController.js';

const router = express.Router();

// GET 요청: 특정 게시글의 댓글 가져오기
router.get('/boards/:boardId/comments', getComments);

// POST 요청: 새로운 댓글 생성하기
router.post('/comments', createComment);

export default router;
