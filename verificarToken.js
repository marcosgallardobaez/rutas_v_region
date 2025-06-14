import 'dotenv/config';
import jwt from 'jsonwebtoken';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiaWF0IjoxNzQ4MDU5NDcxLCJleHAiOjE3NDgxNDU4NzF9.cdTVLjgKVBYjG9DpZUuMcYmDyWbFQuHtfkmlm2pI2ks';
const secret = process.env.JWT_SECRET;

try {
  const decoded = jwt.verify(token, secret);
  console.log('✅ Token válido:');
  console.log(decoded);
} catch (err) {
  console.error('❌ Token inválido:');
  console.error(err.message);
}
