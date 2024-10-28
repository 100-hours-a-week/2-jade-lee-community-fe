import express from 'express';
import { getBoards, createBoard } from '../controllers/boardController.js';

const router = express.Router();

// GET 요청: 모든 게시글 가져오기
router.get('/boards', getBoards);

// POST 요청: 새로운 게시글 생성하기
router.post('/boards', createBoard);

export default router;
