import express from 'express';
import { Response } from 'express';
import { signUp, confirmSignUp, signIn, logout } from '../controllers/authController';
import { AuthenticatedRequest, verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/signup', signUp);
router.post('/confirm-signup', confirmSignUp);
router.post('/signin', signIn);
router.post('/logout', logout)
router.get('/protected', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({ message: '保護されたルートにアクセスできました', user: req.user });
});

export default router;
