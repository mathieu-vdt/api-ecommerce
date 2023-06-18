const express = require('express')
const { getAll, getById,getAllByUserId, add, modif, del } = require('../controller/product')
const tokenVerif = require('../middleware/tokenVerif')

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getById)
router.get('/ByUserId/:user_id', getAllByUserId)
router.post('/', tokenVerif, add)
router.put('/:id', tokenVerif, modif)
router.delete('/:id', tokenVerif, del)


module.exports = router