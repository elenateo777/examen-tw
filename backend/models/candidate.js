const sequelize = require("../sequelize");
const { DataTypes } = require("sequelize");
const { application } = require("express");
const Job = require("./jobPosting");

const Candidate = sequelize.define('candidate', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nume: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {len: [5,40]},
    },
    cv: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {len: [100, 10000]}

    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail:{
                msg: "It must be a valid email adress"
            }
        }
    }
});

module.exports=Candidate;