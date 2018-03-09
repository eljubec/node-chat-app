const expect = require('expect');

let {genereateMessage} = require('./message.js')
describe('generateMessage', () => {
    it('should generate correct message object', () => {
        let from = 'Jen';
        let text = 'some text'; 
        let createdAt = new Date().getTime();

        let message  = genereateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        expect(message).toMatchObject({from, text});
    });
});