const prisma = require('../configs/db')

const ticketService = {
    createTicket: async (payload) => {
        return await prisma.ticket.create(payload)
    },
}

module.exports = ticketService
