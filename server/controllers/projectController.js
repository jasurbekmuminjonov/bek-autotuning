const { default: axios } = require('axios');
const Project = require('../models/projectModel');
const url = "https://cbu.uz/uz/arkhiv-kursov-valyut/json/";

const getUsdRate = async () => {
    try {
        const response = await axios.get(url);
        return Number(response.data[1].Rate);
    } catch (error) {
        console.error("USD kursini olishda xatolik:", error);
        throw new Error("USD kursini olishda muammo yuz berdi");
    }
};

exports.getProject = async (req, res) => {
    try {
        const { admin_id } = req.user
        const projects = await Project.find({ admin_id });
        res.json(projects);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.createProject = async (req, res) => {
    try {
        const { admin_id } = req.user;
        req.body.admin_id = admin_id;
        const { currency } = req.body;

        const usdRate = await getUsdRate();
        let totalAmountToPaid = 0;
        let totalSpendingAmount = 0;

        req.body.services_providing.forEach(service => {
            if (service.amount_to_paid.currency === "USD") {
                totalAmountToPaid += currency === "USD"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.amount * usdRate;
            } else if (service.amount_to_paid.currency === "UZS") {
                totalAmountToPaid += currency === "UZS"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.amount / usdRate;
            }
        });

        req.body.services_providing.forEach(service => {
            service.spendings.forEach(spending => {
                if (spending.amount.currency === "USD") {
                    totalSpendingAmount += currency === "USD"
                        ? spending.amount.amount
                        : spending.amount.amount * usdRate;
                } else if (spending.amount.currency === "UZS") {
                    totalSpendingAmount += currency === "UZS"
                        ? spending.amount.amount
                        : spending.amount.amount / usdRate;
                }
            });
        });

        // const firstService = req.body.services_providing.find(service => service.index === 1);
        // if (firstService) {
        //     firstService.status = "inprogress";
        //     firstService.started_time = new Date().toISOString();
        // }

        req.body.total_amount_to_paid = Math.round(totalAmountToPaid * 100) / 100;
        req.body.total_spending_amount = Math.round(totalSpendingAmount * 100) / 100;
        req.body.remained_amount_to_paid = Math.round(totalAmountToPaid * 100) / 100

        const project = new Project(req.body);
        await project.save();

        res.json(project);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};
exports.updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const editingProject = await Project.findById(id);
        const { currency } = editingProject;
        const usdRate = await getUsdRate();
        let totalAmountToPaid = 0;
        let totalAmountPaid = 0;
        let totalSpendingAmount = 0;

        editingProject.payment_log.forEach(payment => {
            if (payment.currency === "USD") {
                totalAmountPaid += currency === "USD"
                    ? payment.amount
                    : payment.amount * usdRate;
            } else if (payment.currency === "UZS") {
                totalAmountPaid += currency === "UZS"
                    ? payment.amount
                    : payment.amount / usdRate;
            }
        });
        req.body.services_providing.forEach(service => {
            if (service.amount_to_paid.currency === "USD") {
                totalAmountToPaid += currency === "USD"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.amount * usdRate;
            } else if (service.amount_to_paid.currency === "UZS") {
                totalAmountToPaid += currency === "UZS"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.amount / usdRate;
            }
        });

        req.body.services_providing.forEach(service => {
            service.spendings.forEach(spending => {
                if (spending.amount.currency === "USD") {
                    totalSpendingAmount += currency === "USD"
                        ? spending.amount.amount
                        : spending.amount.amount * usdRate;
                } else if (spending.amount.currency === "UZS") {
                    totalSpendingAmount += currency === "UZS"
                        ? spending.amount.amount
                        : spending.amount.amount / usdRate;
                }
            });
        });

        const firstService = req.body.services_providing.find(service => service.index === 1);
        if (firstService) {
            firstService.status = "inprogress";
            firstService.started_time = new Date().toISOString();
        }

        req.body.total_amount_to_paid = Math.round(totalAmountToPaid * 100) / 100;
        req.body.total_spending_amount = Math.round(totalSpendingAmount * 100) / 100;
        req.body.remained_amount_to_paid = Math.round((totalAmountToPaid - totalAmountPaid) * 100) / 100;

        const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

        res.json({ message: "Loyiha tahrirlandi", project: updatedProject });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.json({ message: "Mashina o'chirildi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}


exports.createPayment = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { amount, currency } = req.body
        const usdRate = await getUsdRate();
        const project = await Project.findById(project_id);
        const paymentAmount = project?.currency === "USD"
            ? (currency === "USD" ? amount : amount * usdRate)
            : (currency === "UZS" ? amount : amount / usdRate);
        if (project) {
            project.payment_log.push({
                amount: paymentAmount,
                currency: currency,
                paid_date: new Date().toISOString()
            });
            project.total_amount_paid += paymentAmount;
            project.remained_amount_to_paid = Math.round((project.total_amount_to_paid - project.total_amount_paid) * 100) / 100;
            await project.save();
        }


        res.json({ message: "To'lov qayd etildi" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.finishProject = async (req, res) => {
    try {
        const { project_id } = req.params;
        await Project.findByIdAndUpdate(project_id, {
            status: 'finished'
        }, { new: true });
        res.json({ message: "Mashina servisi to'liq tugatildi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getProjectByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const projects = await Project.find({
            'services_providing.user_id': user_id
        });

        const categorizedProjects = {
            pending_projects: [],
            inprogress_projects: [],
            finished_projects: [],
            approved_projects: [],
            rejected_projects: []
        };

        projects.forEach(project => {
            project.services_providing.forEach(service => {
                if (service.user_id.toString() === user_id) {
                    switch (service.status) {
                        case 'pending':
                            categorizedProjects.pending_projects.push(project._id);
                            break;
                        case 'inprogress':
                            categorizedProjects.inprogress_projects.push(project._id);
                            break;
                        case 'finished':
                            categorizedProjects.finished_projects.push(project._id);
                            break;
                        case 'approved':
                            categorizedProjects.approved_projects.push(project._id);
                            break;
                        case 'rejected':
                            categorizedProjects.rejected_projects.push(project._id);
                            break;
                    }
                }
            });
        });

        res.status(200).json(categorizedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllProjectByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const projects = await Project.find({
            'services_providing.user_id': user_id
        });
        res.json(projects);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}