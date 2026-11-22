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
const StudentProfile = require('../src/models/StudentProfile');
const ExchangeRequest = require('../src/models/ExchangeRequest');

jest.setTimeout(45000);

let mongoServer;
let studentToken;
let studentUserId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const regRes = await request(app).post('/api/auth/register').send({
    name: 'Test Student',
    email: 'tester@skillsync.edu',
    password: 'Password@123',
    college: 'DTU',
    department: 'CSE'
  });

  studentToken = regRes.body.token;
  studentUserId = regRes.body.user.id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Experiment 10: Black-Box Boundary & Equivalence Tests', () => {
  test('Skill Proficiency: 0 (Boundary Value Min - 1) returns 422', async () => {
    const res = await request(app)
      .post('/api/profiles/skills/teach')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        skillName: 'Go Programming',
        proficiencyLevel: 0
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('Skill Proficiency: 3 (Valid Equivalence Partition) returns 201', async () => {
    const res = await request(app)
      .post('/api/profiles/skills/teach')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        skillName: 'Go Programming',
        proficiencyLevel: 3,
        category: 'Programming & Tech'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  test('Skill Proficiency: 6 (Boundary Value Max + 1) returns 422', async () => {
    const res = await request(app)
      .post('/api/profiles/skills/teach')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        skillName: 'Rust Programming',
        proficiencyLevel: 6
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.success).toBe(false);
  });

  test('Prevent sending exchange request to oneself returns 400', async () => {
    const res = await request(app)
      .post('/api/requests')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        receiverId: studentUserId,
        offeredSkill: 'Go Programming',
        requestedSkill: 'Python'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
