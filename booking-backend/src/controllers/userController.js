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

    getUserById: async (req, res) => {
        try {
            const { id } = req.params
            const userProfile = await userService.getProfile(id)
            return res.status(200).json({
                message: 'Lấy thông tin người dùng thành công',
                ...userProfile,
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
            const { query, page, limit } = req.query;
            
            const users = await userService.getAllUsers(
                query, 
                Number(page) || 1,  // Chuyển "1" thành 1
                Number(limit) || 10
            )
            return res.status(200).json(users)
        } catch (error) {
            handleError(res, error)
        }
    },

    editUserProfileAsAdmin: async (req, res) => {
        try {
            const { id } = req.params
            const profileData = req.body
            const updatedProfile = await userService.editProfile(id, profileData)
            return res.status(200).json({
                message: 'Cập nhật thông tin người dùng thành công',
                user: updatedProfile,
            })
        } catch (error) {
            handleError(res, error)
        }
    },

    resetPassword: async (req, res) => {
        try {
            const { id } = req.params
            const { password } = req.body
            const updatedProfile = await userService.resetPassword(id, password)
            return res.status(200).json({
                message: 'Cập nhật thông tin người dùng thành công',
                data: updatedProfile,
            })
        } catch (error) {
            handleError(res, error)
        }
    }
}

module.exports = userController;