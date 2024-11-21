import AWS from 'aws-sdk';
import crypto from 'crypto';
import { Request, Response } from 'express';

const cognito = new AWS.CognitoIdentityServiceProvider();
const clientId = process.env.COGNITO_CLIENT_ID as string;
const clientSecret = process.env.COGNITO_CLIENT_SECRET as string;

const generateSecretHash = (username: string): string => {
  return crypto
    .createHmac('SHA256', clientSecret)
    .update(username + clientId)
    .digest('base64');
};

export const signUp = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  const params = {
    ClientId: clientId,
    Username: username,
    Password: password,
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
    ],
    SecretHash: generateSecretHash(username),
  };

  try {
    const data = await cognito.signUp(params).promise();
    res.status(200).json({ message: 'ユーザー登録が成功しました', data });
  } catch (error) {
    res.status(400).json({ message: 'ユーザー登録に失敗しました', error });
  }
};

export const confirmSignUp = async (req: Request, res: Response) => {
  const { username, code } = req.body;

  const params = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
    SecretHash: generateSecretHash(username),
  };

  try {
    const data = await cognito.confirmSignUp(params).promise();
    res.status(200).json({ message: 'ユーザー確認が成功しました', data });
  } catch (error) {
    res.status(400).json({ message: 'ユーザー確認に失敗しました', error });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const params = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: generateSecretHash(username),
    },
  };

  try {
    const data = await cognito.initiateAuth(params).promise();
    res.status(200).json({ message: 'サインインが成功しました', data });
  } catch (error) {
    res.status(400).json({ message: 'サインインに失敗しました', error });
  }
};

export const logout = async (req: Request, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'トークンが提供されていません' });
    return;
  }

  const params = {
    AccessToken: token,
  };

  try {
    await cognito.globalSignOut(params).promise();
    res.status(200).json({ message: 'ログアウトが成功しました' });
  } catch (error) {
    res.status(400).json({ message: 'ログアウトに失敗しました', error });
  }
};
