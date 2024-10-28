import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
    const { boardId } = req.params; // URL 파라미터에서 boardId 가져오기
    try {
        const comments = await Comment.findAll(boardId);
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).send('Error fetching comments');
    }
};

export const createComment = async (req, res) => {
    try {
        const commentId = await Comment.create(req.body);
        res.status(201).json({ id: commentId });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).send('Error creating comment');
    }
};
