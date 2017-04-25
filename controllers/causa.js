module.exports = function(app) {
      
  var sequelize = app.models.schema.sequelize;
  var Usuario = app.models.schema.Usuario;
  var Causa = app.models.schema.Causa;
  var CategoriaCausa = app.models.schema.CategoriaCausa;
  var Banco = app.models.schema.Banco;
  var Apoiador = app.models.schema.Apoiador;

  var CausaController = {
    index: function(req, res) {
      /* SELECT u.*, a.* FROM users u INNER JOIN address a ON u.id = a.user_id;
      User.findAll({
        include: [Address]
      }).success(function(users) {
        res.send(users);  
      });*/
      CategoriaCausa.findAll().success(function(categorias) { 
        Banco.findAll().success(function(bancos) {
          var resultado = {categorias : categorias, bancos:bancos};        
          res.render('causa/index',{page_title:"Easy Fund", page_data: resultado, session_site : req.session});                                      
        });    
      });
    },
    create: function(req, res) {
      var nm_logo_causa = "";     
      var formidable = require('formidable');
      var fs = require('fs');
      var path = require('path');   
      var helpers = require('utils');   
      
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
          //console.log(fields);
          if (files.nm_logo_causa.name != '') {
            var old_path = files.nm_logo_causa.path,
                file_size = files.nm_logo_causa.size,
                file_ext = files.nm_logo_causa.name.split('.').pop(),
                index = old_path.lastIndexOf('/') + 1;
                file_name = old_path.substr(index);
                if (file_name == old_path) {
                    index = old_path.lastIndexOf('\\') + 1;
                    file_name= old_path.substr(index);
                }                         
                var time = new Date().getTime();
                nm_logo_causa = helpers.criptografar(time) + '.' + file_ext;                
                new_path = 'public/uploads/causas/' + nm_logo_causa;                                
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            console.log("Error: " + err);        
                            res.render("causa/index", {erro:"Não foi possível fazer upload do logo.", session_site : req.session});
                            res.status(200).end();
                        }
                    });
                });
            });
          }

          Usuario.create({
            nm_email_usuario: fields.nm_email_usuario,
            nm_senha_usuario: helpers.criptografar(fields.nm_senha_usuario),
            cd_tipo_usuario: 1
          }).success(function(usuario) {
            Causa.create({
              nm_causa: fields.nm_causa,
              categoria_causa_id: fields.categoria_causa_id,
              qt_apoiadores_causa: fields.qt_apoiadores_causa,
              ds_causa: fields.ds_causa,
              cd_cep_causa: fields.cd_cep_causa,
              nm_endereco_causa: fields.nm_endereco_causa,
              nr_endereco_causa: fields.nr_endereco_causa,
              ds_complemento_endereco_causa: fields.ds_complemento_endereco_causa,
              nm_bairro_endereco_causa: fields.nm_bairro_endereco_causa,
              sg_uf_endereco_causa: fields.sg_uf_endereco_causa,
              nm_cidade_endereco_causa: fields.nm_cidade_endereco_causa,
              banco_id: fields.banco_id,
              cpf_cnpj_titular_conta: fields.cpf_cnpj_titular_conta,
              cd_ip_causa: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
                           req.connection.socket.remoteAddress),
              cd_situacao_causa: 1,
              nr_agencia: fields.nr_agencia,
              nr_conta_banco: fields.nr_conta_banco,
              nm_logo_causa: nm_logo_causa,
              nm_site_causa: fields.nm_site_causa,
              categoria_causa_id: fields.categoria_causa_id,
              usuario_id: usuario.id
            }).success(function(causa) {                            
              res.render('causa/create', {page_title: "Easy Fund", session_site : req.session});
              res.status(200).end();
            });
          });
      });
    },
    encontreCausa : function(req, res) {
        res.render('causa/busca-causa',{page_title:"Easy Fund", session_site: req.session});                                      
    },
    getCausas : function(req, res) {
      //res.write('teste');
      //res.status(200).end();
        Causa.findAll({attributes: ['id', 'nm_causa', 'ds_causa'],
          include: [{model: CategoriaCausa, attributes:['nm_categoria_causa']}]
        }).success(function(causas) {                      
            var causasFinal = new Array();
            for (var i in causas) {
              causasFinal[i] = {
                  id: causas[i].id,
                  nm_causa: causas[i].nm_causa,
                  ds_causa: causas[i].ds_causa,
                  nm_categoria_causa: causas[i].CategoriaCausa.nm_categoria_causa,
                  tokens: [causas[i].nm_causa, causas[i].ds_causa]
              };
            }            
            res.writeHeader(200, {"Content-Type": "application/json"});  
            res.write(JSON.stringify(causasFinal, null, 4));
            res.end();  
        });
    },
    causasEncontradas : function(req, res) {             
      sequelize.query("SELECT causa.*, COUNT(apoiador.id) as qt_apoiadores from causa LEFT JOIN apoiador ON apoiador.causa_id = causa.id WHERE nm_causa LIKE '%" + req.query.q + "%' GROUP BY causa.id",
        { type: sequelize.QueryTypes.SELECT})
        .then(function(c) {
            var resultado = {causas : c, query:req.query.q};        
            res.render('causa/lista-causas',{page_title:"Easy Fund", page_data: resultado, session_site : req.session}); 
        });        
    },
    alterarSenha : function(req, res) {
      if (req.session.hasOwnProperty('data_user')) {
         res.render('causa/alterar-senha.ejs', {page_title: "Easy Fund - Edição de Dados", session_site : req.session}); 
         return;
      }

      res.redirect('/');       
    },
    editar : function(req, res) {
      var causa_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  causa_id = req.session.data_user.especifico.id;
              }
          }
      }      

      if (causa_id > 0) {
        Causa.find({where: {id: causa_id},
          include: [Usuario]
        }).success(function(dados) {        
          CategoriaCausa.findAll().success(function(categorias) {             
            res.render('causa/dados-principais.ejs',{page_title: "Easy Fund - Edição de Dados", categorias : categorias, session_site : req.session, dados: dados});          
          });
        });  
      } else {
        res.redirect('/painel');       
      }
      
    },
    formasRecebimento : function(req, res) {
      var causa_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  causa_id = req.session.data_user.especifico.id;
              }
          }
      }      

      if (causa_id > 0) {
        Causa.find({where: {id: causa_id},
          include: [Usuario]
        }).success(function(dados) {        
          Banco.findAll().success(function(bancos) {             
            res.render('causa/formas-recebimento.ejs',{page_title: "Easy Fund - Edição de Dados", dados: dados, bancos : bancos, session_site : req.session});          
          });
        });  
      } else {
        res.redirect('/painel');       
      }
      
    },
    editarDados : function(req, res) {                  

      var nm_logo_causa = "";     
      var formidable = require('formidable');
      var fs = require('fs');
      var path = require('path');   
      var helpers = require('utils'); 
      var form = new formidable.IncomingForm();      
      form.parse(req, function(err, fields, files) {        
        if (fields.causa_id == '' || typeof fields.causa_id === 'undefined') {        
          res.render('causa/index.ejs');
          res.status(200);
          return;
        }

      if (fields.nm_causa == '' || typeof fields.nm_causa === 'undefined') {          
          res.render('causa/index.ejs');          
          res.status(200);
          return;
      } 

      if (fields.nm_email_usuario == '' || typeof fields.nm_email_usuario === 'undefined') {        
          res.render('causa/index.ejs');
          res.status(200);
          return;
      }      
          
        if (files.nm_logo_causa.name != '') {
          var old_path = files.nm_logo_causa.path,
              file_size = files.nm_logo_causa.size,
              file_ext = files.nm_logo_causa.name.split('.').pop(),
              index = old_path.lastIndexOf('/') + 1;
              file_name = old_path.substr(index);
              if (file_name == old_path) {
                  index = old_path.lastIndexOf('\\') + 1;
                  file_name= old_path.substr(index);
              }                         
              var time = new Date().getTime();
              nm_logo_causa = helpers.criptografar(time) + '.' + file_ext;                
              new_path = 'public/uploads/causas/' + nm_logo_causa;                                
          fs.readFile(old_path, function(err, data) {
              fs.writeFile(new_path, data, function(err) {
                  fs.unlink(old_path, function(err) {
                      if (err) {
                          console.log("Error: " + err);        
                          res.render("causa/index", {erro:"Não foi possível fazer upload do logo.", session_site : req.session});
                          res.status(200).end();
                      }
                  });
              });
          });
        }

        var dadosCausaUpdate = {nm_causa : fields.nm_causa, qt_apoiadores_causa : fields.qt_apoiadores_causa, 
          categoria_causa_id : fields.categoria_causa_id, ds_causa: fields.ds_causa, nm_site_causa : fields.nm_site_causa,
          sg_uf_endereco_causa : fields.sg_uf_endereco_causa, nm_cidade_endereco_causa : fields.nm_cidade_endereco_causa,
          nm_endereco_causa : fields.nm_endereco_causa, cd_cep_causa : fields.cd_cep_causa, nr_endereco_causa : fields.nr_endereco_causa,
          ds_complemento_endereco_causa : fields.ds_complemento_endereco_causa, nm_bairro_endereco_causa: fields.nm_bairro_endereco_causa        
        };

        if (nm_logo_causa != "") {
          dadosCausaUpdate.nm_logo_causa = nm_logo_causa;
        }
        
        //dando update no banco
        Causa.update(dadosCausaUpdate, { where: {id : fields.causa_id}}).success(function()
        {
          Usuario.update({nm_email_usuario : fields.nm_email_usuario}, {where: {id : req.session.data_user.id}}).success(function()
          {
              res.redirect('/causas/editar');
          });
        });                
      });
    }, 
    editarFormasRecebimento : function(req, res) {
      var dados = req.body;      

      if (dados.causa == '' || typeof dados.causa_id === 'undefined') {
        res.render('causa/index.ejs');
        return;
      }

      if (dados.banco_id == '' || typeof dados.banco_id === 'undefined') {
          res.render('causa/index.ejs');
          return;
      } 

      if (dados.cpf_cnpj_titular_conta == '' || typeof dados.cpf_cnpj_titular_conta === 'undefined') {
          res.render('causa/index.ejs');
          return;
      }

      if (dados.nr_agencia == '' || typeof dados.nr_agencia === 'undefined') {
          res.render('causa/index.ejs');
          return;
      }

      if (dados.nr_conta_banco == '' || typeof dados.cpf_cnpj_titular_conta === 'undefined') {
          res.render('causa/index.ejs');
          return;
      }

      //dando update no banco
      Causa.update({
        banco_id : dados.banco_id, cpf_cnpj_titular_conta : dados.cpf_cnpj_titular_conta, 
        nr_agencia : dados.nr_agencia, nr_conta_banco : dados.nr_conta_banco
      },
       {where : {id : dados.causa_id}}).success(function()
      {        
          res.redirect('/causas/editar');        
      });                
    }
  };

  return CausaController;
}