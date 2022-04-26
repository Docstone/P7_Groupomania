const { User } = require('../models')

const authRank =  (permissions) => {
  return async (req, res, next) => { 
    const userId = req.get('auth')
    const uuid = req.params.uuid
    try{
      if( !uuid|| uuid === undefined){
        res.status(401).json("requette non autorisée")
      }
      const user = await User.findOne({ where: { uuid: userId } })
      if (permissions.includes(user.rank) || userId === uuid){
        next() 
      }else { 
        return res.status(401).json("Vous n'avez pas les permissions")
      }
    }catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Une erreur est survenue' })
    }
  } 
}

module.exports = { authRank }
