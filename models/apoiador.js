module.exports = function(sequelize, DataTypes) {
  var Apoiador = sequelize.define("Apoiador", {    
    nm_apoiador: {type: DataTypes.TEXT, allowNull: false},
    ic_recebe_newsletter: {type: DataTypes.BOOLEAN, allowNull: false},
    usuario_id: {type: DataTypes.INTEGER, allowNull: false},
    causa_id: {type: DataTypes.INTEGER, allowNull: true}    
  },
  {
    classMethods: {
      associate: function(models) {
        Apoiador.belongsTo(models.Usuario);
        //Apoiador.hasOne(models.Causa);
      } 
    },
    tableName: 'apoiador'
  });
  return Apoiador;
};