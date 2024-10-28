import User from '../models/User.js';

export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error fetching users');
    }
};

export const createUser = async (req, res) => {
    try {
        const userId = await User.create(req.body);
        res.status(201).json({ id: userId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
    }
};
