import Board from '../models/Board.js';

export const getBoards = async (req, res) => {
    try {
        const boards = await Board.findAll();
        res.status(200).json(boards);
    } catch (error) {
        console.error('Error fetching boards:', error);
        res.status(500).send('Error fetching boards');
    }
};

export const createBoard = async (req, res) => {
    try {
        const boardId = await Board.create(req.body);
        res.status(201).json({ id: boardId });
    } catch (error) {
        console.error('Error creating board:', error);
        res.status(500).send('Error creating board');
    }
};
