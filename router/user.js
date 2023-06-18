const express = require('express')
const { getAll, getByToken,del, changePassword, inscription, connexion } = require('../controller/user')


const router = express.Router()

router.get('/', getAll)
router.post('/info', getByToken)
router.post('/delete/:id', del)
router.post('/change_password/', changePassword)
router.post('/inscription', inscription)
router.post('/connexion', connexion)


module.exports = router