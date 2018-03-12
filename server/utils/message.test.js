const expect = require('expect');

let {generateMessage, generateLocationMessage} = require('./message.js')
describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Jen';
        let text = 'some text'; 
        let createdAt = new Date().getTime();

        let message  = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct lacation object', () => {
        let from = 'Jeff';
        let latitude = 14;
        let longitude = 7;
        createdAt: new Date().getTime()

        let message = generateLocationMessage(from, latitude, longitude);
        expect(typeof message.createdAt).toBe('number');
        expect(typeof message.url).toBe('string');
        expect(message.url).toContain(14,7);

        expect(message).toMatchObject({from});
    });
});