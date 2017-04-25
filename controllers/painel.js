module.exports = function(app) {
  var Usuario = app.models.schema.Usuario;
  var sequelize = app.models.schema.sequelize;
  var Apoiador = app.models.schema.Apoiador;
  var Causa = app.models.schema.Causa;
  var Parceiro = app.models.schema.Parceiro;
  var PainelController = {
    index: function(req, res) {
      if (req.session.data_user) {
          console.log(req.session.data_user);
          if (req.session.data_user.cd_tipo_usuario == 2) {
            Apoiador.find({
              where : {usuario_id : req.session.data_user.id}
            }).then(function(apoiador) {
              req.session.data_user.especifico = apoiador;

              if (apoiador.causa_id <= 0) {
                  res.redirect('/causas/encontre-causa');
                  return;
              }
              res.render('painel/apoiadores', {page_title:"Easy Fund", session_site: req.session});
            });
          } else if (req.session.data_user.cd_tipo_usuario == 1) {
            Causa.find({
              where : {usuario_id : req.session.data_user.id}
            }).then(function(causa) {
                req.session.data_user.especifico = causa;
                res.render('painel/apoiadores', {page_title:"Easy Fund", session_site: req.session});                
            });
          } else if (req.session.data_user.cd_tipo_usuario == 3) {
            Parceiro.find({
              where : {usuario_id : req.session.data_user.id}
            }).then(function(parceiro) {
                req.session.data_user.especifico = parceiro;
                res.render('painel/apoiadores', {page_title:"Easy Fund", session_site: req.session});   
            });
          }
          
      } else {
          res.redirect('/');
      }      
    },
    alterarSenha: function(req, res) {
      var helpers = require('utils');   
      if (req.session.hasOwnProperty('data_user')) {
          if (req.body.nm_senha_usuario != "") {
              Usuario.update({nm_senha_usuario : helpers.criptografar(req.body.nm_senha_usuario)}, {where: {id: req.session.data_user.id}});
          }
      }
      res.redirect('/painel');
    }
  };

  return PainelController;
}