import express from 'express'
import { authenticate } from '../middleware/auth'
import purchaseController from '../controllers/premium'

const router = express.Router()

router.get(
  '/premiummembership',
  authenticate,
  purchaseController.purchasepremium
)
router.post(
  '/updatetransactionstatus',
  authenticate,
  purchaseController.updateTransactionStatus
)

export default router
