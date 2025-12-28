const userService = require('../services/userService')
const handleError = require('../utils/handleError')

const userController = {
    getUserProfile: async (req, res) => {
        try {
            const userId = req.user.id
            const userProfile = await userService.getProfile(userId)
            return res.status(200).json({
                message: 'Lấy thông tin người dùng thành công',
                data: userProfile,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    editUserProfile: async (req, res) => {
        try {
            const userId = req.user.id
            const profileData = req.body
            const updatedProfile = await userService.editProfile(userId, profileData)
            return res.status(200).json({
                message: 'Cập nhật thông tin người dùng thành công',
                data: updatedProfile,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getUserStatOverview: async (req, res) => {
        try {
            const userId = req.user.id
            const overview = await userService.statOverview(userId)
            return res.status(200).json({
                message: 'Lấy thông tin tổng quan người dùng thành công',
                data: overview,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getNextTrip: async (req, res) => {
        try {
            const userId = req.user.id
            const nextTrip = await userService.nextTrip(userId)
            return res.status(200).json({
                message: 'Lấy chuyến đi tiếp theo thành công',
                data: nextTrip,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getBookingHistory: async (req, res) => {
        try {
            const userId = req.user.id
            const bookingHistory = await userService.bookingHistory(userId)
            return res.status(200).json({
                message: 'Lấy lịch sử đặt chỗ thành công',
                data: bookingHistory,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getAllUsers()
            return res.status(200).json({
                message: 'Lấy danh sách người dùng thành công',
                data: users,
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

module.exports = userController;