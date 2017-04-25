angular.module('painel_parceiros', ['ngRoute']);
angular.module('painel_parceiros').controller('ParceiroController', function($scope, $http) {
    $scope.filtro = '';
    $scope.produtos = [];    
    
    $scope.getProdutos = function() {        
        var promiseGetProdutos = $http.get('/parceiros/produtos/', {params: {ajax: true, search: encodeURIComponent($scope.filtro)}});        
        promiseGetProdutos
        .success(function(data) {
            $scope.produtos = data;
        })
        .error(function(statusText) {        
            console.log(statusText);
        });
    };  

    $scope.init = function() {
        $scope.getProdutos();
    };
    $scope.init();      
});

var parceiros = (function()
{
    var P = {};
    
    P.setDHTML = function()
    {
        if ($('#nm_estado_parceiro').length && $('#nm_cidade_parceiro').length) {
          //  window.onload = function() {
            new dgCidadesEstados({
              estado: document.getElementById('nm_estado_parceiro'),
              cidade: document.getElementById('nm_cidade_parceiro')
            });
        }               
        
        $('#cd_cep_parceiro').blur(function()
        {
            var cep = $('#cd_cep_parceiro').val();
            cep = cep.replace("-", "");
            P.buscaCep(cep);            
        });        
        
        $('#parceiros-produto').validate({
            rules :

            {
                nm_produto: "required",
                vl_produto: "required",
                pc_doacao_produto: "required",
                nm_link_produto: {
                    required : true,
                    url : true
                }
            },
            messages : {
                nm_produto: "Insira o nome do produto.",
                vl_produto: "Insira o valor do produto.",
                pc_doacao_produto: "Insira a porcentagem de doação para o produto.",
                nm_link_produto : {
                    required : "Insira o link do produto.",
                    url: "Insira uma URL válida"
                }
            }
        });

        $('#parceiros-add').validate({
            rules : 
            {
                nm_parceiro : "required",
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
                nm_site_parceiro : {required: true, url: true},
                cd_categoria_parceiro : "required",
                cd_cnpj_parceiro : {required: true, cnpj: true},
                nm_facebook_parceiro : {url : true},
                nm_twitter_parceiro : {url : true},
                pc_doacao_padrao : {number : true},
                nm_logo_parceiro : {
                    required : false,
                    accept: "image/*"
                }
            },
            messages : 
            {
                nm_parceiro : "Por favor, insira o nome da sua empresa.",
                nm_email_usuario : "Por favor, insira o email da empresa",
                nm_senha_usuario : {
                        required: "Por favor, insira uma senha!",
                        minlength: "A senha deve conter no mínimo 8 caracteres!"
                },
                nm_senha_usuario_confirma : {
                        required : "Confirme a senha!",
                        minlength : "A senha deve conter no mínimo 8 caracteres!",
                        equalTo : "As senhas digitadas devem corresponder!"
                },
                nm_site_parceiro : {
                    required: "O endereço do site é obrigatório para os parceiros.",
                    url: "Insira uma URL válida!"
                },
                cd_categoria_parceiro : "Selecione a categoria da sua empresa!",
                cd_cnpj_parceiro : {
                    required:"Informe o CNPJ da sua empresa!", 
                    cnpj: "Informe um CNPJ válido!"
                },
                nm_facebook_parceiro : {url : "Insira uma URL válida!"},
                nm_twitter_parceiro : {url : "Insira uma URL válida!"},
                pc_doacao_padrao : {number : "Insira um número!"},
                nm_logo_parceiro : {accept : "Apenas imagens são permitidas!"}
            }
        });

        $('.table-produtos .remove').on("click", function() {
            P.removerProduto();                  
        }); 

        /*var data = {ajax: true, search: encodeURIComponent('')};
        $.get(baseURL + 'parceiros/produtos', data, function(res) {
            console.log(res);
        }, "json");*/
        
    };

    P.removerProduto = function() {
        alertify.dialog('Deseja realmente remover este produto?')
          .set({
            'labels':{ok:'Sim', cancel:'Não'},                
            'onok': function() { 
                var data = {id : 'teste'};
                $.ajax({
                    url: baseURL + 'parceiros/remover-produto',
                    dataType: "json",
                    method: "POST",
                    data: data
                }).success(function(res) {
                    if (res.ret == 'ok') {
                        location.reload();    
                    }                        
                });                    
            },
            'oncancel': function() {                     
            }
          }).show();
    };

    P.buscaCep = function(cep) {
        if (cep != "")
        {
            $.getScript("http://cep.desenvolvefacil.com.br/BuscarCep.php?cep="+cep+"&ret=javascript", function(){
                //unescape - Decodifica uma string codificada
                var rua = unescape(resultadoCEP.tipologradouro)+' '+unescape(resultadoCEP.logradouro);
                var bairro = unescape(resultadoCEP.bairro);

                var cidade = unescape(resultadoCEP.cidade);
                var uf = unescape(resultadoCEP.uf);
                
                // preenche os campos
                $("#nm_endereco_parceiro").val(rua);
                $("#nm_bairro_parceiro").val(bairro);
                $("#nm_cidade_parceiro").val(cidade);
                $("#nm_cidade_parceiro option").each(function()
                {
                   if ($(this).val() == cidade)
                   {
                       $(this).attr("selected", "true");
                       return;
                   }
                });
                $("#nm_estado_parceiro").val(uf);
                $("#nm_estado_parceiro").trigger("change");
                $('#nm_cidade_endereco_parceiro').trigger("change");
                $('#nr_endereco_parceiro').focus();
            });
        }
    };
    
    $(function()
    {
       P.setDHTML(); 
    });
    
    return P;
})(); 