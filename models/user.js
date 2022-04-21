'use strict';
const {  Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Post }) {
      // define association here
      this.hasMany(Post, { foreignKey: 'userId', as: 'posts' })
    }

    toJSON(){
      return { ...this.get(), id: undefined, password: undefined}
    }
  }
  User.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Utilisateur doit avoir un Prénom' },
        notEmpty: { msg: 'Prénom ne peut pas etre vide' }
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: 'Utilisateur doit avoir un Nom' },
        notEmpty: { msg: 'Nom ne peut pas etre vide' }
      },
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
      validate: {
        notNull: { msg: 'Utilisateur doit avoir un email' },
        notEmpty: { msg: 'Email ne peut pas etre vide' },
        isEmail: { msg: 'Doit etre une adresse email valide' },
      },
      unique: {
        args: 'email',
        msg: 'Adresse déja utilisée!'
     }
    },
    rank: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "user",
      validate: {
        notNull: { msg: 'Utilisateur doit avoir un poste' },
        notEmpty: { msg: 'Champ ne peut pas etre vide' }
      },
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
      validate: {
        notNull: { msg: 'Utilisateur doit avoir un mot de passe' },
        notEmpty: { msg: 'mot de passe ne peut pas etre vide' }
      },
    }
  }, 
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
  });
  return User;
};