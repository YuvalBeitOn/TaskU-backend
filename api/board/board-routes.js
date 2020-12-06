const express = require('express')
const {requireAuth} = require('../../middlewares/requireAuth.middleware')
const { getBoard, getBoards, removeBoard, updateBoard, addBoard } = require('./board-controller')

const router = express.Router()


router.get('/', getBoards)
router.post('/', requireAuth,addBoard)
router.get('/:id', getBoard)
router.put('/:id', requireAuth,updateBoard)
router.delete('/:id', requireAuth,removeBoard)

module.exports = router