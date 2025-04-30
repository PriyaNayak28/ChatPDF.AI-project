import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
)

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5000/Hero')
  }
)

export default router
