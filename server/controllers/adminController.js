const Admin = require('../models/adminModel');
const Manager = require('../models/managerModel');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
exports.createAdmin = async (req, res) => {
    try {
        const { login, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ login, password: hashedPassword, name });
        await admin.save();
        res.json(admin);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.createManager = async (req, res) => {
    try {
        const { admin_id, role } = req.user;
        const { login, password, name } = req.body;
        if (role !== 'admin') {
            return res.status(403).json({ message: "Sizning huquqlaringiz cheklangan" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const manager = new Manager({ admin_id, login, password: hashedPassword, name });
        await manager.save();
        res.json(manager);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { admin_id, role } = req.user;
        const { login, password, name, start_time, end_time } = req.body;
        if (role === 'user') {
            return res.status(403).json({ message: "Sizning huquqlaringiz cheklangan" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ admin_id, login, password: hashedPassword, name, start_time, end_time });
        await user.save();
        res.json(user);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}