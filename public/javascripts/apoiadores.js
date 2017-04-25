var apoiadores = (function()
{
    var A = {};
    
    A.setDHTML = function()
    {
        A.validarApoiador();       
    };    
    
    A.validarApoiador = function()
    {        
        $('#create-apoiador').validate({
           rules:
            {
                nm_apoiador : "required",
                nm_email_usuario : {
                        required : true,
                        email : true
                },
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
                nm_apoiador : "Digite seu nome.",
                nm_email_usuario : "Por favor, insira seu email.",
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
       A.setDHTML(); 
    });

    return A;    
})();
