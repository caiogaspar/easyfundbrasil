module.exports = function(sequelize, DataType) {

  var CategoriaCausa = sequelize.define('CategoriaCausa', {        
    nm_categoria_causa: {type: DataType.STRING, allowNull: false}   
  },
  {
    classMethods: {
      associate: function(models) {        
      }
    },      
      tableName: 'categoria_causa'
  });

  return CategoriaCausa;

};
