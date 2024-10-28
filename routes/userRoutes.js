import express from 'express';
import { getUsers, createUser } from '../controllers/userController.js';

const router = express.Router();

// GET 요청: 모든 사용자 가져오기
router.get('/users', getUsers);

// POST 요청: 새로운 사용자 생성하기
router.post('/users', createUser);

export default router;
