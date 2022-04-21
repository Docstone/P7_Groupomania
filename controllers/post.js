const { Post, User } = require('../models');

// exports.createPost =  (req, res, next) => {
//     const  userUuid = req.body.userUuid
//     const body  = req.body.body
//      User.findOne({ where: { uuid: userUuid } }).then(user => {
//        Post.create({ body, userId: user.id , userUuid: user.uuid})
//      }).then(post=>{
//       res.status(201).json(post)
//      }).catch(error =>  res.status(500).json({ error }));
// };

exports.createPost = async (req, res) => {
  const uuid = req.body.userUuid
  const body = req.body.body
  try {
  if (req.body.userUuid && req.body.body) {
  
    const user = await User.findOne({ where: { uuid } })
    const post = await Post.create({ body, userId: user.id })

    res.status(200).send({post});
    return;
  }
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
}

  exports.getPosts =  (req, res, next) => {
    Post.findAll({ include:  'user'})
    .then( posts => res.status(200).json(posts))
    .catch( error => res.status(404).json({ error }));
};

exports.getPost =  (req, res, next) => {
    const uuid = req.params.uuid
    Post.findOne({ where: { uuid },  include: 'user' })
    .then(post => {
      if(post && post !== null){
        res.status(200).json(post)
      }else{
        res.status(404).json("le post n'existe pas")
      }
    })
    .catch(error => res.status(404).json({ error }));
};

exports.userPosts = (req, res, next) => {
  const uuid = req.params.uuid
  User.findOne({ 
      where: { uuid },
      include: 'posts'
  })
  .then(user => res.status(200).json(user.posts))
  .catch(error => res.status(404).json({ error }));
};

exports.delete = async (req, res) => {
    const uuid = req.params.uuid
    const userId = req.get('auth')
    try {
      const post = await Post.findOne({ where: { uuid } , include: 'user'})
      if (!post) {
        return res.status(404).json({error: "Post introuvable"})
      }
      if (post.user.uuid !== userId) {
        return res.status(401).json({error: "Requete non autorisée"})
      }
      await post.destroy()
  
      return res.json({ message: 'Post Supprimmé!' })
      }catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Une erreur est survenue' })
    }
}