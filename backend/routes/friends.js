import express from 'express'
import {
  addFriend,
  getFriends,
  acceptRequestFriend,
  cancelRequestFriend,
} from '../controllers/friends.js'

const router = express.Router()

router.post('/', addFriend)
router.post('/accept', acceptRequestFriend)
router.post('/cancel', cancelRequestFriend)
router.get('/', getFriends)

export default router
