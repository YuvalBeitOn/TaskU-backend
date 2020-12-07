const userService = require('./user-service')
// const logger = require('../../services/logger.service')

async function getUser(req, res) {
    const user = await userService.getById(req.params.id)
    res.send(user)
}
  
async function getUsers(req, res) {
    // console.log(req.query);
    const users = await userService.query(req.query)
    // logger.debug(users);
    res.send(users)
}

async function deleteUser(req, res) {
    await userService.remove(req.params.id)
    res.end()
}

async function updateUser(req, res) {
    const user = req.body;
    // console.log('req body', req.body, '***************')
    await userService.update(user)
    res.send(user)
}

async function notifyUser(req, res) {
    const notif = req.body
    const toUserId = req.params.toUserId
    console.log('toUserId:', toUserId, 'Notify user User controller');
    await userService.notifyUser(notif)
    res.send(notif)
}

module.exports = {
    getUser,
    getUsers,
    deleteUser,
    updateUser,
    notifyUser
}