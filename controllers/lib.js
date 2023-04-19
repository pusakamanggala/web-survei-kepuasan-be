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

    getCurrentUnixTimeStamp(date) {
        return Math.floor(Date.now() / 1000);
    },

    generateBulkQueryAddMahasiswaToKelas(idKelas, idMahasiswa) {
        let query = "INSERT INTO kontrak_matkul (id_kontrak, id_kelas, id_mahasiswa) VALUES "
        idMahasiswa.forEach((element, index) => {
            const value = (index === idMahasiswa.length - 1) ? `('${this.generateRandomString(20)}', '${idKelas}', '${element}')` : `('${this.generateRandomString(20)}', '${idKelas}', '${element}'), `
            query += value
        })

        return query
    },

    // {
    //     id_kelas: 'aJ99r6nBzJY190j1c5nO',
    //     nama_kelas: 'Kalkulus - A',
    //     nama_dosen: 'karina',
    //     start_date: 1681895016,
    //     end_date: 1689732350,
    //     id_matkul: 'Qs9OPwh1jusKxMdIdw7K',
    //     nama_matkul: 'Kalkulus',
    //     nim: '192837',
    //     nama: 'roni'
    //   }

    parsingGetKelasQueryResult(result) {

        let obj = {
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

        return obj
    }
}