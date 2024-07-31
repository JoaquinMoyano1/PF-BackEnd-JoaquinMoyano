const Ticket = require('../models/ticket');

class TicketService {
    async createTicket(data) {
        const ticket = new Ticket(data);
        return await ticket.save();
    }
    // Métodos adicionales según sea necesario
}

module.exports = new TicketService();
