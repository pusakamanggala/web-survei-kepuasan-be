require('dotenv').config();
const config = require('../connection/mysql_connection');
const mysql = require('mysql2');
const pool = mysql.createPool(config);
const lib = require('./lib')
const excelToJson = require('convert-excel-to-json')
const fs = require('fs')

pool.on('error', (err) => {
    console.log(err)
});

const DEFAULT_LIMIT = 10
const DEFAULT_PAGE = 1
const DEFAULT_SORT = "ASC"
const DEFAULT_ORDER = "nim"
const MAX_AGE_COOKIE = 3 * 24 * 60 * 60 * 1000 // 3d same as jwt expired time

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

            const query = 'SELECT nama, nip, telepon FROM dosen WHERE nip = ? AND STATUS="AKTIF"';
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
            connection.query("select count(*) from dosen WHERE status= 'AKTIF'", function (err, res) {
                totalRecords = parseInt(res[0]["count(*)"])
            })

            const query = 'SELECT nama, nip, telepon FROM dosen WHERE status = "AKTIF"';
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

            const query = "SELECT nama, nip, telepon FROM dosen where nama LIKE ? AND status = 'AKTIF'"
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

        fs.unlinkSync(filePath)

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
                        message: lib.parsingErrorBulkInsert("Dosen", "nip", err)
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
        fs.unlinkSync(filePath)

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
        fs.unlinkSync(filePath)

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
                        message: lib.parsingErrorBulkInsert('Mahasiswa', 'nim', err)
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

            const query = 'SELECT nama, nim, angkatan, telepon, tahun_kelulusan FROM mahasiswa WHERE nim = ? and status="ALUMNI"';
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

            const query = 'SELECT nama, nim, angkatan, telepon, status FROM mahasiswa WHERE nama LIKE ? AND status = "AKTIF"';
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

                if (result.affectedRows === 0) {
                    return res.status(400).json({
                        success: false,
                        message: `tidak ada mahasiswa dengan nim ${nim}`
                    })
                }

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

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon, tahun_kelulusan", orderBy, sortBy, `WHERE status = "ALUMNI" AND angkatan = ${angkatan}`, lib.getPaging(limit, page))
            } else {
                connection.query("select count(*) from mahasiswa WHERE status='alumni'", [angkatan], function (err, res) {
                    totalRecords = parseInt(res[0]["count(*)"])
                })

                query = lib.fullQueryStringBuilder("mahasiswa", "nama, nim, angkatan, status, telepon, tahun_kelulusan", orderBy, sortBy, `WHERE status = "ALUMNI"`, lib.getPaging(limit, page))
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

            const query = 'INSERT INTO mata_kuliah (id_matkul, nama_matkul) SELECT * FROM (SELECT ? AS id_matkul, ? AS nama_matkul) t WHERE NOT EXISTS (SELECT 1 FROM mata_kuliah where nama_matkul = ?) LIMIT 1';
            connection.query(query, [newId, namaMataKuliah, namaMataKuliah], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.affectedRows === 0) {
                    return res.status(500).json({
                        success: false,
                        message: `Subject ${namaMataKuliah} already exists`
                    })
                }

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
                        idDosen: idDosen,
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

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            // query all student with inputted class
            connection.query(`SELECT id_mahasiswa FROM kontrak_matkul WHERE id_kelas = ?`, [idKelas], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.affectedRows === 0) {
                    return res.status(400).json({
                        success: false,
                        message: `there is no class with id ${idKelas}`
                    })
                }

                const listStudent = result.map(v => v.id_mahasiswa)
                let parsedStudent = []
                for (const i of idMahasiswa) {
                    if (!listStudent.includes(i)) {
                        parsedStudent.push(i)
                    }
                }

                if (parsedStudent.length === 0) {
                    return res.send({
                        success: true,
                        message: 'Your record has been saved successfully',
                        data: {
                            idKelas: idKelas,
                            idMahasiswa: idMahasiswa
                        }
                    })
                }

                const query = lib.generateBulkQueryAddMahasiswaToKelas(idKelas, parsedStudent)
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

                const dataKelas = lib.parsingGetKelasQueryResult(result)
                if (!dataKelas) {
                    return res.status(400).json({
                        success: false,
                        message: 'Kelas ini belum memiliki mahasiswa',
                    })
                }

                return res.send({
                    success: true,
                    message: 'fetch data successfully',
                    data: dataKelas
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
            connection.query(`select count(*) from kelas WHERE ${now} > start_date AND ${now} < end_date`, function (err, res) {
                totalRecords = parseInt(res[0]["count(*)"])
            })

            const query = `SELECT id_kelas, nama_kelas, nama_dosen FROM kelas WHERE ${now} > start_date AND ${now} < end_date`;
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

            const query = "SELECT nama, nim, angkatan, tahun_kelulusan, telepon FROM mahasiswa where nama LIKE ? and status = 'ALUMNI'"
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
        const userId = req.query.id
        const currentTimestamp = lib.getCurrentUnixTimeStamp()

        const query = lib.generateQueryForGetSurvey(role.toLowerCase(), currentTimestamp, userId)

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
        switch (role.toLowerCase()) {
            case 'dosen':
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'dosen' order by template_survei.id_template;`
                break;
            case 'alumni':
                console.log("here")
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'alumni' order by template_survei.id_template;`
                break
            case 'mahasiswa':
                query = `SELECT template_survei.id_template, template_survei.nama_template, template_survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.tipe, pertanyaan_survei.pertanyaan FROM template_survei JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON pertanyaan_survei.id_pertanyaan_survei = template_pertanyaan.id_pertanyaan_survey WHERE template_survei.role = 'mahasiswa' order by template_survei.id_template;`
                break
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

    getHistorySurvey(req, res) {
        const role = req.params.role
        const id = req.query.id

        let query = ""
        switch (role.toLowerCase()) {
            case 'mahasiswa':
                query = `SELECT DISTINCT survei_mahasiswa.id_survei_mahasiswa, survei_mahasiswa.judul_survei, survei_mahasiswa.detail_survei, survei_mahasiswa.start_date, survei_mahasiswa.end_date, survei_mahasiswa.periode, hasil_survei_mahasiswa.submission_date, hasil_survei_mahasiswa.id_survei_mahasiswa FROM survei_mahasiswa JOIN hasil_survei_mahasiswa ON survei_mahasiswa.id_survei_mahasiswa = hasil_survei_mahasiswa.id_survei_mahasiswa WHERE hasil_survei_mahasiswa.id_mahasiswa = ${id}`
                break;
            case 'dosen':
                query = `SELECT DISTINCT survei_dosen.id_survei_dosen, survei_dosen.judul_survei, survei_dosen.detail_survei, survei_dosen.start_date, survei_dosen.end_date, survei_dosen.periode, hasil_survei_dosen.submission_date, hasil_survei_dosen.id_survei_dosen FROM survei_dosen JOIN hasil_survei_dosen ON survei_dosen.id_survei_dosen = hasil_survei_dosen.id_survei_dosen WHERE hasil_survei_dosen.id_dosen = ${id}`
                break;
            case 'alumni':
                query = `SELECT DISTINCT survei_alumni.id_survei_alumni, survei_alumni.judul_survei, survei_alumni.detail_survei, survei_alumni.start_date, survei_alumni.end_date, survei_alumni.periode, hasil_survei_alumni.submission_date, hasil_survei_alumni.id_survei_alumni FROM survei_alumni JOIN hasil_survei_alumni ON survei_alumni.id_survei_alumni = hasil_survei_alumni.id_survei_alumni WHERE hasil_survei_alumni.id_mahasiswa = ${id}`
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
                    data: result,
                })
            })

            connection.release();
        })
    },

    getStatisticSurvey(req, res) {
        const role = req.params.role
        const id = req.query.id

        let query = ""
        let totalRespondenQuery = ""

        switch (role.toLowerCase()) {
            case 'mahasiswa':
                query = `SELECT hasil_survei_mahasiswa.id_survei_mahasiswa, hasil_survei_mahasiswa.id_pertanyaan_survei, survei_mahasiswa.id_kelas, kelas.nama_kelas, kelas.nama_dosen, pertanyaan_survei.pertanyaan, hasil_survei_mahasiswa.id_opsi, hasil_survei_mahasiswa.essay FROM hasil_survei_mahasiswa JOIN pertanyaan_survei ON hasil_survei_mahasiswa.id_pertanyaan_survei = pertanyaan_survei.id_pertanyaan_survei JOIN survei_mahasiswa ON hasil_survei_mahasiswa.id_survei_mahasiswa = survei_mahasiswa.id_survei_mahasiswa JOIN kelas ON kelas.id_kelas = survei_mahasiswa.id_kelas WHERE hasil_survei_mahasiswa.id_survei_mahasiswa = '${id}' ORDER BY pertanyaan_survei.tipe ASC`

                totalRespondenQuery = `SELECT count(DISTINCT id_mahasiswa) as total_responden FROM hasil_survei_mahasiswa WHERE id_survei_mahasiswa = '${id}' ORDER BY id_mahasiswa`
                break;
            case 'dosen':
                query = `SELECT hasil_survei_dosen.id_survei_dosen, hasil_survei_dosen.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, hasil_survei_dosen.id_opsi, hasil_survei_dosen.essay FROM hasil_survei_dosen JOIN pertanyaan_survei ON hasil_survei_dosen.id_pertanyaan_survei = pertanyaan_survei.id_pertanyaan_survei WHERE hasil_survei_dosen.id_survei_dosen = '${id}' ORDER BY pertanyaan_survei.tipe ASC`

                totalRespondenQuery = `SELECT count(DISTINCT id_dosen) as total_responden FROM hasil_survei_dosen WHERE id_survei_dosen = '${id}' ORDER BY id_dosen`
                break;
            case 'alumni':
                query = `SELECT hasil_survei_alumni.id_survei_alumni, hasil_survei_alumni.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, hasil_survei_alumni.id_opsi, hasil_survei_alumni.essay FROM hasil_survei_alumni JOIN pertanyaan_survei ON hasil_survei_alumni.id_pertanyaan_survei = pertanyaan_survei.id_pertanyaan_survei WHERE hasil_survei_alumni.id_survei_alumni = '${id}' ORDER BY pertanyaan_survei.tipe ASC`

                totalRespondenQuery = `SELECT count(DISTINCT id_mahasiswa) as total_responden FROM hasil_survei_alumni WHERE id_survei_alumni = '${id}' ORDER BY id_mahasiswa`
                break;
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            let totalResponse = 0
            connection.query(totalRespondenQuery, function (err, res) {
                totalResponse = parseInt(res[0]["total_responden"])
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
                        message: 'There is no record with that query'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Fetch data successfully',
                    data: {
                        idSurvey: id,
                        idKelas: result[0]["id_kelas"],
                        namaKelas: result[0]["nama_kelas"],
                        namaDosen: result[0]["nama_dosen"],
                        surveyData: lib.parsingGetStatisticSurvey(result, totalResponse),

                    }
                })
            })

            connection.release();
        })
    },

    getSurveyRecap(req, res) {
        const startDate = req.query.startDate
        const endDate = req.query.endDate
        const role = req.query.role
        const surveyId = req.query.id

        let query = ""
        switch (role.toLowerCase()) {
            case "alumni":
                query = `SELECT survei_alumni.id_survei_alumni, survei_alumni.periode, hasil_survei_alumni.id_opsi, id_mahasiswa,hasil_survei_alumni.essay,opsi_pertanyaan.opsi FROM survei_alumni JOIN hasil_survei_alumni ON hasil_survei_alumni.id_survei_alumni = survei_alumni.id_survei_alumni JOIN opsi_pertanyaan ON opsi_pertanyaan.id_opsi = hasil_survei_alumni.id_opsi WHERE survei_alumni.id_survei_alumni = '${surveyId}'`
                break;
            case "dosen":
                query = `SELECT
                survei_dosen.id_survei_dosen,
                survei_dosen.periode,
                hasil_survei_dosen.id_opsi,
                hasil_survei_dosen.id_dosen,
                hasil_survei_dosen.essay,
                opsi_pertanyaan.opsi 
            FROM
                survei_dosen
                JOIN hasil_survei_dosen ON hasil_survei_dosen.id_survei_dosen = survei_dosen.id_survei_dosen
                JOIN opsi_pertanyaan ON opsi_pertanyaan.id_opsi = hasil_survei_dosen.id_opsi 
            WHERE
                survei_dosen.id_survei_dosen = '${surveyId}'`
                break;
            default:
                query = `SELECT survei_mahasiswa.id_survei_mahasiswa, kelas.nama_dosen, kelas.id_dosen, survei_mahasiswa.periode, hasil_survei_mahasiswa.id_opsi, hasil_survei_mahasiswa.id_mahasiswa, hasil_survei_mahasiswa.essay FROM survei_mahasiswa JOIN kelas ON survei_mahasiswa.id_kelas = kelas.id_kelas JOIN hasil_survei_mahasiswa ON hasil_survei_mahasiswa.id_survei_mahasiswa = survei_mahasiswa.id_survei_mahasiswa WHERE survei_mahasiswa.start_date >= ${startDate} AND survei_mahasiswa.end_date <= ${endDate}`
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
                    data: lib.parsingSurveyRecap(result, role)
                })
            })

            connection.release();
        })
    },

    removeStudentFromClass(req, res) {
        const nim = req.query.nim
        const classId = req.query.classId

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'DELETE FROM kontrak_matkul WHERE id_kelas = ? AND id_mahasiswa = ?';
            connection.query(query, [classId, nim], function (err, result) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: err
                    })
                };

                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(400).json({
                        success: true,
                        message: 'There is no record with that requested id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Success delete record',
                    data: result[0]
                })
            })

            connection.release();
        })
    },

    updateMahasiswa(req, res) {
        const id = req.params.id;

        // parse data
        const data = {
            nama: req.body.nama,
            telepon: req.body.telepon,
            angkatan: req.body.angkatan,
            status: req.body.status,
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'UPDATE mahasiswa SET ? WHERE nim = ? ';
            connection.query(query, [data, id], function (err, result) {
                if (err) throw err;

                if (result['affectedRows'] === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'There is no record with that id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Updated successfully',
                })
            })

            connection.release();
        })
    },

    login(req, res) {
        const { id, password } = req.body
        const role = req.params.role

        let query = ""
        switch (role.toLowerCase()) {
            case 'dosen':
                query = `SELECT nip, nama, telepon, password FROM dosen WHERE nip = ? AND status = 'AKTIF'`
                break;
            case 'mahasiswa':
                query = `SELECT nim, nama, angkatan, telepon, password FROM mahasiswa WHERE nim = ? AND status = 'AKTIF'`
                break
            case 'admin':
                query = `SELECT * FROM admin WHERE id_admin = ?`
                break
            case 'alumni':
                query = `SELECT nim, nama, angkatan, telepon, password, tahun_kelulusan FROM mahasiswa WHERE nim = ? AND status = 'ALUMNI'`
                break
            case 'admin':
                query = `SELECT id_admin, nama, password FROM admin WHERE id_admin = ?`
                break
        }

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

                if (result.length === 0 || result.affectedRows === 0) {
                    return res.status(401).json({
                        success: false,
                        message: "wrong username or password"
                    })
                }

                // check password hash
                if (!lib.comparePassword(password, result[0]["password"])) {
                    return res.status(401).json({
                        success: false,
                        message: "wrong username or password"
                    })
                }

                delete result[0]["password"]

                // generate jwt
                const jwt = lib.generateAccessToken({ "userId": id, "role": role.toUpperCase() })

                // const secure = (process.env.PROTOCOL === 'HTTP') ? false : true
                // const sameSite = (process.env.PROTOCOL === 'HTTP') ? 'strict' : 'none'

                // // set cookie
                // res.cookie('Authorization', jwt, { maxAge: MAX_AGE_COOKIE, sameSite: 'strict', secure: 'false' });

                return res.send({
                    success: true,
                    message: 'Success login',
                    token: jwt,
                    data: result[0]
                })
            })

            connection.release();
        })
    },

    updateDosen(req, res) {
        const id = req.params.id;

        // parse data
        const data = {
            nama: req.body.nama,
            telepon: req.body.telepon,
            status: req.body.status,
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'UPDATE dosen SET ? WHERE nip = ? ';
            connection.query(query, [data, id], function (err, result) {
                if (err) throw err;

                if (result['affectedRows'] === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'There is no record with that id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Updated successfully',
                })
            })

            connection.release();
        })
    },

    getSurveyRecapExcel(req, res) {
        const startDate = req.query.startDate
        const endDate = req.query.endDate

        const query = `SELECT survei_mahasiswa.id_survei_mahasiswa, kelas.nama_dosen, kelas.id_dosen, survei_mahasiswa.periode, hasil_survei_mahasiswa.id_opsi, hasil_survei_mahasiswa.id_mahasiswa, hasil_survei_mahasiswa.essay, opsi_pertanyaan.opsi FROM survei_mahasiswa JOIN kelas ON survei_mahasiswa.id_kelas = kelas.id_kelas JOIN hasil_survei_mahasiswa ON hasil_survei_mahasiswa.id_survei_mahasiswa = survei_mahasiswa.id_survei_mahasiswa JOIN opsi_pertanyaan ON opsi_pertanyaan.id_opsi = hasil_survei_mahasiswa.id_opsi WHERE survei_mahasiswa.start_date >= ${startDate} AND survei_mahasiswa.end_date <= ${endDate} AND opsi_pertanyaan.opsi != "ESSAY"`

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            connection.query(query, async function (err, result) {
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

                const parsedData = lib.parsingSurveyRecapExcel(result)

                // generate excel file
                const fileName = lib.generateRecapFileName(startDate, endDate)
                const downloadLink = await lib.getDownloadLink(parsedData, fileName)
                return res.send({
                    success: true,
                    message: 'success generate recap file',
                    data: downloadLink
                })
            })

            connection.release();
        })
    },

    updateAlumni(req, res) {
        const id = req.params.id;

        // parse data
        const data = {
            nama: req.body.nama,
            telepon: req.body.telepon,
        }

        pool.getConnection(function (err, connection) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err
                })
            };

            const query = 'UPDATE mahasiswa SET ? WHERE nim = ? ';
            connection.query(query, [data, id], function (err, result) {
                if (err) throw err;

                if (result['affectedRows'] === 0) {
                    return res.status(400).json({
                        success: false,
                        message: 'There is no record with that id'
                    })
                }

                return res.send({
                    success: true,
                    message: 'Updated successfully',
                })
            })

            connection.release();
        })
    },
}