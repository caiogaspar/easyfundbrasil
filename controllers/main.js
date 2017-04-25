module.exports = function(app) {
  var Usuario = app.models.schema.Usuario;
  var sequelize = app.models.schema.sequelize;
  var MainController = {
    index: function(req, res) {
      /* SELECT u.*, a.* FROM users u INNER JOIN address a ON u.id = a.user_id;
      User.findAll({
        include: [Address]
      }).success(function(users) {
        res.send(users);
      });*/
      //Customers.findAll().success(function(data) {                
        res.render('home/index',{page_title:"Easy Fund", session_site: req.session});                                
      //});
    },
    login: function (req, res) {
      var helpers = require('utils');
      Usuario.find({
        where : {nm_email_usuario: req.body.email, nm_senha_usuario: helpers.criptografar(req.body.password)}
      }).then(function(user) {
          if (user) {
            req.session.data_user = user;            
            if (req.session.data_user) {              
              res.json({ret: "ok"});                 
            } else {
              res.json({ret: "error"});          
            }                  
          } else {
              res.json({ret: "error"});          
          }         
      });            
    },
    logout: function (req, res) {
        req.session.destroy();
        res.redirect('/');
    }
  };

  return MainController;
}