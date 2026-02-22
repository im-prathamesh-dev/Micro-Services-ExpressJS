const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklisttokenModel = require('../models/blacklisttoken.model');
module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new userModel({ name, email, password: hashedPassword });
            await newUser.save();
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true });
            res.status(201).json({ message: 'User registered successfully', token });
            
        }   
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });    
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: 'Login successful', token });   
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const blacklistedToken = new blacklisttokenModel({ token });
        await blacklistedToken.save();
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' }); 
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getProfile = async (req, res) => {
    try {
        res.send(req.user);
    }
    catch (error) {
        res.status(500).json({ message:error.message });
    }

};