const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    const { firstName, lastName, email, rank } = req.body
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = User.create({
            email,
            firstName,
            lastName,
            rank,
            password: hash,
        })
        .then(()=> res.status(201).json({ message: 'nouvel utilisateur ajouté !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch( error => res.status(500).json({ error }));
};

exports.login = ( req, res, next) => {
    User.findOne({ where: { email: req.body.email } })
    .then( user => {
        if(!user) {
            return res.status(401)({ msg: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)
            .then( valid => {
                if (!valid) {
                    return res.status(401)({ msg: 'Mot de passe non valide !'})
                }
                res.status(200).json({
                    userId: user.uuid,
                    token: jwt.sign(
                        { userId: user.uuid },
                        process.env.RANDOM_TOKEN_SECRET,
                        { expiresIn: "24h"}
                    ),
                    msg: 'connecté!'
                });
            })
            .catch( error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};

exports.getUsers =  (req, res, next) => {
    User.findAll({ include: 'posts' })
    .then( users => res.status(200).json(users))
    .catch( error => res.status(404).json({ error }));
};

exports.getUser =  (req, res, next) => {
    const uuid = req.params.uuid
    User.findOne({ 
        where: { uuid },
        include: 'posts'
    })
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({ error }));
};



exports.updateUser = async (req, res, next) => {
    const uuid = req.params.uuid
    try{
        const user = await User.findOne({ where: { uuid } })
        if(!user) {
            res.status(201).json({error:"Utilisateur introuvable"})
        }
        if( req.body.firstName){
            user.firstName = req.body.firstName
        }
        if( req.body.lastName ){
            user.lastName = req.body.lastName
        }
        if( req.body.email && req.body.email !== undefined ){
            user.email = req.body.email
        }
     
        user.save()
        res.status(201).json({msg:"Profil Utilisateur modifié", user})

    }catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Une erreur est survenue' })
      }
  }

exports.deleteUser = async (req, res) => {
    const uuid = req.params.uuid
    try {
      const user = await User.findOne({ where: { uuid } })
      if (!user) {
        return res.status(404).json({error: "Utilisateur introuvable"})
      }
      await user.destroy()
  
      return res.json({ message: 'Utilisateur Supprimmé!' })
    } catch (err) {
      console.log(err)
      return res.status(500).json({ error: 'Une erreur est survenue' })
    }
};