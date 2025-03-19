const User = require('../models/userModel');
const Project = require('../models/projectModel');
exports.getUsers = async (req, res) => {
    try {
        const { admin_id } = req.user
        const users = await User.find({ admin_id });
        res.json(users);

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.getUser = async (req, res) => {
    try {
        const { user_id } = req.user
        const user = await User.findById(user_id);
        res.json(user);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
// exports.getBalance = async (req, res) => {
//     try {
//         const { user_id } = req.params;
//         const { admin_id } = req.user;

//         const user = await User.findById(user_id);
//         if (!user) {
//             return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
//         }

//         const allProjects = await Project.find({
//             admin_id,
//             "services_providing.user_id": user_id
//         });

//         const total_balance = allProjects.reduce((acc, project) => {
//             project.services_providing.forEach(service => {
//                 if (service.user_id.toString() === user_id.toString()) {
//                     if (service.user_salary_amount?.currency === 'USD') {
//                         acc.usd += service.user_salary_amount.amount || 0;
//                     } else if (service.user_salary_amount?.currency === 'UZS') {
//                         acc.uzs += service.user_salary_amount.amount || 0;
//                     }
//                 }
//             });
//             return acc;
//         }, { usd: 0, uzs: 0 });

//         res.json({ total_balance });
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({ message: "Serverda xatolik" });
//     }
// };
exports.getBalance = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { admin_id } = req.user;

        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
        }
        const allProjects = await Project.find({
            admin_id,
            "services_providing.user_id": user_id
        });
        const balance = {
            total_balance: 0,
            pending_balance: 0,
            inprogress_balance: 0,
            finished_balance: 0,
            approved_balance: 0,
            rejected_balance: 0
        };
        allProjects.forEach(project => {
            project.services_providing.forEach(service => {
                if (service.user_id.toString() === user_id.toString()) {
                    const amount = service.user_salary_amount?.amount || 0;

                    balance.total_balance += amount;

                    switch (service.status) {
                        case 'pending':
                            balance.pending_balance += amount;
                            break;
                        case 'inprogress':
                            balance.inprogress_balance += amount;
                            break;
                        case 'finished':
                            balance.finished_balance += amount;
                            break;
                        case 'approved':
                            balance.approved_balance += amount;
                            break;
                        case 'rejected':
                            balance.rejected_balance += amount;
                            break;
                    }
                }
            });
        });

        res.json(balance);
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};
exports.getProjectsByUser = async (req, res) => {
    try {
        const { user_id, admin_id } = req.user;
        const projects = await Project.find({
            admin_id,
            services_providing: {
                $elemMatch: { user_id }
            }
        });
        res.status(200).json({ success: true, projects });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Serverda xatolik" });
    }
};
exports.getProjectsForApprove = async (req, res) => {
    try {
        const { user_id, admin_id } = req.user;
        const projects = await Project.find({
            admin_id,
            services_providing: {
                $elemMatch: { user_id }
            }
        });
        const filteredProjects = projects.filter(project => {
            return project.services_providing.some((service, index, arr) => {
                if (service.user_id.toString() === user_id.toString()) {
                    if (service.index === 1) {
                        return false;
                    }
                    const prevService = arr.find(s => s.index === service.index - 1);
                    return prevService && prevService.status === 'finished' || prevService.status === 'rejected';
                }
                return false;
            });
        });
        res.status(200).json(filteredProjects);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};
exports.getProjectsForFinish = async (req, res) => {
    try {
        const { user_id, admin_id } = req.user;

        const projects = await Project.find({
            admin_id,
            services_providing: {
                $elemMatch: {
                    user_id,
                    status: 'inprogress'
                }
            }
        });

        res.status(200).json({ success: true, projects });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi" });
    }
};
// exports.getProjectsForStart = async (req, res) => {
//     try {
//         const { user_id, admin_id } = req.user;

//         const projects = await Project.find({
//             admin_id,
//             services_providing: {
//                 $elemMatch: {
//                     user_id,
//                     status: 'pending'
//                 }
//             }
//         });

//         res.status(200).json({ success: true, projects });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ success: false, message: "Serverda xatolik yuz berdi" });
//     }
// };


// exports.startProject = async (req, res) => {
//     try {
//         const { project_id } = req.params
//         const { user_id, admin_id } = req.user;
//         const project = await Project.findOne({
//             admin_id,
//             _id: project_id,
//             services_providing: {
//                 $elemMatch: {
//                     user_id,
//                     status: 'pending'
//                 }
//             }
//         });
//         if (!project) {
//             return res.status(404).json({ message: "Mashina topilmadi" });
//         }
//         project.services_providing.forEach(service => {
//             if (service.user_id.toString() === user_id.toString()) {
//                 service.status = 'inprogress';
//                 service.started_time = new Date().toISOString();
//             }
//         });
//         await project.save();
//         res.json({ message: "Mashina servisi boshlandi" });

//     } catch (err) {
//         console.log(err.message)
//         return res.status(500).json({ message: "Serverda xatolik" });
//     }
// }
exports.finishService = async (req, res) => {
    try {
        const { project_id } = req.params
        const { user_id, admin_id } = req.user;
        const project = await Project.findOne({
            admin_id,
            _id: project_id,
            services_providing: {
                $elemMatch: {
                    user_id,
                    status: 'inprogress'
                }
            }
        });
        if (!project) {
            return res.status(404).json({ message: "Mashina topilmadi" });
        }
        project.services_providing.forEach(service => {
            if (service.user_id.toString() === user_id.toString()) {
                service.status = 'finished';
                service.ended_time = new Date().toISOString();
            }
        });
        await project.save();
        res.json({ message: "Mashina servisi tugallandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
exports.approveService = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { user_id } = req.user;
        const project = await Project.findOne({
            _id: project_id,
            "services_providing.user_id": user_id
        });

        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }


        const user_service = project.services_providing.find(service => service.user_id.toString() === user_id.toString());
        const prev_service = project.services_providing.find(service => service.index === user_service.index - 1);
        console.log(prev_service);

        if (!prev_service) {
            return res.status(400).json({ message: "Qabul qilish uchun servis topilmadi" });
        }
        if (prev_service.status !== 'finished' && prev_service.status !== 'rejected') {
            return res.status(400).json({ message: "Qabul qilish uchun servisning holati 'tugatilgan' yoki 'rad etilgan' bo'lishi kerak" });
        }
        prev_service.status = 'approved';
        prev_service.approved_time = new Date().toISOString();
        const user = await User.findById(prev_service.user_id);
        user.balance += prev_service.user_salary_amount.amount;
        user_service.status = 'inprogress'
        user_service.started_time = new Date().toISOString();
        await project.save();
        await user.save();
        res.json({ message: "Servis muvaffaqiyatli qabul qilindi va sizning servisingiz 'jarayonda' holatiga o'tdi" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};
exports.rejectService = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { user_id } = req.user;

        const project = await Project.findOne({
            _id: project_id,
            "services_providing.user_id": user_id
        });

        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }


        const user_service = project.services_providing.find(service => service.user_id.toString() === user_id.toString());
        const prev_service = project.services_providing.find(service => service.index === user_service.index - 1);
        if (!prev_service) {
            return res.status(400).json({ message: "Rad etish uchun servis topilmadi" });
        }
        if (prev_service.status !== 'finished' || prev_service.status === 'rejected') {
            return res.status(400).json({ message: "Rad etish uchun servisning holati 'tugatilgan' bo'lishi kerak" });
        }
        prev_service.status = 'rejected';
        prev_service.rejected_time = new Date().toISOString();


        await project.save();
        res.json({ message: "Loyiha muvaffaqiyatli rad etildi" });

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};
exports.editUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const { password } = req.body;
        const user = await User.findById(user_id);
        if (password) {
            req.body.password = await bcrypt.hash(password, 10);
        }
        await User.findByIdAndUpdate(user_id, req.body, { new: true });
        res.json({ message: "Foydalanuvchi muvaffaqiyatli tahrirlandi" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}