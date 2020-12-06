const bcrypt = require('bcryptjs');
const userService = require('../user/user-service');
// const logger = require('../../services/logger.service');

//TaskU BackEnd: bCrypt encryption salt rounds count;
const saltRounds = 10;

async function login(email, password) {
	console.log('email, password:', email, password);
	// logger.debug(`Authentication SERVICE: Login with email: ${email}`);
	if (!email || !password) throw new Error('Email and Password are required!');
	const user = await userService.getByEmail(email);
	if (!user) return Promise.reject('Invalid email or password');
	const match = await bcrypt.compare(password, user.password);
	if (!match) return Promise.reject('Invalid email or password');
	delete user.password;
	return user;
}

async function signup(email, password, fullName, isAdmin) {
	// logger.debug(`Authentication SERVICE: Signup with email: ${email}, fullName: ${fullName}`);
	if (!email || !password || !fullName) return Promise.reject('email, fullName and password are required!');

	const hash = await bcrypt.hash(password, saltRounds);
	return userService.add({ email, password: hash, fullName, isAdmin });
}

module.exports = {
	signup,
	login,
};
