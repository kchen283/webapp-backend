import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create a new user
        user = new User({
            email,
            password: hashedPassword
        });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found:', email); // Add this
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Passwords did not match for:', email); // Add this
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('success');
        res.status(200);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
