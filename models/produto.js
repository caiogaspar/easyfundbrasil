module.exports = function(sequelize, DataTypes) {  
  var Produto = sequelize.define("Produto", {    
    ds_produto: {type: DataTypes.TEXT, allowNull: true},
    nm_produto: {type: DataTypes.STRING, allowNull: false},      
    vl_produto: {type: DataTypes.FLOAT, allowNull: false},
    parceiro_id:{ type: DataTypes.INTEGER, allowNull: false},        
    pc_doacao_produto: {type: DataTypes.STRING, allowNull: true},
    nm_link_produto: {type: DataTypes.STRING, allowNull: false}
  },
  {
    classMethods: {
      associate: function(models) {        
        Produto.belongsTo(models.Parceiro);        
      }
    },
    tableName: 'produto'
  });    
  
  return Produto;
};