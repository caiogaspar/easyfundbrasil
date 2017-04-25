module.exports = function(sequelize, DataType) {

  var CategoriaParceiro = sequelize.define('CategoriaParceiro', {        
    nm_categoria_parceiro: {type: DataType.STRING, allowNull: false}   
  },
  {
    classMethods: {
      associate: function(models) {        
      }
    },      
      tableName: 'categoria_parceiro'
  });

  return CategoriaParceiro;

};
