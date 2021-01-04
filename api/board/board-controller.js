const boardService = require('./board-service');
// const logger = require('../../services/logger.service');

async function getBoard(req, res) {
  const board = await boardService.getById(req.params.id);
  // console.log('board:', board);
  res.send(board);
}

async function getBoards(req, res) {
  const boards = await boardService.query(req.query.userId);
  // logger.debug(boards);
  res.send(boards);
}

async function removeBoard(req, res) {
  await boardService.remove(req.params.id);
  res.end();
}

async function updateBoard(req, res) {
  const actionUserId = req.session.user._id
  const board = req.body;
  await boardService.update(board, actionUserId);
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.send(board);
}

async function addBoard(req, res) {
  // console.log('Controller got the board!! ********', req.body)
  const board = req.body;
  await boardService.add(board);
  res.send(board);
}

module.exports = {
  addBoard,
  getBoard,
  getBoards,
  removeBoard,
  updateBoard,
};
