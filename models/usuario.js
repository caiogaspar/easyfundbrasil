module.exports = function(sequelize, DataType) {

  var Usuario = sequelize.define('Usuario', {    
    nm_email_usuario: {type: DataType.STRING, allowNull: false, unique: true},
    nm_senha_usuario: {type: DataType.STRING, allowNull: false},
    cd_tipo_usuario: {type: DataType.INTEGER, allowNull: false} //0 - Admin , Causa - 1, Apoiador - 2, Patrocinador - 3    
  }, {
    classMethods: {
      associate: function(models) {
        Usuario.hasOne(models.Causa);
        Usuario.hasOne(models.Apoiador);
      }
    },
    tableName: 'usuario'
  });

  return Usuario;

};
