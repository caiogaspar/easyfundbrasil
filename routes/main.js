module.exports = function(app) {

  var main = app.controllers.main;
  var apoiador = app.controllers.apoiador;
  var causa = app.controllers.causa;
  var painel = app.controllers.painel;
  var parceiro = app.controllers.parceiro;

  app.get('/', main.index);  
  app.get('/apoiadores/cadastro', apoiador.index);
  app.get('/apoiadores/editar', apoiador.editar);
  app.post('/apoiadores/create', apoiador.create)
  app.post('/apoiadores/editar-dados', apoiador.editarDados);
  app.post('/apoiadores/apoiar-causa', apoiador.apoiarCausa);
  app.get('/apoiadores/alterar-senha', apoiador.alterarSenha);
  app.get('/causas/cadastro', causa.index);
  app.post('/causas/create', causa.create);
  app.post('/causas/editar-dados', causa.editarDados);
  app.get('/causas/encontre-causa', causa.encontreCausa);
  app.get('/causas/getCausas', causa.getCausas);
  app.get('/causas/causas-encontradas', causa.causasEncontradas);  
  app.get('/causas/alterar-senha', causa.alterarSenha);
  app.get('/causas/editar', causa.editar);  
  app.get('/causas/editar-formas-recebimento', causa.formasRecebimento);
  app.post('/causas/edit-formas-recebimento', causa.editarFormasRecebimento);
  app.get('/parceiros/alterar-senha', parceiro.alterarSenha);  
  app.get('/parceiros/cadastro', parceiro.index);
  app.get('/parceiros/editar', parceiro.editar);
  app.post('/parceiros/create', parceiro.create)
  app.post('/parceiros/editar-dados', parceiro.editarDados);
  app.get('/parceiros/produtos', parceiro.produtos);  
  app.get('/parceiros/produtos/editar/:cd', parceiro.editarProduto);
  app.get('/parceiros/adicionar-produto', parceiro.adicionarProduto);
  app.post('/parceiros/gravar-produto', parceiro.gravarProduto);
  app.post('/login', main.login);
  app.get('/logout', main.logout);
  app.get('/painel', painel.index);
  app.post('/painel/alterar-senha', painel.alterarSenha);
};