var general = (function()
{
    var G = {};
    
    G.setDHTML = function()
    {        
        $('.cnpj').mask("99.999.999/9999-99");
        $('.cpf').mask("999.999.999-99");  
        $('.cep').mask('99999-999');
        $('.vl_money').maskMoney({decimal:",", thousands:"."});
        
        $('#password').keypress(function (e) {
          if (e.which == 13) {
            G.logar();
            return false;    //<---- Add this line
          }
        });

        $('#logar').on("click", function()
        {
           G.logar(); 
        });

        G.validarAlterarSenha();
    };
    
    G.logar = function()
    {
        $.ajax
        ({
            type: "POST",
            url: baseURL + "login",
            dataType : "json",
            data : {email: $('#email').val(), password: $('#password').val(), _token:$('#token').val()},
            success : function(res) {
                if (res.ret == "ok") {
                    window.location.assign(baseURL + "painel");
                }  else {
                    alert("Email ou senha incorretos, tente novamente!");
                }              
            }
        });
    };

    G.validarAlterarSenha = function() {
        $('#edit-senha-usuario').validate({
           rules:
            {                
                nm_senha_usuario : {
                        required : true,
                        minlength : 8
                },
                nm_senha_usuario_confirma : {
                        required : true,
                        minlength : 8,
                        equalTo: "#nm_senha_usuario"
                },
            },
            messages:
            {
                nm_senha_usuario : {
                        required: "Por favor, insira uma senha.",
                        minlength: "A senha deve conter no mínimo 8 caracteres."
                },
                nm_senha_usuario_confirma : {
                        required : "Confirme a senha!",
                        minlength : "A senha deve conter no mínimo 8 caracteres.",
                        equalTo : "As senhas digitadas devem corresponder."
                }
            }                  
        });
    };
    
    $(function()
    {
       G.setDHTML(); 
    });
    
    return G;
})();