const config = require('../connection/mysql_connection');
const mysql = require('mysql2');
const pool = mysql.createPool(config);
const lib = require('./lib')

pool.on('error', (err) => {
    console.log(err)
});

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = "ASC"
const DEFAULT_ORDER = "nim"

module.exports = {
    getDosenById(req, res) {
        // read path id
        const id = req.params.id

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'SELECT nama, nip FROM dosen WHERE nip = ?';
            connection.query(query, [id], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record with that id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result[0]
                })
            })

            connection.release();
        })
    },

    getAllDosen(req, res) {
        let limit = req.query.limit
        let page = req.query.page

        if (limit === undefined) {
            limit = DEFAULT_LIMIT
        }

        if (page === undefined) {
            page = DEFAULT_PAGE
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let totalRecords = 0
            connection.query("select count(*) from dosen", function (err, res) {
                totalRecords = parseInt(res[0]["count(*)"])
            })

            const query = 'SELECT nama, nip FROM dosen';
            const queryWithPaging = `${query} ${lib.getPaging(limit, page)}`
            connection.query(queryWithPaging, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result,
                    totalRecords: totalRecords,
                    totalPage: Math.ceil(totalRecords / limit)
                })
            })

            connection.release();
        })
    },

    getDosenWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = "SELECT nama, nip FROM dosen where nama LIKE ?"
            connection.query(query, [queryPayload], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record with that query'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result
                })
            })

            connection.release();
        })
    },

    newDosen(req, res) {
        let { nama, nip, password, telepon } = req.body

        const hashedPassword = lib.hashPassword(password)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'INSERT INTO dosen (nama, nip, password, telepon) VALUES (?, ?, ?, ?)';
            connection.query(query, [nama, nip, hashedPassword, telepon], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                    data: {
                        nama: nama,
                        nip: nip,
                        telepon: telepon
                    }
                })
            })

            connection.release();
        })
    },

    getMahasiswaById(req, res) {
        // read path id
        const id = req.params.id

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'SELECT nama, nim, angkatan, status FROM mahasiswa WHERE nim = ? ';
            connection.query(query, [id], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record with that id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result[0]
                })
            })

            connection.release();
        })
    },

    getAllMahasiswa(req, res) {
        let sortBy = req.query.sortBy
        let orderBy = req.query.orderBy
        let limit = req.query.limit
        let page = req.query.page

        if (sortBy === undefined) {
            sortBy = DEFAULT_SORT
        }

        if (orderBy === undefined) {
            orderBy = DEFAULT_ORDER
        }

        if (limit === undefined) {
            limit = DEFAULT_LIMIT
        }

        if (page === undefined) {
            page = DEFAULT_PAGE
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let totalRecords = 0
            connection.query("select count(*) from mahasiswa", function (err, res) {
                totalRecords = parseInt(res[0]["count(*)"])
            })

            const query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status", orderBy, sortBy, `WHERE status = "AKTIF"`, lib.getPaging(limit, page))
            connection.query(query, [orderBy, sortBy], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result,
                    totalRecords: totalRecords,
                    totalPage: Math.ceil(totalRecords / limit)
                })
            })

            connection.release();
        })
    },

    getMahasiswaWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'SELECT nama, nim, angkatan, status FROM mahasiswa WHERE nama LIKE ? AND status = "AKTIF"';
            connection.query(query, [queryPayload], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record with that query'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result
                })
            })

            connection.release();
        })
    },

    newMahasiswa(req, res) {
        let { nama, nim, angkatan, password, telepon } = req.body

        const hashedPassword = lib.hashPassword(password)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'INSERT INTO mahasiswa (nama, nim, angkatan, password, telepon) VALUES (?, ?, ?, ?, ?)';
            connection.query(query, [nama, nim, angkatan, hashedPassword, telepon], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                    data: {
                        nama: nama,
                        nim: nim,
                        angkatan: angkatan,
                        telepon: telepon
                    }
                })
            })

            connection.release();
        })
    },

    newAlumni(req, res) {
        let { nim, tahunKelulusan } = req.body

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'UPDATE mahasiswa set status = "ALUMNI", tahun_kelulusan = ? where nim = ?';
            connection.query(query, [tahunKelulusan, nim], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been updated successfully',
                    data: {
                        nim: nim,
                        tahunKelulusan: tahunKelulusan
                    }
                })
            })

            connection.release();
        })
    },

    getAllAlumni(req, res) {
        let sortBy = req.query.sortBy
        let orderBy = req.query.orderBy
        let limit = req.query.limit
        let page = req.query.page

        if (limit === undefined) {
            limit = DEFAULT_LIMIT
        }

        if (page === undefined) {
            page = DEFAULT_PAGE
        }

        if (sortBy === undefined) {
            sortBy = DEFAULT_SORT
        }

        if (orderBy === undefined) {
            orderBy = DEFAULT_ORDER
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, tahun_kelulusan", orderBy, sortBy, `WHERE status = "ALUMNI"`, lib.getPaging(limit, page))
            connection.query(query, [orderBy, sortBy], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record'
                    })
                }


                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: result
                })
            })

            connection.release();
        })
    },
}