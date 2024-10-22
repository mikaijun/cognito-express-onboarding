import express from 'express';
import { signUp, confirmSignUp, signIn } from '../controllers/authController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signUp);
router.post('/confirm-signup', confirmSignUp);
router.post('/signin', signIn);
router.get('/protected', verifyToken, (req, res) => {
  // @ts-ignore
  res.status(200).json({ message: '保護されたルートにアクセスできました', user: req.user });
});

export default router;
