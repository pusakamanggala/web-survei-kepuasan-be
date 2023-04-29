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

    generateQueryForGetSurvey(role, time, nim) {
        switch (role) {
            case 'dosen':
                return `SELECT survei_dosen.id_survei_dosen, survei_dosen.judul_survei, survei_dosen.detail_survei, survei_dosen.periode, survei_dosen.start_date, survei_dosen.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe FROM survei_dosen JOIN template_survei ON survei_dosen.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei WHERE ${time} > survei_dosen.start_date AND ${time} < survei_dosen.end_date AND NOT EXISTS ( SELECT id_survei_dosen, id_dosen FROM hasil_survei_dosen WHERE hasil_survei_dosen.id_survei_dosen = survei_dosen.id_survei_dosen AND hasil_survei_dosen.id_dosen = ${nim} ) ORDER BY survei_dosen.id_survei_dosen, pertanyaan_survei.tipe asc `
            case 'mahasiswa':
                return `SELECT survei_mahasiswa.id_survei_mahasiswa, survei_mahasiswa.judul_survei, survei_mahasiswa.detail_survei, survei_mahasiswa.periode, survei_mahasiswa.start_date, survei_mahasiswa.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe, kelas.id_kelas, kelas.nama_kelas, kelas.nama_dosen FROM survei_mahasiswa JOIN template_survei ON survei_mahasiswa.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei JOIN kelas on kelas.id_kelas = survei_mahasiswa.id_kelas WHERE ${time} > survei_mahasiswa.start_date AND ${time} < survei_mahasiswa.end_date AND NOT EXISTS (select id_survei_mahasiswa, id_mahasiswa FROM hasil_survei_mahasiswa WHERE hasil_survei_mahasiswa.id_survei_mahasiswa = survei_mahasiswa.id_survei_mahasiswa AND hasil_survei_mahasiswa.id_mahasiswa = ${nim}) ORDER BY survei_mahasiswa.id_survei_mahasiswa, pertanyaan_survei.tipe asc`
            // alumni
            default:
                return `SELECT survei_alumni.id_survei_alumni, survei_alumni.judul_survei, survei_alumni.detail_survei, survei_alumni.periode, survei_alumni.start_date, survei_alumni.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe FROM survei_alumni JOIN template_survei ON survei_alumni.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei WHERE ${time} > survei_alumni.start_date AND ${time} < survei_alumni.end_date AND NOT EXISTS ( SELECT id_survei_alumni, id_mahasiswa FROM hasil_survei_alumni WHERE hasil_survei_alumni.id_survei_alumni = survei_alumni.id_survei_alumni AND hasil_survei_alumni.id_mahasiswa = ${nim} ) ORDER BY survei_alumni.id_survei_alumni, pertanyaan_survei.tipe asc `
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

    parsingSurveyResult(resultQuery, role) {
        let temp = {}
        let finalRes = []

        switch (role) {
            case 'dosen':
                resultQuery.forEach(element => {
                    if (!temp.hasOwnProperty(element.id_survei_dosen)) {
                        temp[element.id_survei_dosen] = {
                            idSurvei: element.id_survei_dosen,
                            judulSurvei: element.judul_survei,
                            detailSurvei: element.detail_survei,
                            periode: element.periode,
                            startDate: element.start_date,
                            endDate: element.end_date,
                            pertanyaan: [
                                {
                                    idPertanyaan: element.id_pertanyaan_survei,
                                    tipe: element.tipe,
                                    pertanyaan: element.pertanyaan,
                                }
                            ]
                        }
                    } else {
                        temp[element.id_survei_dosen].pertanyaan.push(
                            {
                                idPertanyaan: element.id_pertanyaan_survei,
                                tipe: element.tipe,
                                pertanyaan: element.pertanyaan,
                            }
                        )
                    }
                });

                for (var prop in temp) {
                    if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                        finalRes.push(temp[prop])
                    }
                }

                return finalRes

            case 'mahasiswa':
                resultQuery.forEach(element => {
                    if (!temp.hasOwnProperty(element.id_survei_mahasiswa)) {
                        temp[element.id_survei_mahasiswa] = {
                            idSurvei: element.id_survei_mahasiswa,
                            judulSurvei: element.judul_survei,
                            detailSurvei: element.detail_survei,
                            periode: element.periode,
                            startDate: element.start_date,
                            endDate: element.end_date,
                            kelas: {
                                id: element.id_kelas,
                                namaKelas: element.nama_kelas,
                                namDosen: element.nama_dosen,
                            },
                            pertanyaan: [
                                {
                                    idPertanyaan: element.id_pertanyaan_survei,
                                    tipe: element.tipe,
                                    pertanyaan: element.pertanyaan,
                                }
                            ]
                        }
                    } else {
                        temp[element.id_survei_mahasiswa].pertanyaan.push(
                            {
                                idPertanyaan: element.id_pertanyaan_survei,
                                tipe: element.tipe,
                                pertanyaan: element.pertanyaan,
                            }
                        )
                    }
                });

                for (var prop in temp) {
                    if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                        finalRes.push(temp[prop])
                    }
                }

                return finalRes
            default:
                resultQuery.forEach(element => {
                    if (!temp.hasOwnProperty(element.id_survei_alumni)) {
                        temp[element.id_survei_alumni] = {
                            idSurvei: element.id_survei_alumni,
                            judulSurvei: element.judul_survei,
                            detailSurvei: element.detail_survei,
                            periode: element.periode,
                            startDate: element.start_date,
                            endDate: element.end_date,
                            pertanyaan: [
                                {
                                    idPertanyaan: element.id_pertanyaan_survei,
                                    tipe: element.tipe,
                                    pertanyaan: element.pertanyaan,
                                }
                            ]
                        }
                    } else {
                        temp[element.id_survei_alumni].pertanyaan.push(
                            {
                                idPertanyaan: element.id_pertanyaan_survei,
                                tipe: element.tipe,
                                pertanyaan: element.pertanyaan,
                            }
                        )
                    }
                });

                for (var prop in temp) {
                    if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                        finalRes.push(temp[prop])
                    }
                }

                return finalRes
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
    },

    generateInsertQueryForSurveyAnswer(role, nim, idSurvei, jawaban, submissionDate) {
        let query = ""
        switch (role) {
            case 'dosen':
                query = `INSERT INTO hasil_survei_dosen (id_hasil_survei_dosen, id_survei_dosen, id_dosen, id_pertanyaan_survei, id_opsi, essay, submission_date) VALUES `

                jawaban.forEach((element, index) => {
                    const essay = (element.essay === undefined) ? null : `'${element.essay}'`
                    const value = (index === jawaban.length - 1) ? `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate})` : `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate}), `
                    query += value
                });

                return query

            case 'mahasiswa':
                query = `INSERT INTO hasil_survei_mahasiswa (id_hasil_survei_mahasiswa, id_survei_mahasiswa, id_mahasiswa, id_pertanyaan_survei, id_opsi, essay, submission_date) VALUES `

                jawaban.forEach((element, index) => {
                    const essay = (element.essay === undefined) ? null : `'${element.essay}'`
                    const value = (index === jawaban.length - 1) ? `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate})` : `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate}), `
                    query += value
                });

                return query
            case 'alumni':
                query = `INSERT INTO hasil_survei_alumni (id_hasil_survei_alumni, id_survei_alumni, id_mahasiswa, id_pertanyaan_survei, id_opsi, essay, submission_date) VALUES `

                jawaban.forEach((element, index) => {
                    const essay = (element.essay === undefined) ? null : `'${element.essay}'`
                    const value = (index === jawaban.length - 1) ? `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate})` : `('${this.generateRandomString(20)}', '${idSurvei}', '${nim}', '${element.idPertanyaan}', '${element.idOpsi}', ${essay}, ${submissionDate}), `
                    query += value
                });

                return query
            default:
                break;
        }

    }
}