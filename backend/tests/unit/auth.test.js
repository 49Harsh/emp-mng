const { hashPassword, comparePassword } = require('../../src/utils/hashPassword');
const { generateAccessToken, verifyAccessToken } = require('../../src/utils/generateToken');

// Stub env before importing generateToken
process.env.JWT_SECRET = 'test_secret_key';
process.env.JWT_EXPIRES_IN = '15m';
process.env.JWT_REFRESH_SECRET = 'test_refresh_secret';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

describe('hashPassword util', () => {
  it('should hash a password', async () => {
    const hash = await hashPassword('password123');
    expect(hash).toBeDefined();
    expect(hash).not.toBe('password123');
  });

  it('should return true for matching password', async () => {
    const hash = await hashPassword('password123');
    const match = await comparePassword('password123', hash);
    expect(match).toBe(true);
  });

  it('should return false for non-matching password', async () => {
    const hash = await hashPassword('password123');
    const match = await comparePassword('wrongpassword', hash);
    expect(match).toBe(false);
  });
});

describe('generateToken util', () => {
  const payload = { userId: 'abc123', role: 'employee', email: 'test@test.com' };

  it('should generate a valid access token', () => {
    const token = generateAccessToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid access token', () => {
    const token = generateAccessToken(payload);
    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('should throw for an invalid token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });
});
