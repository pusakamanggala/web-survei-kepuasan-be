const bcrypt = require('bcrypt')

module.exports = {
    getLikeQuery(query) {
        return `%${query}%`
    },

    fullQueryStringBuilder(table, selection, orderBy, sortBy, condition, paging) {
        return `SELECT ${selection} FROM ${table} ${condition} ORDER BY ${orderBy} ${sortBy} ${paging}`;
    },

    getPaging(limit, page) {
        const offset = (page - 1) * limit
        return `LIMIT ${limit} OFFSET ${offset}`
    },

    hashPassword(plainPassword) {
        return bcrypt.hashSync(plainPassword, 10);
    },

    comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    },

    generateBulkQueryDosen(arrJson) {
        var purgedArr = arrJson.map(element => {
            return {
                nama: element.nama,
                nip: element.nip.toString(),
                telepon: (element.telepon === undefined) ? null : element.telepon.toString(),
                password: this.hashPassword(element.nip.toString())
            }
        })

        let query = "INSERT INTO dosen (nip, nama, telepon, password) VALUES "
        purgedArr.forEach((element, index) => {
            const value = (index === purgedArr.length - 1) ? `('${element.nip}', '${element.nama}', ${element.telepon}, '${element.password}')` : `('${element.nip}', '${element.nama}', ${element.telepon}, '${element.password}'), `
            query += value
        });

        return query
    },

    generateBulkQueryAlumni(arrJson) {
        let query = "UPDATE mahasiswa SET status = 'ALUMNI', tahun_kelulusan = CASE "
        arrJson.forEach(element => {
            query += `WHEN nim = '${element.nim}' THEN '${element.tahun_kelulusan}' `
        })

        query += "ELSE tahun_kelulusan END WHERE nim IN "
        arrJson.forEach((element, i) => {
            query += (i == arrJson.length - 1) ? `'${element.nim}')` : `('${element.nim}', `
        })

        return query
    },

    generateBulkQueryMahasiswa(arrJson) {
        var purgedArr = arrJson.map(element => {
            return {
                nama: element.nama,
                nim: element.nim.toString(),
                angkatan: element.angkatan.toString(),
                telepon: (element.telepon === undefined) ? null : element.telepon.toString(),
                password: (element.password === undefined) ? this.hashPassword(element.nim.toString()) : this.hashPassword(element.password.toString())
            }
        })

        let query = "INSERT INTO mahasiswa (nim, nama, telepon, password, angkatan) VALUES "
        purgedArr.forEach((element, index) => {
            const value = (index === purgedArr.length - 1) ? `('${element.nim}', '${element.nama}', ${element.telepon}, '${element.password}', '${element.angkatan}')` : `('${element.nim}', '${element.nama}', ${element.telepon}, '${element.password}', '${element.angkatan}'), `
            query += value
        });

        return query
    },

    generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    },

    getCurrentUnixTimeStamp() {
        return Math.floor(Date.now() / 1000);
    },

    addCurrentUnixTimeStamp(incr) {
        return this.getCurrentUnixTimeStamp(Date.now()) + incr
    },

    generateBulkQueryAddMahasiswaToKelas(idKelas, idMahasiswa) {
        let query = "INSERT INTO kontrak_matkul (id_kontrak, id_kelas, id_mahasiswa) VALUES "
        idMahasiswa.forEach((element, index) => {
            const value = (index === idMahasiswa.length - 1) ? `('${this.generateRandomString(20)}', '${idKelas}', '${element}')` : `('${this.generateRandomString(20)}', '${idKelas}', '${element}'), `
            query += value
        })

        return query
    },

    generateQueryForGetSurvey(role, time) {
        switch (role) {
            case 'dosen':
                return `SELECT survei.id_survei, survei.judul_survei, survei.detail_survei, survei.periode, survei.start_date, survei.end_date, survei.role, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe FROM survei JOIN template_survei ON survei.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei WHERE ${time} > survei.start_date AND ${time} < survei.end_date`
            case 'mahasiswa':
                return `SELECT survei_mahasiswa.id_survei_mahasiswa, survei_mahasiswa.judul_survei, survei_mahasiswa.detail_survei, survei_mahasiswa.periode, survei_mahasiswa.start_date, survei_mahasiswa.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe, kelas.id_kelas, kelas.nama_kelas, kelas.nama_dosen FROM survei_mahasiswa JOIN template_survei ON survei_mahasiswa.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei JOIN kelas on kelas.id_kelas = survei_mahasiswa.id_kelas WHERE ${time} > survei_mahasiswa.start_date AND ${time} < survei_mahasiswa.end_date`
            // alumni
            default:
                return `SELECT survei_alumni.id_survei_alumni, survei_alumni.judul_survei, survei_alumni.detail_survei, survei_alumni.periode, survei_alumni.start_date, survei_alumni.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe FROM survei_alumni JOIN template_survei ON survei_alumni.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei WHERE ${time} > survei.start_date AND ${time} < survei.end_date`
        }


    },

    parsingGetKelasQueryResult(result) {
        return {
            idKelas: result[0].id_kelas,
            namaKelas: result[0].nama_kelas,
            namaDosen: result[0].nama_dosen,
            StartDate: result[0].start_date,
            endDate: result[0].end_date,
            idMatkul: result[0].id_matkul,
            namaMatkul: result[0].nama_matkul,
            mahasiswa: result.map(e => {
                return {
                    nim: e.nim,
                    nama: e.nama
                }
            })
        }
    },

    parsingSurveyResult(options, resultQuery, role) {

        switch (role) {
            case 'dosen':
                return {
                    idSurvei: resultQuery[0].id_survei,
                    judulSurvei: resultQuery[0].judul_survei,
                    detailSurvei: resultQuery[0].detail_survei,
                    periode: resultQuery[0].periode,
                    startDate: resultQuery[0].start_date,
                    endDate: resultQuery[0].end_date,
                    role: resultQuery[0].mahasiswa,
                    opsi: options,
                    pertanyaan: resultQuery.map(element => {
                        return {
                            tipe: element.tipe,
                            pertanyaan: element.pertanyaan,
                            id: element.id_pertanyaan_survei,
                        }
                    })
                }
            case 'mahasiswa':
                return {
                    idSurvei: resultQuery[0].id_survei,
                    judulSurvei: resultQuery[0].judul_survei,
                    detailSurvei: resultQuery[0].detail_survei,
                    periode: resultQuery[0].periode,
                    startDate: resultQuery[0].start_date,
                    endDate: resultQuery[0].end_date,
                    role: resultQuery[0].mahasiswa,
                    opsi: options,
                    kelas: {
                        id: resultQuery[0].id_kelas,
                        namaKelas: resultQuery[0].nama_kelas,
                        namDosen: resultQuery[0].nama_dosen,
                    },
                    pertanyaan: resultQuery.map(element => {
                        return {
                            tipe: element.tipe,
                            pertanyaan: element.pertanyaan,
                            id: element.id_pertanyaan_survei,
                        }
                    })
                }
            // alumni
            default:
                return {
                    idSurvei: resultQuery[0].id_survei,
                    judulSurvei: resultQuery[0].judul_survei,
                    detailSurvei: resultQuery[0].detail_survei,
                    periode: resultQuery[0].periode,
                    startDate: resultQuery[0].start_date,
                    endDate: resultQuery[0].end_date,
                    role: resultQuery[0].mahasiswa,
                    opsi: options,
                    pertanyaan: resultQuery.map(element => {
                        return {
                            tipe: element.tipe,
                            pertanyaan: element.pertanyaan,
                            id: element.id_pertanyaan_survei,
                        }
                    })
                }
        }


    },

    generateBulkQueryForNewQuestion(payload) {
        let query = "INSERT INTO pertanyaan_survei (id_pertanyaan_survei, tipe, pertanyaan) VALUES "
        payload.forEach((element, index) => {
            const value = (index === payload.length - 1) ? `('${this.generateRandomString(20)}', '${element.tipe}', '${element.pertanyaan}')` : `('${this.generateRandomString(20)}', '${element.tipe}', '${element.pertanyaan}'), `
            query += value
        })

        return query
    },

    parsingTemplatePertanyaan(pertanyaan, idTemplate) {
        let query = "INSERT INTO template_pertanyaan (id_template_pertanyaan, id_template, id_pertanyaan_survey) VALUES "
        pertanyaan.forEach((element, index) => {
            const value = (index === pertanyaan.length - 1) ? `('${this.generateRandomString(20)}', '${idTemplate}', '${element}')` : `('${this.generateRandomString(20)}', '${idTemplate}', '${element}'), `
            query += value
        })

        return query
    },

    parsingGetTemplateQuery(result) {
        let temp = {}
        result.forEach(element => {
            if (!temp.hasOwnProperty(element.id_template)) {
                temp[element.id_template] = {
                    idTemplate: element.id_template,
                    namaTemplate: element.nama_template,
                    role: element.role,
                    pertanyaan: [
                        {
                            idPertanyaan: element.id_pertanyaan_survei,
                            tipe: element.tipe,
                            pertanyaan: element.pertanyaan,
                        }
                    ]
                }
            } else {
                temp[element.id_template].pertanyaan.push(
                    {
                        idPertanyaan: element.id_pertanyaan_survei,
                        tipe: element.tipe,
                        pertanyaan: element.pertanyaan,
                    }
                )
            }

        });
        let finalRes = []
        for (var prop in temp) {
            if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                finalRes.push(temp[prop])
            }
        }
        return finalRes
    }
}