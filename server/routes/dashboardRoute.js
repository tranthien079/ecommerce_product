const express = require("express");

const { authMiddleWare, isAdmin } = require('../middlewares/authMiddleware');
const  dashboardController  = require("../controllers/dashboardController");
const router = express.Router();

router.get('/revenue/daily', authMiddleWare, isAdmin, dashboardController.getDailyRevenue);
router.get('/revenue/monthly', authMiddleWare, isAdmin, dashboardController.getMonthlyRevenue);
router.get('/revenue/yearly', authMiddleWare, isAdmin, dashboardController.getYearlyRevenue);
router.get('/revenue/quaterly', authMiddleWare, isAdmin, dashboardController.getQuarterlyRevenue);
router.get('/', authMiddleWare, isAdmin, dashboardController.getDashboardStats);

module.exports = router;