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
            password: hash
        })
        .then(()=> res.status(201).json({ message: 'nouvel utilisateur ajouté !'}))
        .catch(error => res.status(400).json({ error }))
    })
    .catch( error => res.status(500).json({ error }));
};

exports.login = ( req, res, next) => {
    User.findOne({ email: req.body.email })
    .then( user => {
        if(!user) {
            return res.status(401)({ error: 'Utilisateur non trouvé !'})
        }
        bcrypt.compare(req.body.password, user.password)
            .then(valid => {
                if (!valid) {
                    return res.status(401)({ error: 'Mot de passe non valide !'})
                }
                res.status(200).json({
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        "secretsecret010101",
                        { expiresIn: "24h"}
                    )
                });
            })
            .catch( error => res.status(500).json({ error }));
    })
    .catch( error => res.status(500).json({ error }));
};