const handleError = (res, error) => {
    if (!error.statusCode && error.code !== 'P2002') {
        console.error('ERROR LOG:', error)
    }

    // P2002: Unique constraint failed
    if (error.code === 'P2002') {
        // Lấy tên trường bị trùng
        const target = error.meta?.target || 'dữ liệu'
        return res.status(409).json({
            success: false,
            message: `Đã tồn tại ${target} này trong hệ thống`,
        })
    }

    // P2025: Record not found (Tìm ID để update/delete nhưng không thấy)
    if (error.code === 'P2025') {
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy dữ liệu yêu cầu',
        })
    }

    // Nếu error object có statusCode đi kèm
    if (error.statusCode) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        })
    }

    // 4. XỬ LÝ LỖI DỰA TRÊN MESSAGE
    if (error.message.startsWith('Conflict'))
        return res.status(409).json({ success: false, message: error.message })
    if (error.message.startsWith('Unauthorized'))
        return res.status(401).json({ success: false, message: error.message })
    if (error.message.startsWith('Forbidden'))
        return res.status(403).json({ success: false, message: error.message })
    if (error.message.startsWith('Not Found'))
        return res.status(404).json({ success: false, message: error.message })

    return res.status(500).json({
        success: false,
        message: error.message || 'nternal Server Error',
    })
}

module.exports = handleError
