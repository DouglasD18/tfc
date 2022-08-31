import * as chai from 'chai';
// @ts-ignorets-ignore
import chaiHttp = require('chai-http');
import Sinon from 'sinon';
import { app } from '../app';
import Users from '../database/models/user';
import { IUser } from '../interfaces';

chai.use(chaiHttp);
const { expect } = chai;

const userMock: IUser = {
  id: 1,
  username: 'Simbad',
  role: 'conde',
  email: 'simbad@omarujo.com',
  password: 'vendetta'
}

describe('Users', () => {
  describe('login', () => {
    beforeEach(() => Sinon.stub(Users, "findOne").resolves())

    afterEach(() => {
      Sinon.restore();
    })

    it('Should return status 200', async () => {
      const response = await chai.request(app)
        .post('/login')
        .send({
          email: "user@user.com",
          password: "secret_user"
        })
      
      expect(response.status).to.equal(200);
    })
  })

  describe('getRole', () => {
    afterEach(() => {
      Sinon.restore();
    })

    it('Should return status 200', async () => {
      
    })
  })
})