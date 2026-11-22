const request = require('supertest');
const mongoose = require('mongoose');
const fs = require('fs');

const localMongod = 'C:\\Program Files\\MongoDB\\Server\\8.3\\bin\\mongod.exe';
if (fs.existsSync(localMongod)) {
  process.env.MONGOMS_SYSTEM_BINARY = localMongod;
}

const { MongoMemoryServer } = require('mongodb-memory-server');
const { app } = require('../src/server');
const User = require('../src/models/User');

jest.setTimeout(45000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Experiment 10: White-Box Testing - authController.login() CFG Branches', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test('CFG Branch 1: Non-existent user email (!user) returns 401', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@skillsync.edu',
      password: 'SomePassword@123'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid/i);
  });

  test('CFG Branch 2: Account locked after 5 consecutive failed attempts (failedLoginAttempts >= 5) returns 423', async () => {
    const user = await User.create({
      name: 'Locked Student',
      email: 'locked@skillsync.edu',
      password: 'CorrectPassword@123',
      isVerified: true,
      failedLoginAttempts: 5,
      isLocked: true
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'locked@skillsync.edu',
      password: 'CorrectPassword@123'
    });

    expect(res.statusCode).toBe(423);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/locked/i);
  });

  test('CFG Branch 3: Unverified email account (!isVerified) returns 403', async () => {
    await User.create({
      name: 'Unverified Student',
      email: 'unverified@skillsync.edu',
      password: 'CorrectPassword@123',
      isVerified: false
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'unverified@skillsync.edu',
      password: 'CorrectPassword@123'
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/not verified/i);
  });

  test('CFG Branch 4: Suspended account (isSuspended = true) returns 403', async () => {
    await User.create({
      name: 'Suspended Student',
      email: 'suspended@skillsync.edu',
      password: 'CorrectPassword@123',
      isVerified: true,
      isSuspended: true
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'suspended@skillsync.edu',
      password: 'CorrectPassword@123'
    });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/suspended/i);
  });

  test('CFG Branch 5: Incorrect password (!isMatch) increments failedLoginAttempts and returns 401', async () => {
    await User.create({
      name: 'Regular Student',
      email: 'student@skillsync.edu',
      password: 'CorrectPassword@123',
      isVerified: true
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'student@skillsync.edu',
      password: 'WrongPassword'
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);

    const updatedUser = await User.findOne({ email: 'student@skillsync.edu' });
    expect(updatedUser.failedLoginAttempts).toBe(1);
  });

  test('CFG Branch 6: Valid credentials login returns 200, JWT token, and resets failure count', async () => {
    await User.create({
      name: 'Valid Student',
      email: 'valid@skillsync.edu',
      password: 'CorrectPassword@123',
      isVerified: true,
      failedLoginAttempts: 2
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'valid@skillsync.edu',
      password: 'CorrectPassword@123'
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();

    const updatedUser = await User.findOne({ email: 'valid@skillsync.edu' });
    expect(updatedUser.failedLoginAttempts).toBe(0);
    expect(updatedUser.lastLogin).toBeDefined();
  });
});
