import * as chai from 'chai';
// @ts-ignorets-ignore
import chaiHttp = require('chai-http');
import { Response } from 'express';
import * as Sinon from 'sinon';
import { app } from '../app';
import Users from '../database/models/user';
import { IUser } from '../interfaces';
import LoginService from '../services/Login.service';

chai.use(chaiHttp);
const { expect } = chai;

const userMock: IUser = {
  id: 1,
  username: 'Simbad',
  role: 'conde',
  email: 'simbad@omarujo.com',
  password: 'vendetta'
}

const userLoginMock = {
  email: "user@user.com",
  password: "secret_user"
}

const tokenMock = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImVtYWlsIjoidXNlckB1c2VyLmNvbSIsInBhc3N3b3JkIjoic2VjcmV0X3VzZXIifSwiaWF0IjoxNjYzNDU5MjIwfQ.7IkzJvAyOPV9XJV4pTmE6rMTrczzQcoObvocWgGM3Ug'

const returnMock = {
  code: 200,
  token: tokenMock,
}

describe('Users', () => {
   describe('/login', () => {
    beforeEach(() => {
      Sinon.stub(LoginService, "login").resolves(returnMock)
    })

    afterEach(() => {
      Sinon.restore();
    })

    it('Should return status 200', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send(userLoginMock)
      
      expect(response.status).to.equal(200);
    })

    it('Should return token', async () => {
      const result = await chai.request(app)
        .post('/login')
        .send(userLoginMock)

        const token = result.body.token;

        expect(token).to.equal(tokenMock);
    })
  })

  describe('login erros', () => {
    it('Should return 400', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send({
          email: 'user@user.com'
        })
      console.log(response.body.message);
      
      expect(response.status).to.equal(400)
    })

    it('Should return the Bad Request message', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send({
          email: 'user@user.com'
        })
      const message = 'All fields must be filled'
      
      expect(response.body.message).to.equal(message)
    })
  })
})