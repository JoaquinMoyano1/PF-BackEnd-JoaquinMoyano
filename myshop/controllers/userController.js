const UserDTO = require('../dtos/userDTO');

exports.currentUser = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userDTO = new UserDTO(req.user);
    res.json({ user: userDTO });
};
