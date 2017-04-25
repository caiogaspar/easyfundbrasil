var causas = (function()
{
    var C = {};
    
    C.setDHTML = function()
    {        
        $('.nextBtn').on("click", function() {
            var $tabAtual = $('.nav-tabs li.active');
            $tabAtual.next().addClass("active");
            $tabAtual.removeClass("active");            
            var $tabContentAtual = $('.tab-content .tab-pane.active');
            $tabContentAtual.next().addClass("active");
            $tabContentAtual.removeClass("active");            
        });
        
        $('#cd_cep_causa').mask('99999-999');
        
        $('#cd_cep_causa').blur(function()
        {
            var cep = $('#cd_cep_causa').val();
            cep = cep.replace("-", "");
            if (cep != "")
            {
                $.getScript("http://cep.desenvolvefacil.com.br/BuscarCep.php?cep="+cep+"&ret=javascript", function(){
                    //unescape - Decodifica uma string codificada
                    var rua = unescape(resultadoCEP.tipologradouro)+' '+unescape(resultadoCEP.logradouro);
                    var bairro = unescape(resultadoCEP.bairro);
                    var cidade = unescape(resultadoCEP.cidade);
                    var uf = unescape(resultadoCEP.uf);
                    
                    // preenche os campos
                    $("#nm_endereco_causa").val(rua);
                    $("#nm_bairro_endereco_causa").val(bairro);
                    $("#nm_cidade_endereco_causa").val(cidade);
                    $("#sg_uf_endereco_causa").val(uf);
                    $("#sg_uf_endereco_causa").trigger("change");
                    $('#nm_cidade_endereco_causa').trigger("change");
                    $('#nr_endereco_causa').focus();
                });
            }
        });
        
        $('#causas-add').validate
        ({
            rules : 
            {
                nm_causa : "required",
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
                nm_responsavel_causa : "required",
                cd_categoria_causa : "required",
                nm_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nr_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nm_bairro_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nr_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nm_bairro_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_bairro_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nr_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_cidade_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_bairro_endereco_causa').is(":empty") == false &&
                                $('#nr_endereco_causa').is(":empty") === false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                sg_uf_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_bairro_endereco_causa').is(":empty") == false &&
                                $('#nr_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_logo_causa : {
                    required : false,
                    accept: "image/*"
                }
            },
            messages : 
            {
                nm_causa : "Por favor, insira o nome da causa.",
                nm_email_usuario : "Por favor, insira o email da causa",
                nm_senha_usuario : {
                        required: "Por favor, insira uma senha!",
                        minlength: "A senha deve conter no mínimo 8 caracteres!"
                },
                nm_senha_usuario_confirma : {
                        required : "Confirme a senha!",
                        minlength : "A senha deve conter no mínimo 8 caracteres!",
                        equalTo : "As senhas digitadas devem corresponder!"
                },
                nm_responsavel_causa : "Insira o nome do responsavel pela causa!",
                cd_categoria_causa : "Selecione a categoria da causa!",
                nm_endereco_causa : {
                    required : "Informe o endereço da sua causa!"
                },
                nr_endereco_causa : {
                    required : "Informe o número do local!"
                },
                nm_bairro_endereco_causa : {
                    required : "Informe o bairro do local!"
                },
                nm_cidade_endereco_causa : {
                    required : "Selecione a cidade da sua causa!"
                },
                sg_uf_endereco_causa : {
                    required : "Selecione a UF da sua causa!"
                },
                nm_logo_causa : {
                    accept: "Só são aceitas imagens!"
                }
                
            }
        });            
    
        $("#nm_logo_causa").on("change", function(){
            C.readURL(this);
        });                        

        $('#cpf_cnpj_titular_conta').keypress(function() {
            return C.mascara(document.getElementById('cpf_cnpj_titular_conta'));
        });

        C.validarFormularioEdicao();
        C.validarFormasRecebimento();
    };

    C.validarFormularioEdicao = function() {
        $('#edit-causa').validate
        ({
            rules : 
            {
                nm_causa : "required",
                nm_email_usuario : {
                        required : true,
                        email : true
                },                
                nm_responsavel_causa : "required",
                cd_categoria_causa : "required",
                nm_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nr_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nm_bairro_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nr_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nm_bairro_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_bairro_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "" &&
                                $('#nr_endereco_causa').is(":empty") == false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_cidade_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_bairro_endereco_causa').is(":empty") == false &&
                                $('#nr_endereco_causa').is(":empty") === false && $('#sg_uf_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                sg_uf_endereco_causa : {
                    required : {
                        depends : function(element)
                        {
                            if ($('#nm_endereco_causa').is(":empty") == false && $('#nm_bairro_endereco_causa').is(":empty") == false &&
                                $('#nr_endereco_causa').is(":empty") == false && $('#nm_cidade_endereco_causa').val() != "")
                            {
                                return true;
                            }
                            
                            return false;
                        }
                    }
                },
                nm_logo_causa : {
                    required : false,
                    accept: "image/*"
                }
            },
            messages : 
            {
                nm_causa : "Por favor, insira o nome da causa.",
                nm_email_usuario : "Por favor, insira o email da causa",                
                nm_responsavel_causa : "Insira o nome do responsavel pela causa!",
                cd_categoria_causa : "Selecione a categoria da causa!",
                nm_endereco_causa : {
                    required : "Informe o endereço da sua causa!"
                },
                nr_endereco_causa : {
                    required : "Informe o número do local!"
                },
                nm_bairro_endereco_causa : {
                    required : "Informe o bairro do local!"
                },
                nm_cidade_endereco_causa : {
                    required : "Selecione a cidade da sua causa!"
                },
                sg_uf_endereco_causa : {
                    required : "Selecione a UF da sua causa!"
                },
                nm_logo_causa : {
                    accept: "Só são aceitas imagens!"
                }
                
            }
        });
    };

    C.validarFormasRecebimento = function() {
        $('#edit-forma-recebimento').validate
        ({
            rules : 
            {
                banco_id: "required",                
                cpf_cnpj_titular_conta : "required",                
                nr_agencia : "required",
                nr_conta_banco : "required"
            },
            messages : 
            {
                banco_id : "Por favor, selecione o banco da conta.",
                cpf_cnpj_titular_conta : "Por favor, insira o CPF ou CNPJ do titular da conta.",                                                
                nr_agencia : "Por favor, insira o número da agência desta conta.",
                nr_conta_banco : "Por favor, insira o número da conta."
            }
        });
    };

    C.readURL = function(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('.profile-photo').attr('src', e.target.result);
            }
            
            reader.readAsDataURL(input.files[0]);
        }
    }

    C.mascara = function(str) {
        // Caso passe de 14 caracteres será formatado como CNPJ 
        if (str.value.length > 14)                       
            str.value = C.cnpj(str.value);
        // Caso contrário como CPF
        else                           
            str.value = C.cpf(str.value);
    };
 
    // Funcao de formatacao CPF
    C.cpf = function(valor) {
        // Remove qualquer caracter digitado que não seja numero
        valoralor = valor.replace(/\D/g, "");                   
 
        // Adiciona um ponto entre o terceiro e o quarto digito
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
 
        // Adiciona um ponto entre o terceiro e o quarto dígitos 
        // desta vez para o segundo bloco      
        valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
 
        // Adiciona um hifen entre o terceiro e o quarto dígitos
        valor = valor.replace(/(\d{3})(\d)$/, "$1-$2");     
        return valor;
    };
 
    // Funcao de formatacao CNPJ
    C.cnpj = function(valor) {
        // Remove qualquer caracter digitado que não seja numero
        valor = valor.replace(/\D/g, "");                           
 
        // Adiciona um ponto entre o segundo e o terceiro dígitos
        valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
 
        // Adiciona um ponto entre o quinto e o sexto dígitos
        valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
 
        // Adiciona uma barra entre o oitavaloro e o nono dígitos
        valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
 
        // Adiciona um hífen depois do bloco de quatro dígitos
        valor = valor.replace(/(\d{4})(\d)/, "$1-$2");              
        return valor;
    };
    
    $(function()
    {
       C.setDHTML();
    });
    
    return C;
})();