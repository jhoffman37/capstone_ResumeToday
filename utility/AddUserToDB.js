require('dotenv').config({ path: '../.env' });
const Data = require('../src/data/index.ts')
const { genSalt, hash } = require('bcrypt-ts');

const process_args = function() {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
        console.log('Usage: node addUserToDB.js <username> <password> <name>');
        process.exit(1);
    }
    return {
        username: args[0],
        password: args[1],
        name: args[2]
    }
}

const main = async function() {
    const user = process_args();
    const salt = await genSalt(10);
    const passwordHash = await hash(user.password, salt);
    const result = await Data.Users.insertNewUser(user.name, user.username, passwordHash, salt);

    if (result) {
        console.log(`User ${result.username} added to database`);
    } else {
        console.log(`Error adding user ${user.username} to database`);
    }
}
