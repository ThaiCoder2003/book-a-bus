import type { SeatType } from '@/types/enum'
import { format } from 'date-fns'

const convertAction = {
    convertTime: (isoString?: string | null) => {
        if (!isoString) return { time: '--:--', day: '' }

        const date = new Date(isoString)
        const day = format(date, 'dd-MM-yyyy')
        const time = format(date, 'HH:mm')

        return { day, time }
    },

    parseDuration: (totalMinutes: number) => {
        if (totalMinutes <= 0) {
            return { hours: 0, minutes: 0 }
        }

        const hours = Math.floor(totalMinutes / 60) // Lấy phần nguyên (giờ)
        const minutes = totalMinutes % 60 // Lấy phần dư (phút)

        return { hours, minutes }
    },

    mappingBusType: (busType?: SeatType | null) => {
        switch (busType) {
            case 'SEAT':
                return 'Ghế ngồi'
            case 'VIP':
                return 'Ghế ngồi VIP'
            case 'DOUBLE_BED':
                return 'Giường đôi'
            case 'SINGLE_BED':
                return 'Giường đơn'
            default:
                return ''
        }
    },

    formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}
}

export default convertAction
