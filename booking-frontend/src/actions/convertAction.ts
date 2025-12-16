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

    mappingBusType: (busType?: SeatType | null) => {
        switch (busType) {
            case 'SEAT':
                return 'Ghế ngồi'
            case 'DOUBLE_BED':
                return 'Giường đôi'
            case 'SINGLE_BED':
                return 'Giường đơn'
            default:
                return ''
        }
    },
}

export default convertAction
