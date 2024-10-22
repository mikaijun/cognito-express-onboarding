import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import AWS from 'aws-sdk';

export interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  const cognito = new AWS.CognitoIdentityServiceProvider();

  if (!token) {
    res.status(401).json({ message: 'トークンが提供されていません' });
    return;
  }

  // Cognitoを使ってトークンの有効性を確認
  cognito.getUser({ AccessToken: token }, (err, data) => {
    if (err) {
      console.error('Cognito getUser error:', err);
      res.status(401).json({ message: 'トークンが無効です', error: err.message });
      return;
    }

    // ユーザー情報を`req.user`に格納して次のミドルウェアへ
    req.user = data;
    next();
  });
};
