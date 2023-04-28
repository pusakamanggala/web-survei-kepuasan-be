require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { survei } = require('../controllers');
const multer = require('multer')
const fs = require('fs')

function authenticateAccessToken(req, res, next) {
    // parse token
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[2];

    if (token == null) res.json({
        message: "Invalid access token"
    });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        (err) ? res.json({
            message: err
        }) : next();
    });
};

var upload = multer({ dest: "uploads/" })

router.get('/dosen/suggest', survei.getDosenWithSuggest) // get dosen with suggest ?query=
router.get('/dosen/:id', survei.getDosenById) // get dosen by id
router.get('/dosen', survei.getAllDosen) // get all dosen 
router.post('/dosen/bulk', upload.single('file'), survei.bulkInsertDosen)
router.post('/dosen', survei.newDosen) // new dosen

router.get('/mahasiswa/suggest', survei.getMahasiswaWithSuggest) // get mahasiswa with suggest ?query=
router.get('/mahasiswa/:id', survei.getMahasiswaById) // get mahasiswa by id
router.get('/mahasiswa', survei.getAllMahasiswa) // &sortBy=angkatan/semester&orderBy=asc/desc
router.post('/mahasiswa/bulk', upload.single('file'), survei.bulkInsertMahasiswa)
router.post('/mahasiswa', survei.newMahasiswa) // new mahasiswa

router.get('/alumni/suggest', survei.getAlumniWithSuggest) // get alumni with suggest ?query=
router.get('/alumni/:id', survei.getAlumniById) // get mahasiswa by id
router.get('/alumni', survei.getAllAlumni) // &sortBy=angkatan/semester&orderBy=asc/desc
router.post('/alumni/bulk', upload.single('file'), survei.bulkInsertAlumni)
router.post('/alumni', survei.newAlumni) // new alumni 

router.post('/matkul', survei.newMatkul)
router.post('/kelas', survei.newKelas)
router.post('/insert-mahasiswa', survei.addMahasiswaToKelas) // add mahasiswa ke kelas

router.get('/kelas/suggest', survei.getKelasWithSuggest)
router.get('/kelas/:id', survei.getKelasWithId) // detail kelas (mahasiwa, dosen, matkul)
router.get('/kelas', survei.getAllKelas)

router.get('/matkul/suggest', survei.getMatkulWithSuggest)

router.get(`/total-record`, survei.getTotalRecord) // get total record from dosen / mahasiswa / alumni with query ?entity=

// get real time available survei, this endpoint will get data from db based on current date
// for example now is june 3 2024. The endpoint will try to query data from db from now until 3 week later (now + 3 week / 21 day)
// so it will query from available survei from june 3 until june 24
router.get('/survey', survei.getSurvey) // ?role=mahasiswa/dosen/alumni
router.post('/questions', survei.newSurveyQuestion) // create new survey question
router.post('/survey', survei.newSurvey)
router.post('/survey-template', survei.newTemplateSurvey)
router.get('/question/suggest', survei.getQuestionWithSuggest) // get question suggestion with query param ?query=
router.get('/survey-template', survei.getSurveyTemplate) // get survey template with query param ?entity=mahasiswa/dosen/alumni

router.post('/fill-survey/:role', survei.fillSurvey)

module.exports = router;

