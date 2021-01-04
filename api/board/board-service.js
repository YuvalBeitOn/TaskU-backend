const dbService = require('../../services/db.service');
const ObjectId = require('mongodb').ObjectId;
const socketService = require('../socket/socket-service');

module.exports = {
	query,
	getById,
	remove,
	update,
	add,
};

async function query(userId) {
	// console.log('******************** Board SERVICE: Loading boards to UserId:', userId, '********************');
	const collection = await dbService.getCollection('board');
	try {
		const boards = await collection.find({ members: { $elemMatch: { _id: userId } } }).toArray();
		return boards;
	} catch (err) {
		console.log('Board SERVICE: Cannot load boards.');
		throw err;
	}
}
//NOTE
async function getById(boardId) {
	const collection = await dbService.getCollection('board');
	try {
		const board = await collection.findOne({ _id: ObjectId(boardId) });
		return board;
	} catch (err) {
		console.log(`Board SERVICE - ERROR: while finding board ${boardId}`);
		throw err;
	}
}

async function remove(boardId) {
	const collection = await dbService.getCollection('board');
	try {
		await collection.deleteOne({ _id: ObjectId(boardId) });
	} catch (err) {
		console.log(`Board SERVICE - ERROR: cannot remove board ${boardId}`);
		throw err;
	}
}

async function update(board, actionUserId) {
	const collection = await dbService.getCollection('board');
	board._id = ObjectId(board._id);
	try {
		console.log('Board SERVICE: Attempting update...');
		await collection.replaceOne({ _id: board._id }, board);
		socketService.emitBoardUpdates(board, actionUserId);
		return board;
	} catch (err) {
		console.log(`Board SERVICE - ERROR: Cannot update board ${board._id}`);
		throw err;
	}
}

async function add(board) {
	const collection = await dbService.getCollection('board');
	try {
		await collection.insertOne(board);
		return board;
	} catch (err) {
		console.log(`Board SERVICE - ERROR: Cannot add board.`);
		throw err;
	}
}
