module.exports = function(sequelize, DataType) {

  var Banco = sequelize.define('Banco', {        
    nm_banco: {type: DataType.STRING, allowNull: false}   
  }, {    
      tableName: 'banco'
  });

  return Banco;

};
