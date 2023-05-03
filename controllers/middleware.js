const lib = require('./lib')
const jwt = require('jsonwebtoken');

const checkUserRole = (requiredRoles) => {
    return (req, res, next) => {
        // read cookie
        const token = req.headers["cookie"].split('=')[1]

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access"
                })
            }

            const role = user.role

            if (!requiredRoles.includes(role)) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized Access"
                })
            }

            next()
        });
    };
};

module.exports = checkUserRole;