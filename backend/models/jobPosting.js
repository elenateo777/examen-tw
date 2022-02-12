const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");

const JobPosting = sequelize.define('job', {
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    descriere: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {len: [3,50]}
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {isDate: true,
        isBefore: "2022-05-07"}

    }
});
module.exports=JobPosting;