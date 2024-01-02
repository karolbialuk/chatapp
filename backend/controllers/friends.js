import { db } from '../connect.js'
import jwt from 'jsonwebtoken'
import lodash from 'lodash'

export const addFriend = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  const q =
    'SELECT * FROM friends WHERE idUser = ? AND idAddedFriend = ? OR idUser = ? AND idAddedFriend = ?'

  db.query(
    q,
    [
      req.body.idUser,
      req.body.idAddedFriend,
      req.idAddedFriend,
      req.body.idUser,
    ],
    (err, data) => {
      if (err) return res.status(401).json(err)

      if (data.length) return

      jwt.verify(token, 'secretkey', (err, userInfo) => {
        if (err) return res.status(401).json(err)

        const roomId = lodash.random(1, 1000)

        const q =
          'INSERT INTO friends(`idUser`,`idAddedFriend`,`accepted`, `room`) VALUES(?)'

        const values = [
          req.body.idUser,
          req.body.idAddedFriend,
          'false',
          roomId,
        ]

        db.query(q, [values], (err, data) => {
          if (err) return res.status(401).json(err)
          return res.status(200).json(data)
        })
      })
    },
  )
}

export const getFriends = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'SELECT u.id, f.id as friendRequestId, f.room, u.avatar as user_avatar, u2.avatar as addedFriend_avatar, u.firstname AS user_firstname, u.lastname AS user_lastname, u2.firstname AS addedFriend_firstname, u2.lastname AS addedFriend_lastname, idAddedFriend, accepted, MAX(m.messages) as last_messages FROM friends as f JOIN users u ON u.id = f.idUser JOIN users u2 ON u2.id = f.idAddedFriend LEFT JOIN messages AS m ON (f.idUser = m.user1Id AND f.idAddedFriend = m.user2Id) OR (f.idUser = m.user2Id AND f.idAddedFriend = m.user1Id) WHERE f.idUser = ? OR f.idAddedFriend = ? GROUP BY f.id, u.id, u2.id'

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json(data)
    })
  })
}

export const acceptRequestFriend = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'UPDATE friends SET accepted = "true" WHERE id = ?'

    db.query(q, [req.body.friendRequestId], (err, data) => {
      if (err) return res.status(401).json(err)

      return res.status(200).json(data)
    })
  })
}

export const cancelRequestFriend = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q = 'DELETE FROM friends WHERE id = ?'
    db.query(q, [req.body.friendRequestId], (err, data) => {
      if (err) return res.status(401).json(err)
      return res.status(200).json(data)
    })
  })
}
