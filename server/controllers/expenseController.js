const Expense = require('../models/expenseModel');


exports.getExpense = async (req, res) => {
    try {

        const { admin_id } = req.user
        const expenses = await Expense.find({ admin_id });
        res.json(expenses);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}


exports.createExpense = async (req, res) => {
    try {
        const { admin_id } = req.user
        req.body.admin_id = admin_id
        const expense = new Expense(req.body);
        await expense.save();
        res.json({ message: "Xarajat qo'shildi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndUpdate(id, req.body, { new: true });
        if (!expense) return res.status(404).json({ message: "Xarajat topilmadi" });
        res.json({ message: "Xarajat tahrirlandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}


exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const expense = await Expense.findByIdAndDelete(id);
        if (!expense) return res.status(404).json({ message: "Xarajat topilmadi" });
        res.json({ message: "Xarajat o'chirildi" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}