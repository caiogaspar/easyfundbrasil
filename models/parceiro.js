module.exports = function(sequelize, DataTypes) {  
  var Parceiro = sequelize.define("Parceiro", {    
    ds_parceiro: {type: DataTypes.TEXT, allowNull: true},
    nm_endereco_parceiro: {type: DataTypes.STRING, allowNull: true},
    nr_endereco_parceiro: {type: DataTypes.STRING, allowNull: true},
    ds_complemento_endereco_parceiro: {type: DataTypes.STRING, allowNull: true},
    nm_bairro_parceiro: {type: DataTypes.STRING, allowNull: true},
    nm_cidade_parceiro: {type: DataTypes.STRING, allowNull: true},
    nm_estado_parceiro: {type: DataTypes.STRING, allowNull: true},
    cd_cep_parceiro: {type: DataTypes.STRING, allowNull: true},    
    nm_parceiro: { type: DataTypes.STRING, allowNull: false},    
    nm_site_parceiro: { type: DataTypes.STRING, allowNull: true},
    nm_logo_parceiro: { type: DataTypes.STRING, allowNull: true},
    cd_situacao_parceiro:{ type: DataTypes.INTEGER, allowNull: false},
    categoria_parceiro_id:{ type: DataTypes.INTEGER, allowNull: false},
    usuario_id: {type: DataTypes.INTEGER, allowNull: false},    
    nm_twitter_parceiro: {type: DataTypes.STRING, allowNull: true},
    nm_facebook_parceiro: {type: DataTypes.STRING, allowNull: true},
    pc_doacao_padrao: {type: DataTypes.STRING, allowNull: true},
    cd_cnpj_parceiro: {type: DataTypes.STRING, allowNull: false},    
    ds_restricoes_parceiro: {type: DataTypes.TEXT, allowNull: true}    
  },
  {
    classMethods: {
      associate: function(models) {
        Parceiro.belongsTo(models.Usuario);        
        Parceiro.belongsTo(models.CategoriaParceiro);
        //Causa.hasOne(models.Banco);
        //Causa.hasMany(models.Apoiador);
      }
    },
    tableName: 'parceiro'
  });    
  
  return Parceiro;
};