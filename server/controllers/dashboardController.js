const Order = require("../models/orderModel");
const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Product = require("../models/productModel");

const dashboardController = {
  getDailyRevenue: async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: "Cần cung cấp cả startDate và endDate",
        });
      }

      const parsedStartDate = new Date(startDate);
      const parsedEndDate = new Date(endDate);

      if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
        return res.status(400).json({
          success: false,
          message: "Ngày bắt đầu và ngày kết thúc không hợp lệ",
        });
      }

      parsedEndDate.setHours(23, 59, 59, 999);

      const dailyRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: parsedStartDate, $lte: parsedEndDate },
            orderStatus: "Hoàn thành",
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const formattedDailyRevenue = dailyRevenue.map((item) => {
        const [year, month, day] = item._id.split("-");
        return {
          date: `${day}/${month}`,
          totalRevenue: item.totalRevenue,
        };
      });

      res.json({
        success: true,
        dailyRevenue: formattedDailyRevenue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi thống kê doanh thu theo ngày",
        error: error.message,
      });
    }
  },
  getMonthlyRevenue: async (req, res) => {
    try {
        const { startMonth, endMonth } = req.query;
        
        if (!startMonth || !endMonth) {
            return res.status(400).json({
                success: false,
                message: "Cần cung cấp cả startMonth và endMonth",
            });
        }

        const parsedStartMonth = new Date(startMonth);
        const parsedEndMonth = new Date(endMonth);
        if (isNaN(parsedStartMonth) || isNaN(parsedEndMonth)) {
            return res.status(400).json({
                success: false,
                message: "Ngày bắt đầu và ngày kết thúc không hợp lệ",
            });
        }
        
        parsedEndMonth.setHours(23, 59, 59, 999);

        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: parsedStartMonth, $lte: parsedEndMonth },
                    orderStatus: "Hoàn thành",
                },
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    totalRevenue: { $sum: "$totalPrice" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        const formattedMonthlyRevenue = monthlyRevenue.map((item) => ({
            date:  item._id.month+ '/' +item._id.year,
            totalRevenue: item.totalRevenue,
        }));

        res.json({
            success: true,
            monthlyRevenue: formattedMonthlyRevenue,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lỗi khi thống kê doanh thu theo tháng",
            error: error.message,
        });
    }
},
getQuarterlyRevenue: async (req, res) => {
  try {
      const { startQuarter, endQuarter } = req.query;
      
      if (!startQuarter || !endQuarter) {
          return res.status(400).json({
              success: false,
              message: "Cần cung cấp cả startQuarter và endQuarter",
          });
      }

      const parsedStartQuarter = new Date(startQuarter);
      const parsedEndQuarter = new Date(endQuarter);

      if (isNaN(parsedStartQuarter) || isNaN(parsedEndQuarter)) {
          return res.status(400).json({
              success: false,
              message: "Ngày bắt đầu và ngày kết thúc không hợp lệ",
          });
      }

      parsedEndQuarter.setHours(23, 59, 59, 999);

      const quarterlyRevenue = await Order.aggregate([
          {
              $match: {
                  createdAt: { $gte: parsedStartQuarter, $lte: parsedEndQuarter },
                  orderStatus: "Hoàn thành",
              },
          },
          {
              $addFields: {
                  quarter: {
                      $ceil: { $divide: [{ $month: "$createdAt" }, 3] }
                  }
              }
          },
          {
              $group: {
                  _id: { year: { $year: "$createdAt" }, quarter: "$quarter" },
                  totalRevenue: { $sum: "$totalPrice" },
              },
          },
          { $sort: { "_id.year": 1, "_id.quarter": 1 } },
      ]);

      const formattedQuarterlyRevenue = quarterlyRevenue.map((item) => ({
          date: `Q${item._id.quarter}/${item._id.year}`,
          totalRevenue: item.totalRevenue,
      }));

      res.json({
          success: true,
          quarterlyRevenue: formattedQuarterlyRevenue,
      });
  } catch (error) {
      res.status(500).json({
          success: false,
          message: "Lỗi khi thống kê doanh thu theo quý",
          error: error.message,
      });
  }
},
  // getMonthlyRevenue: async (req, res) => {
  //   try {
  //     const { month, year } = req.query;
  
  //     if (!month || !year) {
  //       return res.status(400).json({
  //         success: false,
  //         message: "Cần cung cấp cả month và year",
  //       });
  //     }
  
  //     const startOfMonth = new Date(year, month - 1, 1);
  //     const endOfMonth = new Date(year, month, 0);
  //     endOfMonth.setHours(23, 59, 59, 999); 
  
  //     const dailyRevenue = await Order.aggregate([
  //       {
  //         $match: {
  //           createdAt: { $gte: startOfMonth, $lte: endOfMonth },
  //           orderStatus: "Hoàn thành",
  //         },
  //       },
  //       {
  //         $group: {
  //           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
  //           totalRevenue: { $sum: "$totalPrice" },
  //         },
  //       },
  //       { $sort: { _id: 1 } },
  //     ]);
  
  //     const formattedDailyRevenue = dailyRevenue.map((item) => {
  //       const [year, month, day] = item._id.split("-");
  //       return {
  //         date: `${day}`, 
  //         totalRevenue: item.totalRevenue,
  //       };
  //     });
  
  //     res.json({
  //       success: true,
  //       monthlyRevenue: formattedDailyRevenue,
  //       month,
  //       year,
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       message: "Lỗi khi thống kê doanh thu theo tháng",
  //       error: error.message,
  //     });
  //   }
  // },
  getYearlyRevenue: async (req, res) => {
    try {
      const { year } = req.query;

      if (!year) {
        return res.status(400).json({
          success: false,
          message: "Cần cung cấp year",
        });
      }

      const startOfYear = new Date(year, 0, 1); 
      const endOfYear = new Date(year, 11, 31, 23, 59, 59);

      const yearlyRevenue = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfYear, $lte: endOfYear },
            orderStatus: "Hoàn thành",
          },
        },
        {
          $group: {
            _id: { $month: "$createdAt" }, 
            totalRevenue: { $sum: "$totalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const monthRevenue = yearlyRevenue.find(
          (revenue) => revenue._id === i + 1
        );
        return {
          month: i + 1,
          totalRevenue: monthRevenue ? monthRevenue.totalRevenue : 0,
        };
      });

      res.json({
        year,
        monthlyRevenue,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi thống kê doanh thu theo năm",
        error: error.message,
      });
    }
  },
  getDashboardStats: async (req, res) => {
    try {
      const userCount = await User.countDocuments({ role: "user" });

      const pendingOrderCount = await Order.countDocuments({
        orderStatus: "Chờ xác nhận",
      });

      const recentOrders = await Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId")
        .lean();

      const productCount = await Product.countDocuments();

      const blogCount = await Blog.countDocuments();

      res.json({
        productCount,
        blogCount,
        userCount,
        pendingOrderCount,
        recentOrders,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  },
};

module.exports = dashboardController;
