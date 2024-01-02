import express from 'express'
import { sendMessages, getMessages } from '../controllers/messages.js'

const router = express.Router()

router.post('/', sendMessages)
router.get('/', getMessages)

export default router
