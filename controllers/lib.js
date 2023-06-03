require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const fs = require('fs');


const ACCESS_TOKEN_EXPIRED_TIME = '3d'

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

        query += "ELSE tahun_kelulusan END WHERE nim IN ("
        arrJson.forEach((element, i) => {
            query += (i === arrJson.length - 1) ? `'${element.nim}')` : `'${element.nim}', `
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
                return `SELECT survei_mahasiswa.id_survei_mahasiswa, survei_mahasiswa.judul_survei, survei_mahasiswa.detail_survei, survei_mahasiswa.periode, survei_mahasiswa.start_date, survei_mahasiswa.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe, kelas.id_kelas, kelas.nama_kelas, kelas.nama_dosen, kontrak_matkul.id_kelas, kontrak_matkul.id_mahasiswa FROM survei_mahasiswa JOIN template_survei ON survei_mahasiswa.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei JOIN kelas on kelas.id_kelas = survei_mahasiswa.id_kelas JOIN kontrak_matkul on kelas.id_kelas = kontrak_matkul.id_kelas WHERE ${time} > survei_mahasiswa.start_date AND ${time} < survei_mahasiswa.end_date AND NOT EXISTS (select id_survei_mahasiswa, id_mahasiswa FROM hasil_survei_mahasiswa WHERE hasil_survei_mahasiswa.id_survei_mahasiswa = survei_mahasiswa.id_survei_mahasiswa AND hasil_survei_mahasiswa.id_mahasiswa = ${nim}) AND kontrak_matkul.id_mahasiswa = ${nim} ORDER BY survei_mahasiswa.id_survei_mahasiswa, pertanyaan_survei.tipe asc`
            // alumni
            default:
                return `SELECT survei_alumni.id_survei_alumni, survei_alumni.judul_survei, survei_alumni.detail_survei, survei_alumni.periode, survei_alumni.start_date, survei_alumni.end_date, pertanyaan_survei.id_pertanyaan_survei, pertanyaan_survei.pertanyaan, pertanyaan_survei.tipe FROM survei_alumni JOIN template_survei ON survei_alumni.id_template = template_survei.id_template JOIN template_pertanyaan ON template_survei.id_template = template_pertanyaan.id_template JOIN pertanyaan_survei ON template_pertanyaan.id_pertanyaan_survey = pertanyaan_survei.id_pertanyaan_survei WHERE ${time} > survei_alumni.start_date AND ${time} < survei_alumni.end_date AND NOT EXISTS ( SELECT id_survei_alumni, id_mahasiswa FROM hasil_survei_alumni WHERE hasil_survei_alumni.id_survei_alumni = survei_alumni.id_survei_alumni AND hasil_survei_alumni.id_mahasiswa = ${nim} ) ORDER BY survei_alumni.id_survei_alumni, pertanyaan_survei.tipe asc `
        }
    },

    parsingGetKelasQueryResult(result) {
        try {
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
        } catch (error) {
            return false
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
    },

    parsingGetStatisticSurvey(result, totalRespondents) {
        let temp = {}
        let finalRes = []

        result.forEach(element => {
            if (!temp.hasOwnProperty(element.id_pertanyaan_survei)) {
                temp[element.id_pertanyaan_survei] = {
                    idPertanyaan: element.id_pertanyaan_survei,
                    pertanyaan: element.pertanyaan,
                    jawaban: {
                        "dm0KtbQPdK0Pfazv8opf": {
                            "bobot": 1,
                            "opsi": "KURANG",
                            "total": 0,
                        },
                        "21craH0rvALjqlnwcOI6": {
                            "bobot": 2,
                            "opsi": "CUKUP",
                            "total": 0,
                        },
                        "6ULGZb5Vxwy9wdNNhYdc": {
                            "bobot": 3,
                            "opsi": "BAIK",
                            "total": 0,
                        },
                        "z5OHO3jjoYXq4GHXacIR": {
                            "opsi": "SANGAT BAIK",
                            "bobot": 4,
                            "total": 0,
                        },
                        "rnDvcWSJ3ASo3NLe1mg7": {
                            "opsi": "ESSAY",
                            "bobot": 0,
                            "total": 0,
                        },
                        "responden": totalRespondents,
                        "totalRespon": 0,
                        "ikm": 0,
                    }
                }

                let currentOption = temp[element.id_pertanyaan_survei]["jawaban"][element.id_opsi]
                currentOption["total"]++

                if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                    if (element["essay"] !== undefined) {
                        currentOption["essay"] = [element["essay"]]
                    }
                }

                temp[element.id_pertanyaan_survei]["jawaban"]["totalRespon"]++
            } else {
                let currentOption = temp[element.id_pertanyaan_survei]["jawaban"][element.id_opsi]
                currentOption["total"]++

                if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                    if (element["essay"] !== undefined) {
                        currentOption["essay"].push(element["essay"])
                    }
                }
                temp[element.id_pertanyaan_survei]["jawaban"]["totalRespon"]++
            }
        });

        for (var prop in temp) {
            if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                temp[prop]["jawaban"]["ikm"] = this.parsingGlobalIkm(temp[prop]["jawaban"])
                finalRes.push(temp[prop])
            }
        }

        return finalRes
    },

    parsingGlobalIkm(obj) {
        let total = 0.0
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                const point = parseFloat(obj[prop]["bobot"]) * parseFloat(obj[prop]["total"]) / parseFloat(obj["totalRespon"])
                if (!isNaN(point)) {
                    total += point
                }
            }
        }

        return total
    },

    parsingSurveyRecapMhs(result) {
        let temp = {}
        let finalRes = []
        let trackerIdMahasiswaAndSurvey = {}

        result.forEach(element => {
            if (!temp.hasOwnProperty(element.id_dosen)) {
                temp[element.id_dosen] = {
                    idDosen: element.id_dosen,
                    namaDosen: element.nama_dosen,
                    periode: element.periode,
                    hasilRekap: {
                        "dm0KtbQPdK0Pfazv8opf": {
                            "bobot": 1,
                            "opsi": "KURANG",
                            "total": 0,
                        },
                        "21craH0rvALjqlnwcOI6": {
                            "bobot": 2,
                            "opsi": "CUKUP",
                            "total": 0,
                        },
                        "6ULGZb5Vxwy9wdNNhYdc": {
                            "bobot": 3,
                            "opsi": "BAIK",
                            "total": 0,
                        },
                        "z5OHO3jjoYXq4GHXacIR": {
                            "opsi": "SANGAT BAIK",
                            "bobot": 4,
                            "total": 0,
                        },
                        "rnDvcWSJ3ASo3NLe1mg7": {
                            "opsi": "ESSAY",
                            "bobot": 0,
                            "total": 0,
                            "essay": []
                        },
                        "responden": 0,
                        "totalRespon": 0,
                        "ikm": 0.0,
                    }
                }

                if (trackerIdMahasiswaAndSurvey.hasOwnProperty(element.id_survei_mahasiswa)) {
                    if (trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].includes(element.id_mahasiswa)) {
                        // check the option and calculate ikm
                        let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                        currentOption["total"]++

                        if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                            if (element["essay"] !== undefined) {
                                currentOption["essay"].push(element["essay"])
                            }
                        } else {
                            temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                        }
                    } else {
                        trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].push(element.id_mahasiswa)
                        temp[element.id_dosen]["hasilRekap"]["responden"]++

                        let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                        currentOption["total"]++

                        if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                            if (element["essay"] !== undefined) {
                                currentOption["essay"].push(element["essay"])
                            }
                        } else {
                            temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                        }
                    }
                } else {
                    trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa] = [
                        element.id_mahasiswa
                    ]
                    temp[element.id_dosen]["hasilRekap"]["responden"]++

                    let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                    currentOption["total"]++

                    if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                        if (element["essay"] !== undefined) {
                            currentOption["essay"].push(element["essay"])
                        }
                    } else {
                        temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                    }
                }

            } else {
                if (trackerIdMahasiswaAndSurvey.hasOwnProperty(element.id_survei_mahasiswa)) {
                    if (trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].includes(element.id_mahasiswa)) {
                        // check the option and calculate ikm
                        let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                        currentOption["total"]++

                        if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                            if (element["essay"] !== undefined) {
                                currentOption["essay"].push(element["essay"])
                            }
                        } else {
                            temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                        }
                    } else {
                        trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].push(element.id_mahasiswa)
                        temp[element.id_dosen]["hasilRekap"]["responden"]++

                        let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                        currentOption["total"]++

                        if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                            if (element["essay"] !== undefined) {
                                currentOption["essay"].push(element["essay"])
                            }
                        } else {
                            temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                        }
                    }
                } else {
                    trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa] = [
                        element.id_mahasiswa
                    ]
                    temp[element.id_dosen]["hasilRekap"]["responden"]++

                    let currentOption = temp[element.id_dosen]["hasilRekap"][element.id_opsi]
                    currentOption["total"]++

                    if (element["id_opsi"] === "rnDvcWSJ3ASo3NLe1mg7") {
                        if (element["essay"] !== undefined) {
                            currentOption["essay"].push(element["essay"])
                        }
                    } else {
                        temp[element.id_dosen]["hasilRekap"]["totalRespon"]++
                    }
                }
            }
        });

        for (var prop in temp) {
            if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                temp[prop]["hasilRekap"]["ikm"] = this.parsingGlobalIkm(temp[prop]["hasilRekap"])
                finalRes.push(temp[prop])
            }
        }

        return finalRes
    },

    parsingSurveyRecapAlumni(result) {
        let temp = {
            "periode": "",
            "idSurveyAlumni": "",
            hasilRekap: {
                "dm0KtbQPdK0Pfazv8opf": {
                    "bobot": 1,
                    "opsi": "KURANG",
                    "total": 0,
                },
                "21craH0rvALjqlnwcOI6": {
                    "bobot": 2,
                    "opsi": "CUKUP",
                    "total": 0,
                },
                "6ULGZb5Vxwy9wdNNhYdc": {
                    "bobot": 3,
                    "opsi": "BAIK",
                    "total": 0,
                },
                "z5OHO3jjoYXq4GHXacIR": {
                    "opsi": "SANGAT BAIK",
                    "bobot": 4,
                    "total": 0,
                },
                "rnDvcWSJ3ASo3NLe1mg7": {
                    "opsi": "ESSAY",
                    "bobot": 0,
                    "total": 0,
                    "essay": []
                },
                "responden": 0,
                "totalRespon": 0,
                "ikm": 0.0
            }
        }
        let responden = {}

        result.forEach(e => {
            temp["periode"] = e["periode"]
            temp["idSurveyAlumni"] = e["id_survei_alumni"]

            const currentOption = e["id_opsi"]
            temp["hasilRekap"][currentOption]["total"] += 1

            if (currentOption === "rnDvcWSJ3ASo3NLe1mg7") {
                temp["hasilRekap"][currentOption]["essay"].push(e["essay"])
            } else {
                temp["hasilRekap"]["totalRespon"] += 1
            }

            const curretAlumniId = e["id_mahasiswa"]
            responden[curretAlumniId] = 1
        });

        for (var key in responden) {
            if (responden.hasOwnProperty(key)) {
                temp["hasilRekap"]["responden"]++
            }
        }

        temp["hasilRekap"]["ikm"] = this.parsingGlobalIkm(temp["hasilRekap"])

        return temp
    },

    parsingSurveyRecapDosen(result) {
        let temp = {
            "periode": "",
            "idSurveyDosen": "",
            hasilRekap: {
                "dm0KtbQPdK0Pfazv8opf": {
                    "bobot": 1,
                    "opsi": "KURANG",
                    "total": 0,
                },
                "21craH0rvALjqlnwcOI6": {
                    "bobot": 2,
                    "opsi": "CUKUP",
                    "total": 0,
                },
                "6ULGZb5Vxwy9wdNNhYdc": {
                    "bobot": 3,
                    "opsi": "BAIK",
                    "total": 0,
                },
                "z5OHO3jjoYXq4GHXacIR": {
                    "opsi": "SANGAT BAIK",
                    "bobot": 4,
                    "total": 0,
                },
                "rnDvcWSJ3ASo3NLe1mg7": {
                    "opsi": "ESSAY",
                    "bobot": 0,
                    "total": 0,
                    "essay": []
                },
                "responden": 0,
                "totalRespon": 0,
                "ikm": 0.0
            }
        }
        let responden = {}

        result.forEach(e => {
            temp["periode"] = e["periode"]
            temp["idSurveyDosen"] = e["id_survei_dosen"]

            const currentOption = e["id_opsi"]
            temp["hasilRekap"][currentOption]["total"] += 1


            if (currentOption === "rnDvcWSJ3ASo3NLe1mg7") {
                temp["hasilRekap"][currentOption]["essay"].push(e["essay"])
            } else {
                temp["hasilRekap"]["totalRespon"] += 1
            }

            const curretDosenId = e["id_dosen"]
            responden[curretDosenId] = 1
        });

        for (var key in responden) {
            if (responden.hasOwnProperty(key)) {
                temp["hasilRekap"]["responden"]++
            }
        }

        temp["hasilRekap"]["ikm"] = this.parsingGlobalIkm(temp["hasilRekap"])

        return temp
    },

    parsingSurveyRecap(result, role) {

        switch (role.toLowerCase()) {
            case "dosen":
                return this.parsingSurveyRecapDosen(result)
            case "alumni":
                return this.parsingSurveyRecapAlumni(result)
            default:
                return this.parsingSurveyRecapMhs(result)
        }

    },

    parsingErrorBulkInsert(role, id, err) {
        return `${role} dengan ${id} ${err["sqlMessage"].split(" ")[2]} sudah terdaftar`
    },

    generateAccessToken(payload) {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRED_TIME
        });
    },

    parsingSurveyRecapExcel(result) {
        let temp = {}
        let finalRes = []
        let trackerIdMahasiswaAndSurvey = {}

        result.forEach((element, index) => {
            if (!temp.hasOwnProperty(element.id_dosen)) {
                temp[element.id_dosen] = {
                    "No": index + 1,
                    "Nama Dosen": element.nama_dosen,
                    "Hasil Rekap": {
                        "KURANG": {
                            "bobot": 1,
                            "Total": 0,
                        },
                        "CUKUP": {
                            "bobot": 2,
                            "Total": 0,
                        },
                        "BAIK": {
                            "bobot": 3,
                            "Total": 0,
                        },
                        "SANGAT BAIK": {
                            "bobot": 4,
                            "Total": 0,
                        },
                        "Total Respon": 0,
                        "Responden": 0,
                        "IKM": 0.0,
                    }
                }

                if (trackerIdMahasiswaAndSurvey.hasOwnProperty(element.id_survei_mahasiswa)) {
                    if (trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].includes(element.id_mahasiswa)) {
                        // check the option and calculate ikm
                        let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]
                        currentOption["Total"]++
                        temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                    } else {
                        trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].push(element.id_mahasiswa)
                        temp[element.id_dosen]["Hasil Rekap"]["Responden"]++

                        let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]
                        currentOption["Total"]++
                        temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                    }
                } else {
                    trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa] = [
                        element.id_mahasiswa
                    ]
                    temp[element.id_dosen]["Hasil Rekap"]["Responden"]++
                    let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]

                    currentOption["Total"]++
                    temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                }

            } else {
                if (trackerIdMahasiswaAndSurvey.hasOwnProperty(element.id_survei_mahasiswa)) {
                    if (trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].includes(element.id_mahasiswa)) {
                        // check the option and calculate ikm
                        let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]
                        currentOption["Total"]++
                        temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                    } else {
                        trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa].push(element.id_mahasiswa)
                        temp[element.id_dosen]["Hasil Rekap"]["Responden"]++

                        let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]
                        currentOption["Total"]++
                        temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                    }
                } else {
                    trackerIdMahasiswaAndSurvey[element.id_survei_mahasiswa] = [
                        element.id_mahasiswa
                    ]
                    temp[element.id_dosen]["Hasil Rekap"]["Responden"]++

                    let currentOption = temp[element.id_dosen]["Hasil Rekap"][element.opsi]
                    currentOption["Total"]++
                    temp[element.id_dosen]["Hasil Rekap"]["Total Respon"]++
                }
            }
        });

        for (var prop in temp) {
            if (Object.prototype.hasOwnProperty.call(temp, prop)) {
                temp[prop]["Hasil Rekap"]["IKM"] = this.parsingGlobalIkmExcel(temp[prop]["Hasil Rekap"], temp[prop]["Hasil Rekap"]["Total Respon"])
                finalRes.push(temp[prop])
            }
        }

        return finalRes.sort((a, b) => a.No - b.No)
    },

    parsingGlobalIkmExcel(obj, totalRespon) {
        let total = 0.0
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                const point = parseFloat(obj[prop]["bobot"]) * parseFloat(obj[prop]["Total"]) / parseFloat(totalRespon)
                if (!isNaN(point)) {
                    const prevTotal = obj[prop]["Total"]
                    obj[prop] = prevTotal
                    total += point
                }
            }
        }

        return total
    },

    async getDownloadLink(json, fileName) {
        const stringJson = JSON.stringify(json)

        fs.writeFileSync(fileName, stringJson)
        const formData = new FormData();

        formData.append('inputTxt', stringJson);
        formData.append('1708311304', fs.createReadStream(fileName));
        formData.append('MultipleWorksheets', 'true');
        formData.append('UploadOptions', 'JSON');
        formData.append('outputType', 'XLSX');

        const response = await axios({
            method: 'post',
            url: 'https://api.products.aspose.app/cells/conversion/api/ConversionApi/Convert',
            data: formData,
            headers: {
                'accept': '*/*',
                'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': `multipart/form-data; boundary=${formData._boundary}`,
                'sec-ch-ua': '"Chromium";v="112", "Google Chrome";v="112", "Not:A-Brand";v="99"',
                'sec-ch-ua-mobile': '?1',
                'sec-ch-ua-platform': '"Android"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-site'
            },
            responseType: 'arraybuffer'
        });

        const j = JSON.parse(Buffer.from(response.data).toString());
        fs.unlinkSync(fileName)

        return this.downloadFilePath(j["FolderName"], fileName)
    },

    downloadFilePath(folder, file) {
        return `https://api.products.aspose.app/cells/conversion/api/Download/${folder}?file=${file}`
    },

    generateRecapFileName(startDate, endDate, role) {
        return `REKAP_SURVEI_${this.convertUnixTimeToLocalTime(startDate)}-${this.convertUnixTimeToLocalTime(endDate)}.xlsx`
    },

    convertUnixTimeToLocalTime(time) {
        const date = new Date(time * 1000); // convert to milliseconds
        const options = { timeZone: 'Asia/Jakarta' };
        const formattedDate = new Intl.DateTimeFormat('id-ID', options).format(date);
        return formattedDate.replace(/\//g, '-')
    }
}