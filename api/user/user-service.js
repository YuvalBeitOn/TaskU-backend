const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const socketService = require('../socket/socket-service')
module.exports = {
	query,
	getById,
	getByEmail,
	remove,
	update,
	add,
	notifyUser
}

async function query(filterBy = {}) {
	// const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('user');
	try {
		const users = await collection.find().toArray();
		users.forEach((user) => delete user.password);

		return users;
	} catch (err) {
		console.log('ERROR: cannot find users')
		throw err;
	}
}

async function getById(userId) {
	const collection = await dbService.getCollection('user');
	try {
		const user = await collection.findOne({ _id: ObjectId(userId) });
		delete user.password;
		return user;
	} catch (err) {
		console.log(`ERROR: while finding user ${userId}`)
		throw err;
	}
}
async function getByEmail(email) {
	const collection = await dbService.getCollection('user');
	try {
		const user = await collection.findOne({ email });
		return user;
	} catch (err) {
		console.log(`ERROR: while finding user ${email}`)
		throw err;
	}
}

async function remove(userId) {
	const collection = await dbService.getCollection('user');
	try {
		await collection.deleteOne({ _id: ObjectId(userId) });
	} catch (err) {
		console.log(`ERROR: cannot remove user ${userId}`)
		throw err;
	}
}

async function update(user) {
	const collection = await dbService.getCollection('user');
	user._id = ObjectId(user._id);
	console.log('user before update in service:', user);
	try {
        await collection.updateOne({ _id: user._id }, { $set: user })
		return user;
	} catch (err) {
		console.log(`ERROR: cannot update user ${user._id}`)
		throw err;
	}
}

async function add(user) {
	user.notifications = [];
	const collection = await dbService.getCollection('user')
	try {
		await collection.insertOne(user);
		return user;
	} catch (err) {
		console.log(`ERROR: cannot insert user`)
		throw err;
	}
}

async function notifyUser(notif) {
	console.log('notif in notifyUser in service', notif);
	try {
		const user = await getById(notif.toUserId)
		user.notifications.unshift(notif)
		await update(user)
		socketService.insertUserNotif(notif)
	} catch (err) {
		throw err
	}
}
