module.exports = function(app) {
      
  var sequelize = app.models.schema.sequelize;
  var Usuario = app.models.schema.Usuario;
  var Parceiro = app.models.schema.Parceiro;
  var CategoriaParceiro = app.models.schema.CategoriaParceiro;
  var Produto = app.models.schema.Produto;  

  var ParceiroController = {
    colunas : {
          
    },
    index: function(req, res) {
      /* SELECT u.*, a.* FROM users u INNER JOIN address a ON u.id = a.user_id;
      User.findAll({
        include: [Address]
      }).success(function(users) {
        res.send(users);  
      });*/
      CategoriaParceiro.findAll().success(function(categorias) { 
        Banco.findAll().success(function(bancos) {
          var resultado = {categorias : categorias, bancos:bancos};        
          res.render('parceiro/index',{page_title:"Easy Fund", page_data: resultado, session_site : req.session});                                      
        });    
      });
    },
    create: function(req, res) {
      var nm_logo_parceiro = "";     
      var formidable = require('formidable');
      var fs = require('fs');
      var path = require('path');   
      var helpers = require('utils');   
      
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
          //console.log(fields);
          if (files.nm_logo_parceiro.name != '') {
            var old_path = files.nm_logo_parceiro.path,
                file_size = files.nm_logo_parceiro.size,
                file_ext = files.nm_logo_parceiro.name.split('.').pop(),
                index = old_path.lastIndexOf('/') + 1;
                file_name = old_path.substr(index);
                if (file_name == old_path) {
                    index = old_path.lastIndexOf('\\') + 1;
                    file_name= old_path.substr(index);
                }                         
                var time = new Date().getTime();
                nm_logo_parceiro = helpers.criptografar(time) + '.' + file_ext;                
                new_path = 'public/uploads/parceiros/' + nm_logo_parceiro;                                
            fs.readFile(old_path, function(err, data) {
                fs.writeFile(new_path, data, function(err) {
                    fs.unlink(old_path, function(err) {
                        if (err) {
                            console.log("Error: " + err);        
                            res.render("parceiro/index", {erro:"Não foi possível fazer upload do logo.", session_site : req.session});
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
            Parceiro.create({
              nm_parceiro: fields.nm_parceiro,
              categoria_parceiro_id: fields.categoria_parceiro_id,
              qt_apoiadores_parceiro: fields.qt_apoiadores_parceiro,
              ds_parceiro: fields.ds_parceiro,
              cd_cep_parceiro: fields.cd_cep_parceiro,
              nm_endereco_parceiro: fields.nm_endereco_parceiro,
              nr_endereco_parceiro: fields.nr_endereco_parceiro,
              ds_complemento_endereco_parceiro: fields.ds_complemento_endereco_parceiro,
              nm_bairro_endereco_parceiro: fields.nm_bairro_endereco_parceiro,
              sg_uf_endereco_parceiro: fields.sg_uf_endereco_parceiro,
              nm_cidade_endereco_parceiro: fields.nm_cidade_endereco_parceiro,
              banco_id: fields.banco_id,
              cpf_cnpj_titular_conta: fields.cpf_cnpj_titular_conta,
              cd_ip_parceiro: (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress ||
                           req.connection.socket.remoteAddress),
              cd_situacao_parceiro: 1,
              nr_agencia: fields.nr_agencia,
              nr_conta_banco: fields.nr_conta_banco,
              nm_logo_parceiro: nm_logo_parceiro,
              nm_site_parceiro: fields.nm_site_parceiro,
              categoria_parceiro_id: fields.categoria_parceiro_id,
              usuario_id: usuario.id
            }).success(function(parceiro) {                            
              res.render('parceiro/create', {page_title: "Easy Fund", session_site : req.session});
              res.status(200).end();
            });
          });
      });
    },    
    alterarSenha : function(req, res) {
      if (req.session.hasOwnProperty('data_user')) {
         res.render('parceiro/alterar-senha.ejs', {page_title: "Easy Fund - Edição de Dados", session_site : req.session}); 
         return;
      }

      res.redirect('/');       
    },
    editar : function(req, res) {
      var parceiro_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  parceiro_id = req.session.data_user.especifico.id;
              }
          }
      }      

      if (parceiro_id > 0) {
        Parceiro.find({where: {id: parceiro_id},
          include: [Usuario]
        }).success(function(dados) {        
          CategoriaParceiro.findAll().success(function(categorias) {             
            res.render('parceiro/index.ejs',{page_title: "Easy Fund - Edição de Dados",categorias : categorias, session_site : req.session, dados: dados});          
          });
        });  
      } else {
        res.redirect('/painel');       
      }
      
    },    
    editarDados : function(req, res) {                  

      var nm_logo_parceiro = "";     
      var formidable = require('formidable');
      var fs = require('fs');
      var path = require('path');   
      var helpers = require('utils'); 
      var form = new formidable.IncomingForm();      
      form.parse(req, function(err, fields, files) {        
        if (fields.parceiro_id == '' || typeof fields.parceiro_id === 'undefined') {        
          res.render('parceiro/index.ejs');
          res.status(200);
          return;
        }

      if (fields.nm_parceiro == '' || typeof fields.nm_parceiro === 'undefined') {          
          res.render('parceiro/index.ejs');          
          res.status(200);
          return;
      } 

      if (fields.nm_email_usuario == '' || typeof fields.nm_email_usuario === 'undefined') {        
          res.render('parceiro/index.ejs');
          res.status(200);
          return;
      }      
          
        if (files.nm_logo_parceiro.name != '') {
          var old_path = files.nm_logo_parceiro.path,
              file_size = files.nm_logo_parceiro.size,
              file_ext = files.nm_logo_parceiro.name.split('.').pop(),
              index = old_path.lastIndexOf('/') + 1;
              file_name = old_path.substr(index);
              if (file_name == old_path) {
                  index = old_path.lastIndexOf('\\') + 1;
                  file_name= old_path.substr(index);
              }                         
              var time = new Date().getTime();
              nm_logo_parceiro = helpers.criptografar(time) + '.' + file_ext;                
              new_path = 'public/uploads/parceiros/' + nm_logo_parceiro;                                
          fs.readFile(old_path, function(err, data) {
              fs.writeFile(new_path, data, function(err) {
                  fs.unlink(old_path, function(err) {
                      if (err) {
                          console.log("Error: " + err);        
                          res.render("parceiro/index", {erro:"Não foi possível fazer upload do logo.", session_site : req.session});
                          res.status(200).end();
                      }
                  });
              });
          });
        }

        var dadosParceiroUpdate = {nm_parceiro : fields.nm_parceiro, qt_apoiadores_parceiro : fields.qt_apoiadores_parceiro, 
          categoria_parceiro_id : fields.categoria_parceiro_id, ds_parceiro: fields.ds_parceiro, nm_site_parceiro : fields.nm_site_parceiro,
          sg_uf_endereco_parceiro : fields.sg_uf_endereco_parceiro, nm_cidade_endereco_parceiro : fields.nm_cidade_endereco_parceiro,
          nm_endereco_parceiro : fields.nm_endereco_parceiro, cd_cep_parceiro : fields.cd_cep_parceiro, nr_endereco_parceiro : fields.nr_endereco_parceiro,
          ds_complemento_endereco_parceiro : fields.ds_complemento_endereco_parceiro, nm_bairro_endereco_parceiro: fields.nm_bairro_endereco_parceiro        
        };

        if (nm_logo_parceiro != "") {
          dadosParceiroUpdate.nm_logo_parceiro = nm_logo_parceiro;
        }
        
        //dando update no banco
        Parceiro.update(dadosParceiroUpdate, { where: {id : fields.parceiro_id}}).success(function()
        {
          Usuario.update({nm_email_usuario : fields.nm_email_usuario}, {where: {id : req.session.data_user.id}}).success(function()
          {
              res.redirect('/parceiros/editar');
          });
        });                
      });
    },
    produtos : function(req, res) {            
      var params = req.query;
      var parceiro_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  parceiro_id = req.session.data_user.especifico.id;
              } 
          }
      }      

      console.log(params);
      var ajax = (typeof params.ajax !== 'undefined' && params.ajax == 'true' ? true : false);
      if (typeof params.search !== 'undefined' && params.search != '') {
          var whereFinal = [{parceiro_id: parceiro_id}, "nm_produto like '%" + decodeURIComponent(params.search) + "%'"];
      } else {
        var whereFinal = [{parceiro_id: parceiro_id}];
      }
      if (parceiro_id > 0) {
          Produto.findAll({where: whereFinal,
            include: [Parceiro]
          }).success(function(produtos) {                                            
              console.log(ajax);
              if (ajax) {
                console.log("entrou aqui");
                res.writeHeader(200, {"Content-Type": "application/json"});  
                res.write(JSON.stringify(produtos, null, 4));
                res.end();
              } else {
                  res.render('parceiro/lista-produtos-parceiros.ejs',{page_title: "Easy Fund - Edição de Dados", produtos: produtos, session_site : req.session});                        
              }                          
          });  
          return;
      }
      res.redirect('/painel');
    },
    adicionarProduto : function(req, res) {
      var parceiro_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  parceiro_id = req.session.data_user.especifico.id;
              }
          }
      }      

      if (parceiro_id > 0) {
        res.render('parceiro/create-produto.ejs',{page_title: "Easy Fund - Edição de Dados", session_site : req.session, parceiro_id : parceiro_id});                                
        return;
      }
      res.redirect('/painel');      
    },
    editarProduto : function (req, res) {
        var data_user = req.params;        
        if (data_user.cd > 0) {
            Produto.find({where: {id : data_user.cd}}).success(function(dados) {
              res.render('parceiro/create-produto.ejs',{page_title: "Easy Fund - Edição de Dados", session_site : req.session, dados : dados, produto_id : data_user.cd});                                
            });
            return;
        }
        res.redirect('/parceiros/produtos');
    },
    gravarProduto: function(req, res) {
        var dados = req.body;

        var helpers = require('utils'); 

        if (dados.nm_produto == "") {
          res.render('parceiro/create-produto.ejs',
            {
              page_title: "Easy Fund - Edição de Dados", 
              session_site : req.session, 
              parceiro_id : parceiro_id
            });                                
          return;
        }

        if (dados.nm_link_produto == "") {
          res.render('parceiro/create-produto.ejs',{page_title: "Easy Fund - Edição de Dados", session_site : req.session, parceiro_id : parceiro_id});                                
          return; 
        }
        
        if (dados.parceiro_id <= 0) {
          res.render('parceiro/create-produto.ejs',{page_title: "Easy Fund - Edição de Dados", session_site : req.session, parceiro_id : parceiro_id});                                
          return;
        }
        if (dados.produto_id == "") {
            Produto.create({
              nm_produto : dados.nm_produto,
              ds_produto: dados.ds_produto,
              pc_doacao_produto: dados.pc_doacao_produto,
              nm_link_produto: dados.nm_link_produto,
              parceiro_id : dados.parceiro_id,
              vl_produto: helpers.limparValor(dados.vl_produto)
            }).success(function() {
              res.redirect('/parceiros/produtos');
            });
        } else {
          console.log("Valor: " + helpers.limparValor(dados.vl_produto));
            Produto.update({
              nm_produto : dados.nm_produto,
              ds_produto: dados.ds_produto,
              pc_doacao_produto: dados.pc_doacao_produto,
              nm_link_produto: dados.nm_link_produto,
              parceiro_id : dados.parceiro_id,
              vl_produto: helpers.limparValor(dados.vl_produto)
            }, {where: {id: dados.produto_id}}).success(function() {
                res.redirect('/parceiros/produtos');
            });
        }
    }
  };

  return ParceiroController;
};