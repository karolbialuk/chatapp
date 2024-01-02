import { db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const sendMessages = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'INSERT INTO messages(`user1Id`, `user2Id`, `roomId`, `messages`) values(?)'

    const values = [
      req.body.user1Id,
      req.body.user2Id,
      req.body.Room,
      req.body.messagesString,
    ]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json(req.body.messagesString)
    })
  })
}

// PIERWSZA WERSJA

// export const getMessages = (req, res) => {
//   const token = req.cookies.accessToken
//   if (!token) return res.status(401).json('Nie jesteś zalogowany')

//   jwt.verify(token, 'secretkey', (err, userInfo) => {
//     if (err) return res.status(401).json(err)

//     const q = 'SELECT * FROM messages WHERE roomId = ? OR roomId = ?'

//     let reverseRoomId = req.query.roomId.toString().split('').reverse().join('')

//     db.query(q, [req.query.roomId, reverseRoomId], (err, data) => {
//       if (err) return res.status(401).json(err)
//       return res.status(200).json(data)
//     })
//   })
// }
export const getMessages = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const user1Id = req.query.user1Id //12
    const user2Id = req.query.user2Id //4

    const q =
      'SELECT * FROM messages WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)'

    db.query(q, [user1Id, user2Id, user2Id, user1Id], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json(data)
    })
  })
}

// export const getLastMessage = (req, res) => {
//   const token = req.cookies.accessToken;
//   if (!token) return res.status(401).json('Nie jesteś zalogowany')

//   jwt.verify(token, 'secretkey', (err, userInfo) => {
//     if(err) return res.status(401).json(err)
//   })
// }
