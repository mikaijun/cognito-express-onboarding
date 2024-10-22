# 環境構築
```
npm install
```
# サーバー起動
```
npx ts-node src/app.ts
```
# 動作確認
### ユーザー登録
```
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username": "xxx@gmail.co.jp", "password": "xxxxxxxxx", "email": "xxx@gmail.co.jp"}'
```
### ユーザー認証
codeはユーザー登録時に入力したメールに記載されてます
```
curl -X POST http://localhost:3000/auth/confirm-signup \
  -H "Content-Type: application/json" \
  -d '{"username": "xxx@gmail.co.jp", "code": "123456"}'
```
### ログイン
```
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"username": "xxx@gmail.co.jp", "password": "xxxxxxxxx"}'
```

### 認証必要なAPIを実行する
```
curl -X GET http://localhost:3000/auth/protected \
  -H "Authorization: Bearer eyJraWQiOiJ..."
```

### ログアウト
```
curl -X POST http://localhost:3000/auth/logout \  
  -H "Authorization: Bearer eyJraWQiOiJ..."
```
