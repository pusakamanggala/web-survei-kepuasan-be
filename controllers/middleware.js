const config = require('../connection/mysql_connection');
const mysql = require('mysql2');
const pool = mysql.createPool(config);
const lib = require('./lib')

pool.on('error', (err) => {
    console.log(err)
});

module.exports = {
    isAdmin(req, res, next) {
        const token = req.headers["cookie"].split('=')[1]

        if (!token) {
            return res.status(401).send('no cookie provided');
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const now = lib.getCurrentUnixTimeStamp()
            const query = `SELECT * FROM admin_session WHERE id_admin_session = ? AND ${now} < expired_at`
            connection.query(query, [token], function (err, result) {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                };

                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                }

                next('route')
            })

            connection.release();
        })
    },

    isStudent(req, res, next) {
        const token = req.headers["cookie"].split('=')[1]

        if (!token) {
            return res.status(401).send('no cookie provided');
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const now = lib.getCurrentUnixTimeStamp()
            const query = `SELECT * FROM mahasiswa_session WHERE id_mahasiswa_session = ? AND ${now} < expired_at`
            connection.query(query, [token], function (err, result) {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                };
                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                }

                next('route')
            })

            connection.release();
        })
    },

    isAlumni(req, res, next) {
        const token = req.headers["cookie"].split('=')[1]

        if (!token) {
            return res.status(401).send('no cookie provided');
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const now = lib.getCurrentUnixTimeStamp()
            const query = `SELECT * FROM alumni_session WHERE id_alumni_session = ? AND ${now} < expired_at`
            connection.query(query, [token], function (err, result) {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                };

                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                }

                next('route')
            })

            connection.release();
        })
    },

    isDosen(req, res, next) {
        const token = req.headers["cookie"].split('=')[1]

        if (!token) {
            return res.status(401).send('no cookie provided');
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const now = lib.getCurrentUnixTimeStamp()
            const query = `SELECT * FROM dosen_session WHERE id_dosen_session = ? AND ${now} < expired_at`
            connection.query(query, [token], function (err, result) {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                };

                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "unauthorized access"
                    })
                }

                next('route')
            })

            connection.release();
        })
    }
}