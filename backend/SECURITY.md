# Security Considerations

## Password Hashing

This application uses SHA-256 for password hashing, which is **not recommended for production use**. 

### Current Implementation
- SHA-256 hash without salt
- Suitable only for local demo/development purposes

### Production Recommendations
For production use, replace the password hashing with:
- **bcrypt**: `npm install bcrypt` - Industry standard, slow by design
- **argon2**: `npm install argon2` - Winner of Password Hashing Competition
- **scrypt**: Built into Node.js crypto module with proper parameters

Example with bcrypt:
```javascript
import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

## Session Management

The current implementation uses:
- In-memory session storage (lost on server restart)
- Simple token generation with crypto.randomBytes

### Production Recommendations
- Use Redis or similar for session storage
- Implement token expiration
- Add refresh token mechanism
- Consider using JWT with proper signing
- Implement rate limiting for login attempts

## Data Storage

The application stores data in JSON files:
- `backend/data/users.json` - User credentials
- `backend/data/tasks.json` - Task data

### Production Recommendations
- Use a proper database (PostgreSQL, MongoDB, etc.)
- Implement database connection pooling
- Add backup mechanisms
- Encrypt sensitive data at rest

## General Security Best Practices

For production deployment, also consider:
1. **HTTPS**: Always use HTTPS in production
2. **CORS**: Configure CORS properly with specific origins
3. **Input Validation**: Add comprehensive input validation
4. **Rate Limiting**: Implement rate limiting on all endpoints
5. **Logging**: Add proper logging and monitoring
6. **Error Handling**: Don't expose sensitive information in error messages
7. **Dependencies**: Regularly update dependencies and scan for vulnerabilities
