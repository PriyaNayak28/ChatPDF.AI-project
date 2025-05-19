// routes/pdfRoutes.ts
import express from 'express'
import multer from 'multer'
import { storage } from '../util/cloudinary'
import { authenticate } from '../middleware/auth'
import { uploadPDF, getUserPDFs, getPDFById } from '../controllers/pdf'

const router = express.Router()
const upload = multer({ storage })

function asyncHandler(fn: any) {
  return function (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

router.post(
  '/upload',
  authenticate,
  upload.single('pdf'),
  asyncHandler(uploadPDF)
)
router.get('/pdfs', authenticate, asyncHandler(getUserPDFs))
router.get('/pdf/:id', authenticate, asyncHandler(getPDFById))

export default router
