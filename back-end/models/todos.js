module.exports = function(sequelize, DataTypes) {
    return sequelize.define('todos', {
        id: {
            type: DataTypes.INTEGER(11).UNSIGNED,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        description: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        isFinished: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        tableName: 'todos',
        timestamps: false
    });
};
