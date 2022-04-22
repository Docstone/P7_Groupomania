const { User , Post } = require('../models')


function canDeletePost(user, post) {
    User.findOne({where: {uuid : user} })
    return (
        user.rank === "admin" ||
        post.user.uuid === user.uuid
      )
}

function authDeletePost(req, res, next) {
    if (!canDeletePost(req.auth.userId, req.params.uuid)) {
      res.status(401)
      return res.send('Not Allowed')
    }
  
    next()
  }

function canDeleteUser(user) {
    return (
        user.rank === "admin" ||
        user.uuid === user.uuid
      )
}

module.exports = {
  authDeletePost,
  canDeleteUser
}