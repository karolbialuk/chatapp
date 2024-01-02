import { db } from '../connect.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import emailValidator from 'email-validator'
import sharp from 'sharp'
import path from 'path'

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE email = ?'

  db.query(q, [req.body.email], (err, data) => {
    if (err) return res.status(500).json(err)

    const values = [req.body.email, req.body.password]

    if (values.includes(''))
      return res.status(500).json('Wypełnij wszystkie pola.')

    if (data.length === 0)
      return res
        .status(500)
        .json('Użytkownik o podanym adresie email nie istnieje.')

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    )

    if (!checkedPassword) return res.status(500).json('Nieprawidłowe hasło.')

    const token = jwt.sign({ id: data[0].id }, 'secretkey')

    const { password, ...others } = data[0]

    res
      .cookie('accessToken', token, { httpOnly: true })
      .status(200)
      .json(others)
  })
}

export const register = async (req, res) => {
  const q = 'SELECT * FROM users WHERE email = ?'
  try {
    db.query(q, [req.body.email], async (err, data) => {
      if (err) return res.status(401).json(err)
      if (data.length)
        return res.status(500).json('Użytkownik o podanym emailu już istnieje.')

      const salt = bcrypt.genSaltSync(10)

      const hashedPassword =
        req.body.password && bcrypt.hashSync(req.body.password, salt)

      const file = req.file
      let uploadedFileNames = []

      if (file) {
        const uniqueFileName =
          Date.now() + '-' + Math.round(Math.random() * 1e9)
        const upload = '../frontend/public/upload/'

        const highResFilePath =
          upload + uniqueFileName + '_high' + path.extname(file.originalname)
        await sharp(file.path).resize(600, 600).toFile(highResFilePath)

        const lowResFilePath =
          upload + uniqueFileName + '_low' + path.extname(file.originalname)
        await sharp(file.path).resize(250, 250).toFile(lowResFilePath)

        uploadedFileNames = [
          path.basename(highResFilePath),
          path.basename(lowResFilePath),
        ]
      }

      const q =
        'INSERT INTO users (`firstname`, `lastname`, `email`, `password` ,`gender`, `avatar`) VALUE (?)'

      const values = [
        req.body.firstname,
        req.body.lastname,
        req.body.email,
        hashedPassword,
        req.body.gender,
        file ? uploadedFileNames.join(',') : null,
      ]

      const validEmail = emailValidator.validate(req.body.email)

      if (values.includes(''))
        return res.status(500).json('Wypełnij wszystkie pola.')

      if (!validEmail)
        return res.status(500).json('Podano nieprawidłowy adres e-mail.')

      db.query(q, [values], (err, data) => {
        if (err) return res.status(401).json(err)

        return res.status(200).json('Pomyślnie utworzono konto.')
      })
    })
  } catch (err) {
    console.error(err)
  }
}

export const getUsers = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json(err)

    const q =
      'SELECT id, firstname, lastname, email, gender, avatar FROM users WHERE firstname LIKE ? OR lastname LIKE ?'

    db.query(
      q,
      [`%${req.query.searchValue}%`, `%${req.query.searchValue}%`],
      (err, data) => {
        if (err) return res.status(401).json(err)

        return res.status(200).json(data)
      },
    )
  })
}
