module.exports = function(app) {
  
  var Usuario = app.models.schema.Usuario;
  var Apoiador = app.models.schema.Apoiador;

  var ApoiadorController = {
    index: function(req, res) {
      /* SELECT u.*, a.* FROM users u INNER JOIN address a ON u.id = a.user_id;
      User.findAll({
        include: [Address]
      }).success(function(users) {
        res.send(users);  
      });*/
      //Customers.findAll().success(function(data) {        
        res.render('apoiador/index',{page_title:"Easy Fund", session_site: req.session});                                
      //});
    },
    create: function(req, res) {  
      var helpers = require('utils');      
      Usuario.create({
        nm_email_usuario: req.body.nm_email_usuario,
        nm_senha_usuario: helpers.criptografar(req.body.nm_senha_usuario),
        cd_tipo_usuario: 2                
      }).success(function(usuario) { 
        var apoiadorInserir =  {
          nm_apoiador: req.body.nm_apoiador,
          ic_recebe_newsletter: ((req.body.ic_recebe_newsletter == 'on') ? true : false),          
          usuario_id: usuario.id
        };

        //verificar se existe alguma causa na session para poder inserir
        var causa_id = false;
        if (req.session.hasOwnProperty('data_user')) {
            if (req.session.data_user.hasOwnProperty('especifico')) {
                if (req.session.data_user.especifico.hasOwnProperty('causa_id')) {
                    causa_id = req.session.data_user.especifico.causa_id;
                }
            }
        }

        if (causa_id) {
          apoiadorInserir['causa_id'] = causa_id;
        } else {
          apoiadorInserir['causa_id'] = null;
        }
        
        Apoiador.create(apoiadorInserir).success(function(apoiador) {          
          res.status(200);
          if (causa_id) {
            res.render('causa/create.ejs',{page_title: "Easy Fund", session_site : req.session});          
          } else {
            res.redirect('/causas/encontre-causa');            
          }          
        });
      });
    },
    editar : function(req, res) {
      var apoiador_id = 0;
      if (req.session.hasOwnProperty('data_user')) {
          if (req.session.data_user.hasOwnProperty('especifico')) {
              if (req.session.data_user.especifico.hasOwnProperty('id')) {
                  apoiador_id = req.session.data_user.especifico.id;
              }
          }
      }      

      if (apoiador_id > 0) {
        Apoiador.find({where: {id: apoiador_id},
          include: [Usuario]
        }).success(function(dados) {        
          res.render('apoiador/index.ejs',{page_title: "Easy Fund - Edição de Dados", session_site : req.session, dados: dados});          
        });  
      } else {
        res.redirect('/painel');        
      }
      
    },
    alterarSenha : function(req, res) {
      if (req.session.hasOwnProperty('data_user')) {
         res.render('apoiador/alterar-senha.ejs', {page_title: "Easy Fund - Edição de Dados", session_site : req.session}); 
         return;
      }

      res.redirect('/');       
    },
    editarDados : function(req, res) {
      var dados = req.body;      

      if (dados.apoiador_id == '' || typeof dados.apoiador_id === 'undefined') {
        res.render('apoiador/index.ejs');
      }

      if (dados.nm_apoiador == '' || typeof dados.nm_apoiador === 'undefined') {
          res.render('apoiador/index.ejs');
          return;
      } 

      if (dados.nm_email_usuario == '' || typeof dados.nm_email_usuario === 'undefined') {
          res.render('apoiador/index.ejs');
          return;
      }

      //dando update no banco
      Apoiador.update({nm_apoiador : dados.nm_apoiador}, {where : {id : dados.apoiador_id}}).success(function()
      {
        Usuario.update({nm_email_usuario : dados.nm_email_usuario}, {where : {id : req.session.data_user.id}}).success(function()
        {
            res.redirect('/apoiadores/editar');
        });
      });                
    },
    apoiarCausa : function(req, res) {
        var cd_causa = req.body.cd_causa;        
        
        var apoiador_id = false;
        if (req.session.hasOwnProperty('data_user')) {
            if (req.session.data_user.hasOwnProperty('especifico')) {
                if (req.session.data_user.especifico.hasOwnProperty('id')) {
                    apoiador_id = req.session.data_user.especifico.id;
                }
            }
        }

        if (cd_causa > 0) {                    
          if (typeof req.session.data_user === 'undefined') {
              req.session.data_user = {especifico : {causa_id : cd_causa}};
          } else {            
              req.session.data_user['especifico'] = {causa_id : cd_causa};                             
          }
          
          if (apoiador_id) {              
            Apoiador.update({causa_id : cd_causa}, {where: {_id: apoiador_id}});            
            res.redirect('/painel');
          } else {
            res.redirect('/apoiadores/cadastro');
          }

        }
        
    }
  };

  return ApoiadorController;
}