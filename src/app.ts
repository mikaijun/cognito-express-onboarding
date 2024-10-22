import 'dotenv/config';
import express from 'express';
import AWS from 'aws-sdk';
import authRoutes from './routes/auth';

const app = express();

app.use(express.json());

// AWS SDKの設定
AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 認証ルートの設定
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
