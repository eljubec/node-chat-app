const expect = require('expect');
const {Users} = require('./users');

describe('Users', () => {
    let users;
    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'John',
            room: 'ptm'
        }, {
            id: '2',
            name: 'Peter',
            room: 'mscrm'
        }, {
            id: '3',
            name: 'James',
            room: 'ptm'
        }];
    });

    it('should add a new user', () => {
        let users = new Users();
        let user = {
            id: '123',
            name: 'Elias',
            room: 'ptm'
        };
        let resUser = users.addUser(user.id, user.name, user.room);

        expect(users.users).toEqual([user]);
    });

    it('should return names for ptm', () => {
        let userList = users.getUserList('ptm');
        expect(userList).toEqual(['John', 'James']);
    });

    it('should return names for mscrm', () => {
        let userList = users.getUserList('mscrm');

        expect(userList).toEqual(['Peter']);
    });

    it('should remove a user', () => {
        let userId = '1'
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2)

    });

    it('should not remove user', () => {
        let userId = '81'
        let user = users.removeUser(userId);

        expect(user).toBeFalsy();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '2';
        let user = users.getUser(userId)

        expect(user.id).toBe(userId)
    })

    it('should not find user', () => {
        let userId = '72';
        let user = users.getUser(userId);

        expect(user).toBeFalsy();
    })
});