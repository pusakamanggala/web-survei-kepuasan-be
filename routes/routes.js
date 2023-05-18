require('dotenv').config();
const jwt = require('jsonwebtoken');
const router = require('express').Router();
const { survei, middleware } = require('../controllers');
const multer = require('multer')
const fs = require('fs')

var upload = multer({ dest: "uploads/" })

const ALL_ROLE = ['ADMIN', 'MAHASISWA', 'DOSEN', 'ALUMNI']
const ONLY_ADMIN = ['ADMIN']
const ONLY_MAHASISWA = ['ADMIN', 'MAHASISWA']
const ONLY_DOSEN = ['ADMIN', 'DOSEN']
const ONLY_ALUMNI = ['ADMIN', 'ALUMNI']

router.post('/login/:role', survei.login)

router.get('/dosen/suggest', middleware(ONLY_ADMIN), survei.getDosenWithSuggest) // get dosen with suggest ?query=
router.get('/dosen/:id', middleware(ONLY_DOSEN), survei.getDosenById) // get dosen by id
router.get('/dosen', middleware(ONLY_ADMIN), survei.getAllDosen) // get all dosen 
router.post('/dosen/bulk', middleware(ONLY_ADMIN), upload.single('file'), survei.bulkInsertDosen)
router.post('/dosen', middleware(ONLY_ADMIN), survei.newDosen) // new dosen
router.put('/dosen/:id', middleware(ONLY_ADMIN), survei.updateDosen)

router.get('/mahasiswa/suggest', middleware(ONLY_ADMIN), survei.getMahasiswaWithSuggest) // get mahasiswa with suggest ?query=
router.get('/mahasiswa/:id', middleware(ONLY_MAHASISWA), survei.getMahasiswaById) // get mahasiswa by id
router.get('/mahasiswa', middleware(ONLY_ADMIN), survei.getAllMahasiswa) // &sortBy=angkatan/semester&orderBy=asc/desc
router.post('/mahasiswa/bulk', middleware(ONLY_ADMIN), upload.single('file'), survei.bulkInsertMahasiswa)
router.post('/mahasiswa', middleware(ONLY_ADMIN), survei.newMahasiswa) // new mahasiswa
router.put('/mahasiswa/:id', middleware(ONLY_ADMIN), survei.updateMahasiswa)

router.get('/alumni/suggest', middleware(ONLY_ADMIN), survei.getAlumniWithSuggest) // get alumni with suggest ?query=
router.get('/alumni/:id', middleware(ONLY_ALUMNI), survei.getAlumniById) // get mahasiswa by id
router.get('/alumni', middleware(ONLY_ADMIN), survei.getAllAlumni) // &sortBy=angkatan/semester&orderBy=asc/desc
router.post('/alumni/bulk', middleware(ONLY_ADMIN), upload.single('file'), survei.bulkInsertAlumni)
router.post('/alumni', middleware(ONLY_ADMIN), survei.newAlumni) // new alumni 
router.put('/alumni/:id', middleware(ONLY_ADMIN), survei.updateAlumni)

router.post('/matkul', middleware(ONLY_ADMIN), survei.newMatkul)
router.post('/kelas', middleware(ONLY_ADMIN), survei.newKelas)
router.post('/insert-mahasiswa', middleware(ONLY_ADMIN), survei.addMahasiswaToKelas) // add mahasiswa ke kelas

router.get('/kelas/suggest', middleware(ONLY_ADMIN), survei.getKelasWithSuggest)
router.get('/kelas/:id', middleware(ONLY_ADMIN), survei.getKelasWithId) // detail kelas (mahasiwa, dosen, matkul)
router.get('/kelas', middleware(ONLY_ADMIN), survei.getAllKelas)

router.get('/matkul/suggest', middleware(ONLY_ADMIN), survei.getMatkulWithSuggest)

router.get(`/total-record`, middleware(ONLY_ADMIN), survei.getTotalRecord) // get total record from dosen / mahasiswa / alumni with query ?entity=

// get real time available survei, this endpoint will get data from db based on current date
// for example now is june 3 2024. The endpoint will try to query data from db from now until 3 week later (now + 3 week / 21 day)
// so it will query from available survei from june 3 until june 24
router.get('/survey', middleware(ALL_ROLE), survei.getSurvey) // ?role=mahasiswa/dosen/alumni
router.post('/questions', middleware(ONLY_ADMIN), survei.newSurveyQuestion) // create new survey question
router.post('/survey', middleware(ONLY_ADMIN), survei.newSurvey)
router.post('/survey-template', middleware(ONLY_ADMIN), survei.newTemplateSurvey)
router.get('/question/suggest', middleware(ONLY_ADMIN), survei.getQuestionWithSuggest) // get question suggestion with query param ?query=
router.get('/survey-template', middleware(ONLY_ADMIN), survei.getSurveyTemplate) // get survey template with query param ?entity=mahasiswa/dosen/alumni

router.post('/fill-survey/:role', middleware(ALL_ROLE), survei.fillSurvey)

// get history survey dosen/mahasiswa/dosen
router.get('/history/survey/:role', middleware(ALL_ROLE), survei.getHistorySurvey) // /history/survey/mahasiswa?id=${user_id}
// get all survei with that id and calculate ikm
// total kurang, cukup, baik, sangat baik
// ikm
// total responden
router.get('/statistic/survey/:role', middleware(ALL_ROLE), survei.getStatisticSurvey) // /statistic/survey/mahasiswa?id=${survei_id}

// get rekap, nama dosen semuanya per tanggal, ikm, total per opsi/bobot
router.get('/recap/survey/excel', middleware(ONLY_ADMIN), survei.getSurveyRecapExcel)
router.get('/recap/survey', middleware(ONLY_ADMIN), survei.getSurveyRecap) // /recap/survey?startDate=120380312&endDate=123213
router.delete('/remove-student', middleware(ONLY_ADMIN), survei.removeStudentFromClass) // /remove-mahasiswa?nim=123123&classId=1230823

module.exports = router;

