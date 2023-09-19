'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class contactDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      contactDetail.belongsTo(models.contact)
    }
  }
  contactDetail.init({
    typeOfContactDetail: DataTypes.STRING,
    valueOfContactDetail: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'contactDetail',
    underscored: true,
    paranoid:true
  });
  return contactDetail;
};