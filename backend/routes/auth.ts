import express from 'express'
import passport from 'passport'

const router = express.Router()

// GitHub authentication routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }))

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect to frontend
    res.redirect('http://localhost:3000/Hero')
  }
)

export default router
