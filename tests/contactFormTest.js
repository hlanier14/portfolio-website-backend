const app = require('../index');
const request = require('supertest');
const { expect } = require('chai');

describe('POST /contact-form-submission', function() {

    it('should send an email with correct data', async function() {
        const testData = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            message: 'Hello, this is a test message.',
        };
    
        const response = await request(app)
            .post('/contact-form-submission')
            .send(testData)
            .expect(200);
    
        expect(response.text).to.equal('Email sent successfully');
    });

    it('should return an error message if request body is missing a required field', async function() {
        const testData = {
            name: 'John Doe',
            email: 'johndoe@example.com'
        };

        const response = await request(app)
            .post('/contact-form-submission')
            .send(testData)
            .expect(400);

        expect(response.text).to.equal('Missing required fields');
    });
  
});
