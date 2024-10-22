import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwksClient, { SigningKey } from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`
});

interface AuthenticatedRequest extends Request {
  user?: string | JwtPayload;
}

function getKey(header: jwt.JwtHeader, callback: (error: Error | null, signingKey?: string) => void) {
  client.getSigningKey(header.kid!, (err, key) => {
    if (err) {
      console.error('Error getting signing key:', err);
      callback(err);
      return;
    }

    const signingKey = (key as SigningKey).getPublicKey();
    console.log('Using signing key:', signingKey);
    callback(null, signingKey);
  });
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'トークンが提供されていません' });
    return
  }

  jwt.verify(token, getKey, {
    issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`
  }, (err, decoded) => {
    if (err) {
      res.status(401).json({ message: '無効なトークンです', error: err.message });
      return;
    }

    req.user = decoded;
    next();
  });
};
