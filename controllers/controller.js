const config = require('../connection/mysql_connection');
const mysql = require('mysql2');
const pool = mysql.createPool(config);
const lib = require('./lib')
const excelToJson = require('convert-excel-to-json')

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

            const query = 'SELECT nama, nip, telepon FROM dosen WHERE nip = ?';
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

            const query = 'SELECT nama, nip, telepon FROM dosen';
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

    bulkInsertDosen(req, res) {
        if (req.file?.filename == null || req.file?.filename === undefined) {
            return res.status(400).json({
                succes: false,
                message: "no file"
            })
        }

        const filePath = "uploads/" + req.file.filename

        const excelData = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1
            },
            columnToKey: {
                "*": "{{columnHeader}}"
            }
        })

        const query = lib.generateBulkQueryDosen(excelData.Sheet1)
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                })
            })

            connection.release();
        })
    },

    bulkInsertAlumni(req, res) {
        if (req.file?.filename == null || req.file?.filename === undefined) {
            return res.status(400).json({
                succes: false,
                message: "no file"
            })
        }

        const filePath = "uploads/" + req.file.filename

        const excelData = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1
            },
            columnToKey: {
                "*": "{{columnHeader}}"
            }
        })

        const query = lib.generateBulkQueryAlumni(excelData.Sheet1)
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                })
            })

            connection.release();
        })
    },

    bulkInsertMahasiswa(req, res) {
        if (req.file?.filename == null || req.file?.filename === undefined) {
            return res.status(400).json({
                succes: false,
                message: "no file"
            })
        }

        const filePath = "uploads/" + req.file.filename

        const excelData = excelToJson({
            sourceFile: filePath,
            header: {
                rows: 1
            },
            columnToKey: {
                "*": "{{columnHeader}}"
            }
        })

        const query = lib.generateBulkQueryMahasiswa(excelData.Sheet1)
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
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

            const query = 'SELECT nama, nim, angkatan, status, telepon FROM mahasiswa WHERE nim = ? and status="AKTIF"';
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

    getAlumniById(req, res) {
        // read path id
        const id = req.params.id

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'SELECT nama, nim, angkatan, telepon FROM mahasiswa WHERE nim = ? and status="ALUMNI"';
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
        let angkatan = req.query.angkatan

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
            let query = ""

            if (angkatan !== undefined) {
                connection.query("select count(*) from mahasiswa WHERE status='aktif' AND angkatan = ?", [angkatan], function (err, res) {
                    totalRecords = parseInt(res[0]["count(*)"])
                })

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon", orderBy, sortBy, `WHERE status = "AKTIF" AND angkatan = ${angkatan}`, lib.getPaging(limit, page))
            } else {
                connection.query("select count(*) from mahasiswa WHERE status='aktif'", [angkatan], function (err, res) {
                    totalRecords = parseInt(res[0]["count(*)"])
                })

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon", orderBy, sortBy, `WHERE status = "AKTIF"`, lib.getPaging(limit, page))
            }

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
        let angkatan = req.query.angkatan

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

            let query = ""
            let totalRecords = 0

            if (angkatan !== undefined) {
                connection.query("select count(*) from mahasiswa WHERE status='alumni' AND angkatan = ?", [angkatan], function (err, res) {
                    totalRecords = parseInt(res[0]["count(*)"])
                })

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon", orderBy, sortBy, `WHERE status = "ALUMNI" AND angkatan = ${angkatan}`, lib.getPaging(limit, page))
            } else {
                connection.query("select count(*) from mahasiswa WHERE status='alumni'", [angkatan], function (err, res) {
                    totalRecords = parseInt(res[0]["count(*)"])
                })

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon", orderBy, sortBy, `WHERE status = "ALUMNI"`, lib.getPaging(limit, page))
            }

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

    newMatkul(req, res) {
        let { namaMataKuliah } = req.body
        const newId = lib.generateRandomString(20)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'INSERT INTO mata_kuliah (id_matkul, nama_matkul) VALUES (?, ?)';
            connection.query(query, [newId, namaMataKuliah], function (err, result) {
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
                        id: newId,
                        namaMataKuliah: namaMataKuliah
                    }
                })
            })

            connection.release();
        })
    },

    newKelas(req, res) {
        let { idDosen, idMatkul, namaKelas, endDate, namaDosen } = req.body
        const newId = lib.generateRandomString(20)
        const startDate = lib.getCurrentUnixTimeStamp()

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'INSERT INTO kelas (id_kelas, id_dosen, id_matkul, nama_kelas, start_date, end_date, nama_dosen) VALUES (?, ?, ?, ?, ?, ?, ?)';
            connection.query(query, [newId, idDosen, idMatkul, namaKelas, startDate, parseInt(endDate), namaDosen], function (err, result) {
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
                        idKelas: newId,
                        idMatkul: idMatkul,
                        idDosne: idDosen,
                        namaKelas: namaKelas,
                        startDate: startDate,
                        endDate: endDate,
                    }
                })
            })

            connection.release();
        })
    },

    addMahasiswaToKelas(req, res) {
        let { idKelas, idMahasiswa } = req.body
        const newId = lib.generateRandomString(20)

        const query = lib.generateBulkQueryAddMahasiswaToKelas(idKelas, idMahasiswa)
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
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
                        idKelas: idKelas,
                        idMahasiswa: idMahasiswa
                    }
                })
            })

            connection.release();
        })
    },

    getKelasWithId(req, res) {
        const id = req.params.id

        const query = "select kelas.id_kelas, kelas.nama_kelas, kelas.nama_dosen, kelas.start_date, kelas.end_date, mata_kuliah.id_matkul, mata_kuliah.nama_matkul, mahasiswa.nim, mahasiswa.nama FROM kelas JOIN mata_kuliah ON kelas.id_matkul = mata_kuliah.id_matkul JOIN kontrak_matkul ON kontrak_matkul.id_kelas = kelas.id_kelas JOIN mahasiswa ON mahasiswa.nim = kontrak_matkul.id_mahasiswa WHERE kelas.id_kelas = ?"

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, [id], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                    data: lib.parsingGetKelasQueryResult(result)
                })
            })

            connection.release();
        })

    },

    getKelasWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)

        const now = lib.getCurrentUnixTimeStamp()
        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = "SELECT id_kelas, nama_kelas, nama_dosen FROM kelas WHERE nama_kelas LIKE ? AND ? > start_date AND ? < end_date"
            connection.query(query, [queryPayload, now, now], function (err, result) {
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

    getAllKelas(req, res) {
        let limit = req.query.limit
        let page = req.query.page

        if (limit === undefined) {
            limit = DEFAULT_LIMIT
        }

        if (page === undefined) {
            page = DEFAULT_PAGE
        }

        const now = lib.getCurrentUnixTimeStamp()

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let totalRecords = 0
            connection.query("select count(*) from kelas", function (err, res) {
                totalRecords = parseInt(res[0]["count(*)"])
            })

            const query = 'SELECT id_kelas, nama_kelas, nama_dosen FROM kelas WHERE ? > start_date AND ? < end_date';
            const queryWithPaging = `${query} ${lib.getPaging(limit, page)}`
            connection.query(queryWithPaging, [now, now], function (err, result) {
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

    getMatkulWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = "SELECT id_matkul, nama_matkul FROM mata_kuliah where nama_matkul LIKE ?"
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

    getAlumniWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = "SELECT nama, nim FROM mahasiswa where nama LIKE ? and status = 'ALUMNI'"
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

    getTotalRecord(req, res) {
        const queryPayload = req.query.entity

        let queryDB
        switch (queryPayload) {
            case 'alumni':
                queryDB = `select count(*) from mahasiswa where status = 'ALUMNI'`
                break;
            case 'dosen':
                queryDB = `select count(*) from dosen where status = 'AKTIF'`
                break;
            default:
                queryDB = `select count(*) from mahasiswa where status = 'AKTIF'`
                break;
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let totalRecords = 0
            connection.query(queryDB, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };
                totalRecords = parseInt(result[0]['count(*)'])

                if (result.length === 0) {
                    return res.send({
                        success: true,
                        message: 'There is no record'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: totalRecords,
                })
            })

            connection.release();
        })
    },

    getSurvey(req, res) {
        const role = req.query.role
        const currentTimestamp = lib.getCurrentUnixTimeStamp()

        const query = lib.generateQueryForGetSurvey(role.toLowerCase(), currentTimestamp, currentTimestamp)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let options = []

            // get option
            connection.query("SELECT id_opsi, opsi from opsi_pertanyaan", function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                options = result
            })

            connection.query(query, function (err, result) {
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
                    data: {
                        opsi: options,
                        survei: lib.parsingSurveyResult(result, role.toLowerCase())
                    },
                })
            })

            connection.release();
        })
    },

    newSurveyQuestion(req, res) {
        let { payload } = req.body

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = lib.generateBulkQueryForNewQuestion(payload)
            connection.query(query, function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                return res.send({
                    success: true,
                    message: 'Your record has been saved successfully',
                    data: payload
                })
            })

            connection.release();
        })
    },

    newSurvey(req, res) {
        let { idTemplate, judulSurvei, detailSurvei, periode, startDate, endDate, role, idKelas } = req.body

        const newSurveyId = lib.generateRandomString(20)
        let query = ""
        switch (role.toLowerCase()) {
            case 'dosen':
                query = "INSERT INTO survei_dosen (id_survei_dosen, id_template, judul_survei, detail_survei, start_date, end_date, periode) VALUES (?, ?, ?, ?, ?, ?, ?)"

                pool.getConnection(function (err, connection) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        })
                    };

                    connection.query(query, [newSurveyId, idTemplate, judulSurvei, detailSurvei, startDate, endDate, periode], function (err, result) {
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
                                idSurvei: newSurveyId,
                                idTemplate: idTemplate,
                                judulSurvei: judulSurvei,
                                detailSurvei: detailSurvei,
                                periode: periode,
                                startDate: startDate,
                                endDate: endDate,
                                role: role
                            }
                        })
                    })
                })
                break;
            case 'mahasiswa':
                query = "INSERT INTO survei_mahasiswa (id_survei_mahasiswa, id_template, id_kelas, judul_survei, detail_survei, start_date, end_date, periode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
                pool.getConnection(function (err, connection) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        })
                    };

                    connection.query(query, [newSurveyId, idTemplate, idKelas, judulSurvei, detailSurvei, startDate, endDate, periode], function (err, result) {
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
                                idSurvei: newSurveyId,
                                idTemplate: idTemplate,
                                judulSurvei: judulSurvei,
                                detailSurvei: detailSurvei,
                                periode: periode,
                                startDate: startDate,
                                endDate: endDate,
                                idKelas: idKelas
                            }
                        })
                    })
                })
                break;
            case 'alumni':
                query = "INSERT INTO survei_alumni (id_survei_alumni, id_template, judul_survei, detail_survei, start_date, end_date, periode) VALUES (?, ?, ?, ?, ?, ?, ?)"
                pool.getConnection(function (err, connection) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: err
                        })
                    };

                    connection.query(query, [newSurveyId, idTemplate, judulSurvei, detailSurvei, startDate, endDate, periode], function (err, result) {
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
                                idSurvei: newSurveyId,
                                idTemplate: idTemplate,
                                judulSurvei: judulSurvei,
                                detailSurvei: detailSurvei,
                                periode: periode,
                                startDate: startDate,
                                endDate: endDate,
                            }
                        })
                    })
                })
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "invalid role"
                })
        }
    },

    newTemplateSurvey(req, res) {
        let { namaTemplate, role, pertanyaan } = req.body

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const newTemplateId = lib.generateRandomString(20)
            const templateSurveiQuery = "INSERT INTO template_survei (id_template, nama_template, role) VALUES (?, ?, ?)"
            connection.query(templateSurveiQuery, [newTemplateId, namaTemplate, role], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };
            })

            const templatePertanyaanQuery = lib.parsingTemplatePertanyaan(pertanyaan, newTemplateId)
            connection.query(templatePertanyaanQuery, function (err, result) {
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
                        templateId: newTemplateId,
                        namaTemplate: namaTemplate,
                        role: role,
                        pertanyaan: pertanyaan
                    }
                })
            })

            connection.release();
        })
    },

    getQuestionWithSuggest(req, res) {
        // get query params
        const queryPayload = lib.getLikeQuery(req.query.query)

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = "SELECT id_pertanyaan_survei, tipe, pertanyaan FROM pertanyaan_survei where pertanyaan LIKE ?"
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

    getSurveyTemplate(req, res) {
        let role = req.query.role
        let query = ''
        switch (role) {
            case 'dosen':
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'dosen' order by template_survei.id_template;`
                break;
            case 'alumni':
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'alumni' order by template_survei.id_template;`
            case 'mahasiswa':
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'mahasiswa' order by template_survei.id_template;`
            default:
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey order by template_survei.id_template;`
                break;
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
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
                    data: lib.parsingGetTemplateQuery(result),
                })
            })

            connection.release();
        })
    },

    fillSurvey(req, res) {
        const role = req.params.role
        let { nim, nip, idSurvei, jawaban, submissionDate } = req.body
        let query = ""
        switch (role.toLowerCase()) {
            case 'dosen':
                query = lib.generateInsertQueryForSurveyAnswer(role.toLowerCase(), nip, idSurvei, jawaban, submissionDate)
                break;
            case 'alumni':
                query = lib.generateInsertQueryForSurveyAnswer(role.toLowerCase(), nim, idSurvei, jawaban, submissionDate)
                break;
            case 'mahasiswa':
                query = lib.generateInsertQueryForSurveyAnswer(role.toLowerCase(), nim, idSurvei, jawaban, submissionDate)
                break;

        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, function (err, result) {
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
                    message: 'Your record has been saved successfully',
                })
            })

            connection.release();
        })
    },

    // select survei, user info (mahasiswa => dosen dan kelas), jawaban, essay, submission date 
}