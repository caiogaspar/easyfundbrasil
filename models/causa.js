module.exports = function(sequelize, DataTypes) {  
  var Causa = sequelize.define("Causa", {    
    ds_causa: {type: DataTypes.TEXT, allowNull: true},
    nm_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    nr_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    ds_complemento_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    nm_bairro_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    nm_cidade_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    sg_uf_endereco_causa: {type: DataTypes.STRING, allowNull: true},
    cd_cep_causa: {type: DataTypes.STRING, allowNull: true},
    qt_apoiadores_causa: {type: DataTypes.STRING, allowNull: false},
    nm_causa: { type: DataTypes.STRING, allowNull: false},
    cd_ip_causa: { type: DataTypes.STRING, allowNull: false},    
    nm_site_causa: { type: DataTypes.STRING, allowNull: true},
    nm_logo_causa: { type: DataTypes.STRING, allowNull: true},
    cd_situacao_causa:{ type: DataTypes.INTEGER, allowNull: false},
    categoria_causa_id:{ type: DataTypes.INTEGER, allowNull: false},
    usuario_id: {type: DataTypes.INTEGER, allowNull: false},    
    banco_id: {type: DataTypes.INTEGER, allowNull: false},
    cpf_cnpj_titular_conta: {type: DataTypes.STRING, allowNull: true},
    nr_agencia: {type: DataTypes.STRING, allowNull: true},
    nr_conta_banco: {type: DataTypes.STRING, allowNull: true}
  },
  {
    classMethods: {
      associate: function(models) {
        Causa.belongsTo(models.Usuario);        
        Causa.belongsTo(models.CategoriaCausa);
        //Causa.hasOne(models.Banco);
        //Causa.hasMany(models.Apoiador);
      }
    },
    tableName: 'causa'
  });  

  Causa.encontreCausa = function(query, callback) {
    Causa.query("SELECT causa.*, COUNT(apoiador.id) as qt_apoiadores from causa WHERE nm_causa LIKE '%" + query + "%'", Causa)
    .then(function(c) {
        callback(c);
    });    
  }
  
  return Causa;
};