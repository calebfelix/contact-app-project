'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('contact_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type_of_contact_detail: {
        type: Sequelize.STRING
      },
      value_of_contact_detail: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      },
      contact_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
        references:{
          model:{
            tableName:'contacts',
          }
        },
        key:'id'
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('contactDetails');
  }
};