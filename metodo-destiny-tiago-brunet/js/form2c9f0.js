var preco = 2997;
var desconto = 1;

$(document).ready(function () {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let utm_source = params.utm_source;
  console.log("utm_source", utm_source);

  if (utm_source == null) {
    utm_source = "";
  }

  var isPix;
  var leadId;
  var dealId;
  var interval;
  var pixId;
  var checkPix;
  


  console.log('PRECO'+(preco*desconto));
  console.log('xxxxxxxxxxxxxxx');

  $("#ingressos-pix").change(function () {
    var descontovar = parseFloat($("#descontoval").val());

    var select = $("#w-dropdown-list-1 select");
    var parcelas = select.attr($(select).val());
    var valorTotal = (preco*descontovar*parcelas);
    console.log("preco:"+preco);
    console.log("desconto:"+descontovar);
    console.log("valorTotal:"+valorTotal);

    var valorFormatado = Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(valorTotal);

    $(".hack44-added-value").text(valorFormatado);
    $(".hack44-send-value").val(parcelas);
  });

  $("#w-dropdown-list-0").change(function () {
    var select = $("#w-dropdown-list-0 select");
    var valor = select.attr($(select).val());
    var parcelas = document.querySelectorAll(".parcelas div");

    parcelas.forEach((parcela) => {
      
      console.log('parcela.dataset.value',parcela.dataset.value);
      console.log('valor',valor);
      console.log('desconto',desconto);

      var newParcela = Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(parcela.dataset.value * valor *desconto);
      var span = parcela.querySelector("span");
      span.textContent = newParcela;
    });
  });

  var submitFormLead = function () {
    if (iti.isValidNumber()) {
      let submitButton = $("#initPurchase")[0];

      if (submitButton.classList.contains("is-submitting")) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      submitButton.classList.add("is-submitting");

      // $('input[type=submit]').prop('disabled', true);
      var name = $("#nome-comprador").val();
      var email = $("#email-comprador").val();
      var phone = $("#input-phone").val();

      var body = { name: name, email: email, phone: phone, origin: utm_source };
      createLead(name, email, phone);
      sendData("register", body).then((response) => {
        $("input[type=submit]").prop("disabled", false);
        if (response.success == true) {
          leadId = response.data.data.id;

          var formulario = document.querySelector("#formulario");
          formulario.classList.add("hide");

          var comprarIngresso = document.querySelector("#comprar-ingresso");
          comprarIngresso.classList.remove("hide");

          $("#nome-cartao").val(name);
          $("#nome-ingresso-1").val(name);
          $("#email-ingresso-1").val(email);
          $("#input-phone-1").val(phone);
        } else {
          // TODO: TRATAR ERRRO AO ENVIAR DADOS PARA O PIPEDRIVE MOSTRAR PARA O USUARIO QUE DEU RUIM
        }
      });
    } else {
      $("input[type=submit]").prop("disabled", false);
    }
  };

  var submitFormPix = function () {
    $("input[type=submit]").prop("disabled", true);
    var cpf = $("#cpf-pix").val();
    cpf = cpf.replaceAll(".", "");
    cpf = cpf.replaceAll("-", "");
    cpf = cpf.replaceAll("/", "");
    var quantidadeIngressos = $(".hack44-send-value").val();
    if (quantidadeIngressos == "") {
      quantidadeIngressos = 1;
    }
    var value = (preco*desconto);

    var monthSelect = document.querySelector(".button-turma.selected").dataset
      .month;
    var categorySelect = document.querySelector(".button-turma.selected")
      .dataset.category;
    var name = $("#nome-comprador").val();
    var email = $("#email-comprador").val();
    var country_code = iti.getSelectedCountryData().dialCode;
    var phone = $("#input-phone").val();
    var ddd = phone.slice(1, 3);
    ddd = Number(ddd);
    var phoneNumber = phone.slice(5);
    phoneNumber = phoneNumber.replaceAll("-", "");
    phoneNumber = Number(phoneNumber);
    var cupom = $("#cupom").val();

    var bodyPayment = {
      name: name,
      payment_method: 2,
      quantity: quantidadeIngressos,
      email: email,
      document: cpf,
      country_code: country_code,
      area_code: ddd,
      number: phoneNumber,
      category: categorySelect,
      cupom, cupom
    };

    sendData("payment", bodyPayment, "POST", true).then((response) => {
      $("input[type=submit]").prop("disabled", false);
      if (response.success == true) {
        createPurchase(value);
        // fbq("track", "Comprar", {
        //   value: value,
        //   transaction_id: response.id,
        //   product_id: monthSelect,
        //   payment_type: "pix",
        // });

        var data = response.data;

        if (data.status == "failed") {
          dealPaymentError();
        } else {
          $("#qrcode").attr("src", data.qr_code_url);
          document.getElementById("copy-qrcode").innerHTML = data.qr_code;
          document.getElementById("mini-qrcode").innerHTML = data.qr_code.slice(
            0,
            20
          );
          pixId = data.id;

          pixStatus(pixId, value, quantidadeIngressos);

          var comprarIngresso = document.querySelector("#comprar-ingresso");
          comprarIngresso.classList.add("hide");

          var pagamentoPix = document.querySelector("#pagamento-pix");
          pagamentoPix.classList.remove("hide");

          var pix = document.querySelector("#pix");
          pix.classList.remove("hide");

          countPix();
        }
      } else {
        dealPaymentError();
      }
    });
  };

  function pixStatus(id, value, quantidadeIngressos) {
    var monthSelect = document.querySelector(".button-turma.selected").dataset
      .month;
    var sellerName = getCookie("seller_name");

    checkPix = setInterval(function () {
      sendData("payment/" + id, null, "GET", true).then((response) => {
        if (response.success == true) {
          var data = response.data;

          if (data.status == "paid") {
            var body = {
              value: value,
              origin: utm_source,
              quantidade: quantidadeIngressos,
              leadId: leadId,
              forma: "pix",
              product_id: monthSelect,
              seller_name: sellerName,
            };
            createPurchase(value);
            // fbq("track", "Comprar", {
            //   value: value,
            //   transaction_id: response.id,
            //   product_id: monthSelect,
            //   payment_type: "credit",
            // });

            isPix = true;

            sendData("deal", body).then((response) => {
              if (response.success == true) {
                dealId = response.data.data.id;
                if (quantidadeIngressos > 1) {
                  for (var i = 0; i < quantidadeIngressos; i++) {
                    let ir = i + 1;
                    var ingresso = document.querySelector("#ingresso" + ir);
                    ingresso.classList.remove("hide");
                    $("#nome-ingresso-" + ir).attr("required", true);
                    $("#email-ingresso-" + ir).attr("required", true);
                    $("#input-phone-" + ir).attr("required", true);
                    $("#input-phone-" + ir).attr("data-number", ir);

                    var form = document.querySelector("#form-ingressos");
                    var config = {
                      attributes: true,
                      childList: true,
                      subtree: true,
                    };

                    var callback = function (mutationList, observer) {
                      for (const mutation of mutationList) {
                        if (mutation.type === "attributes") {
                          if (
                            mutation.attributeName === "aria-activedescendant"
                          ) {
                            let flag =
                              mutation.target.attributes[
                                "aria-activedescendant"
                              ].value;
                            let valueId =
                              mutation.target.parentElement.nextElementSibling
                                .dataset.number;
                            if (flag === `iti-${valueId}__item-br-preferred`) {
                              mutation.target.parentElement.nextElementSibling.placeholder =
                                "(11) 96123-4567";
                              $(
                                `#${mutation.target.parentElement.nextElementSibling.id}`
                              ).mask("(99) 99999-9999");
                              return;
                            }

                            if (flag === `iti-${valueId}__item-us-preferred`) {
                              mutation.target.parentElement.nextElementSibling.placeholder =
                                "(201) 555-0123";
                              $(
                                `#${mutation.target.parentElement.nextElementSibling.id}`
                              ).mask("(999) 999-9999");
                              return;
                            }

                            if (flag === `iti-${valueId}__item-pt-preferred`) {
                              mutation.target.parentElement.nextElementSibling.placeholder =
                                "912 345 678";
                              $(
                                `#${mutation.target.parentElement.nextElementSibling.id}`
                              ).mask("999 999 999");
                              return;
                            }
                          }
                        }
                      }
                    };
                    var observer = new MutationObserver(callback);
                    observer.observe(form, config);
                  }
                  dealSuccess();
                } else {
                  submitFormIngressos();
                }
              } else {
                dealPaymentError();
              }
            });
            clearInterval(interval);
            clearInterval(checkPix);
          } else if (data.status == "failed") {
            clearInterval(interval);
            clearInterval(checkPix);
            dealPaymentError();
          }
        } else {
          dealPaymentError();
        }
      });
    }, 10000);
  }

  function countPix() {
    var now = new Date();
    now.setMinutes(now.getMinutes() + 3);
    var countDownDate = now.getTime();

    // Update the count down every 1 second
    interval = setInterval(function () {
      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      // Display the result in the element
      document.getElementById("countdown").innerHTML =
        "0" + minutes + ":" + seconds;

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(interval);
        clearInterval(checkPix);

        var pix = document.querySelector("#pix");
        pix.classList.add("hide");

        var pixEsgotado = document.querySelector("#pix-esgotado");
        pixEsgotado.classList.remove("hide");
      }
    }, 5000);
  }

  // remove status selecionado da turma e adiciona ao clique
  $(".button-turma").on("click", function () {
    $(".button-turma").removeClass("selected");
    $(this).addClass("selected");

    // trata a questão de boston não ter desconto
    if($(this).hasClass('no-discount')){
      desconto=1;
      $("#cupom").val('');
      $("#cupom").change();
      $("#cupom").parent().fadeOut();
      $("#ingressos-pix").change();
      $("#w-dropdown-list-0").change();
    } else{
      $("#cupom").parent().fadeIn();
    }
  });

  // remove status selecionado das parcelas e adiciona ao clique
  $(".button-selectable").on("click", function () {
    $(".button-selectable").removeClass("selected");
    $(this).addClass("selected");
  });

  var submitFormDeal = function () {
    let submitButton = $("#payment")[0];

    if (submitButton.classList.contains("is-submitting")) {
      // e.preventDefault();
      // e.stopPropagation();
      return false;
    }

    submitButton.classList.add("is-submitting");

    // $('input[type=submit]').prop('disabled', true);
    var select = $("#w-dropdown-list-0 select");
    var quantidadeIngressos = select.attr($(select).val());
    var select2 = document.querySelector(".parcelas .selected div");
    var parcelas = select2.dataset.payment;
    var numeroCartao = $("#card-number").val();
    numeroCartao = numeroCartao.replaceAll(" ", "");
    var nomeCartao = $("#nome-cartao").val();
    var monthSelect = document.querySelector(".button-turma.selected").dataset
      .month;
    var categorySelect = document.querySelector(".button-turma.selected")
      .dataset.category;

    var dataExpiracao = $("#expiration-date").val();
    var result = dataExpiracao.split("/");
    var mesExp = result[0];
    var anoExp = result[1];

    var cvv = $("#cvv").val();
    var cpf = $("#cpf2").val();
    cpf = cpf.replaceAll(".", "");
    cpf = cpf.replaceAll("-", "");
    cpf = cpf.replaceAll("/", "");

    var value = parseInt(select2.dataset.value) * parcelas;

    var name = $("#nome-comprador").val();
    var email = $("#email-comprador").val();
    var country_code = iti.getSelectedCountryData().dialCode;
    var phone = $("#input-phone").val();
    var ddd = phone.slice(1, 3);
    var phoneNumber = phone.slice(5);
    phoneNumber = phoneNumber.replaceAll("-", "");
    phoneNumber = Number(phoneNumber);
    var sellerName = getCookie("seller_name");
    var cupom = $("#cupom").val();

    var bodyPayment = {
      name: name,
      payment_method: 1,
      card_number: numeroCartao,
      holder_name: nomeCartao,
      exp_month: mesExp,
      exp_year: anoExp,
      cvv: cvv,
      quantity: quantidadeIngressos,
      email: email,
      document: cpf,
      country_code: country_code,
      area_code: ddd,
      number: phoneNumber,
      installments: parcelas,
      category: categorySelect,
      cupom:cupom
    };

    sendData("payment", bodyPayment, "POST", true).then((response) => {
      if (response.success == true) {
        var body = {
          value: value,
          parcelas: parcelas,
          origin: utm_source,
          quantidade: quantidadeIngressos,
          leadId: leadId,
          forma: "credit",
          product_id: monthSelect,
          seller_name: sellerName,
        };
        createPurchase(value);
        // fbq("track", "Comprar", {
        //   value: value,
        //   transaction_id: response.id,
        //   product_id: monthSelect,
        //   payment_type: "credit",
        // });

        sendData("deal", body).then((response) => {
          $("input[type=submit]").prop("disabled", false);
          if (response.success == true) {
            dealId = response.data.data.id;

            if (quantidadeIngressos > 1) {
              for (var i = 0; i < quantidadeIngressos; i++) {
                let ir = i + 1;
                var ingresso = document.querySelector("#ingresso" + ir);
                ingresso.classList.remove("hide");
                $("#nome-ingresso-" + ir).attr("required", true);
                $("#email-ingresso-" + ir).attr("required", true);
                $("#input-phone-" + ir).attr("required", true);
                $("#input-phone-" + ir).attr("data-number", ir);

                var form = document.querySelector("#form-ingressos");
                var config = {
                  attributes: true,
                  childList: true,
                  subtree: true,
                };

                var callback = function (mutationList, observer) {
                  for (const mutation of mutationList) {
                    if (mutation.type === "attributes") {
                      if (mutation.attributeName === "aria-activedescendant") {
                        let flag =
                          mutation.target.attributes["aria-activedescendant"]
                            .value;
                        let valueId =
                          mutation.target.parentElement.nextElementSibling
                            .dataset.number;
                        if (flag === `iti-${valueId}__item-br-preferred`) {
                          mutation.target.parentElement.nextElementSibling.placeholder =
                            "(11) 96123-4567";
                          $(
                            `#${mutation.target.parentElement.nextElementSibling.id}`
                          ).mask("(99) 99999-9999");
                          return;
                        }

                        if (flag === `iti-${valueId}__item-us-preferred`) {
                          mutation.target.parentElement.nextElementSibling.placeholder =
                            "(201) 555-0123";
                          $(
                            `#${mutation.target.parentElement.nextElementSibling.id}`
                          ).mask("(999) 999-9999");
                          return;
                        }

                        if (flag === `iti-${valueId}__item-pt-preferred`) {
                          mutation.target.parentElement.nextElementSibling.placeholder =
                            "912 345 678";
                          $(
                            `#${mutation.target.parentElement.nextElementSibling.id}`
                          ).mask("999 999 999");
                          return;
                        }
                      }
                    }
                  }
                };
                var observer = new MutationObserver(callback);
                observer.observe(form, config);
              }
              dealSuccess();
            } else {
              submitFormIngressos();
            }
          } else {
            dealPaymentError();
          }
        });
      } else {
        $("input[type=submit]").prop("disabled", false);
        dealPaymentError();
      }
    });

    // dealNetworkError();
    // dealPaymentError();
  };

  function dealSuccess() {
    var comprarIngresso = document.querySelector("#comprar-ingresso");
    comprarIngresso.classList.add("hide");

    var pagamento = document.querySelector("#pagamento-pix");
    pagamento.classList.add("hide");

    var informacoesAdicionais = document.querySelector(
      "#informacoes-adicionais"
    );
    informacoesAdicionais.classList.remove("hide");
  }

  function dealNetworkError() {
    var comprarIngresso = document.querySelector("#step-comprar-ingresso");
    comprarIngresso.classList.add("hide");

    var erroConexao = document.querySelector("#erro-conexao");
    erroConexao.classList.remove("hide");
  }

  function dealPaymentError() {
    var comprarIngresso = document.querySelector("#step-comprar-ingresso");
    comprarIngresso.classList.add("hide");

    var erroPagamento = document.querySelector("#erro-pagamento");
    erroPagamento.classList.remove("hide");
  }

  $("#w-tabs-0-data-w-tab-0").click(function () {
    var labelCartao = document.querySelector("#label-cartao");
    labelCartao.classList.remove("hide");

    var labelPix = document.querySelector("#label-pix");
    labelPix.classList.add("hide");
  });

  $("#w-tabs-0-data-w-tab-1").click(function () {
    var labelCartao = document.querySelector("#label-cartao");
    labelCartao.classList.add("hide");

    var labelPix = document.querySelector("#label-pix");
    labelPix.classList.remove("hide");
  });

  $(".tryAgainPayment").click(function () {
    var comprarIngresso = document.querySelector("#step-comprar-ingresso");
    comprarIngresso.classList.remove("hide");

    var erroPagamento = document.querySelector("#erro-pagamento");
    erroPagamento.classList.add("hide");
  });

  $(".tryAgainPix").click(function () {
    document.getElementById("countdown").innerHTML = "03:00";
    submitFormPix();

    setTimeout(function () {
      var pix = document.querySelector("#pix");
      pix.classList.remove("hide");

      var pixEsgotado = document.querySelector("#pix-esgotado");
      pixEsgotado.classList.add("hide");
    }, 1000);
  });

  $(".back-to-formulario").click(function () {
    var formulario = document.querySelector("#formulario");
    formulario.classList.remove("hide");

    var comprarIngresso = document.querySelector("#comprar-ingresso");
    comprarIngresso.classList.add("hide");

    var pixEsgotado = document.querySelector("#pix-esgotado");
    pixEsgotado.classList.add("hide");

    var pix = document.querySelector("#pix");
    pix.classList.add("hide");

    var pagamento = document.querySelector("#pagamento-pix");
    pagamento.classList.add("hide");
    clearInterval(interval);
    clearInterval(checkPix);
  });

  $(".back-to-comprar-ingresso").click(function () {
    var informacoesAdicionais = document.querySelector(
      "#informacoes-adicionais"
    );
    informacoesAdicionais.classList.add("hide");

    var comprarIngresso = document.querySelector("#comprar-ingresso");
    comprarIngresso.classList.remove("hide");
  });

  var submitFormIngressos = function () {
    $("input[type=submit]").prop("disabled", true);
    var listaIngressos = [];

    if (isPix) {
      var select = $("#w-dropdown-list-1 select");
    } else {
      var select = $("#w-dropdown-list-0 select");
    }

    var quantidadeIngressos = select.attr($(select).val());
    for (var i = 0; i < quantidadeIngressos; i++) {
      ir = i + 1;
      var name = document.querySelector("#nome-ingresso-" + ir).value;
      var email = document.querySelector("#email-ingresso-" + ir).value;
      var phone = document.querySelector("#input-phone-" + ir).value;

      var ingresso = {
        name: name,
        email: email,
        phone: phone,
      };

      listaIngressos.push(ingresso);
    }

    var body = { ingressos: listaIngressos, dealId: dealId };

    sendData("tickets", body).then((response) => {
      $("input[type=submit]").prop("disabled", false);
      if (response.success == true) {
        if (quantidadeIngressos > 1) {
          var informacoesAdicionais = document.querySelector(
            "#informacoes-adicionais"
          );
          informacoesAdicionais.classList.add("hide");

          var formulario = document.querySelector("#formulario");
          formulario.classList.remove("hide");

          var comprarIngresso = document.querySelector("#comprar-ingresso");
          comprarIngresso.classList.add("hide");

          var pixEsgotado = document.querySelector("#pix-esgotado");
          pixEsgotado.classList.add("hide");

          var pix = document.querySelector("#pix");
          pix.classList.add("hide");

          var pagamento = document.querySelector("#pagamento-pix");
          pagamento.classList.add("hide");
          clearInterval(interval);

          var erroPagamento = document.querySelector("#erro-pagamento");
          erroPagamento.classList.add("hide");
        }
        finalizarCompra();
      } else {
        var erroPagamento = document.querySelector("#erro-pagamento");
        erroPagamento.classList.remove("hide");
      }
    });
  };

  function finalizarCompra() {
    setCookie("compraFinalizada", "true", 30);

    var boston = $("#boston").val();

    if (boston) {
      window.location.href = "sucesso-boston.html";
    } else {
      window.location.href = "sucesso.html";
    }
  }

  var formLead = document.querySelector("#form-lead");
  formLead.addEventListener("submit", submitFormLead);

  var formPix = document.querySelector("#wf-form-cpf");
  formPix.addEventListener("submit", submitFormPix);

  var formDeal = document.querySelector("#form-deal");
  formDeal.addEventListener("submit", submitFormDeal);

  var formIngressos = document.querySelector("#form-ingressos");
  formIngressos.addEventListener("submit", submitFormIngressos);

  function sendData(url, body, method = "POST", protected = false) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("'Access-Control-Allow-Origin'", "*");
    myHeaders.append("'Access-Control-Allow-Headers'", "*");
    myHeaders.append(
      "'Access-Control-Allow-Methods'",
      "POST, PUT, DELETE, GET, OPTIONS"
    );
    myHeaders.append("'Access-Control-Request-Method'", "*");

    if (protected == true) {
      myHeaders.append(
        "23d2c4cce16d798ea2ae89b55cedc4ac",
        "eyJhbGciOiJIUzI1NiJ9.MQ.n51BZI73vujPUrQoueuUjAkkYav53_6bUorTAGzdoks"
      );
    }

    var urlParams = {
      headers: myHeaders,
      method: method,
      body: body && JSON.stringify(body),
    };

    let dns;

    if (window.location.hostname == "destiny-front.hero99.guide") {
      dns = "https://destiny-api.hero99.guide/v1/";
    } else {
      dns = "https://api.metododestiny.com.br/v1/";
    }

    return fetch(dns + url, urlParams)
      .then((response) => response.json())
      .then((json) => {
        if (json.statusCode && json.statusCode == 500) {
          return { success: false, data: json.error };
        } else {
          return { success: true, data: json };
        }
      })
      .catch((error) => {
        console.log(error);
        return { success: false, data: error };
      });
  }

  var inputPhone = document.querySelector("#input-phone");
  (errorMsg = document.querySelector("#error-msg")),
    (validMsg = document.querySelector("#valid-msg"));
  var errorMap = [
    "Número inválido",
    "Invalid country code",
    "Número inválido",
    "Número inválido",
    "Número inválido",
  ];
  var iti = window.intlTelInput(inputPhone, {
    geoIpLookup: function (callback) {
      $.get("https://ipinfo.io", function () {}, "jsonp").always(function (
        resp
      ) {
        var countryCode = resp && resp.country ? resp.country : "br";
        callback(countryCode);
      });
    },
    preferredCountries: ["br", "us", "pt"],
  });

  var reset = function () {
    inputPhone.classList.remove("error");
    errorMsg.innerHTML = "";
    errorMsg.classList.add("hide");
    validMsg.classList.add("hide");
  };

  inputPhone.addEventListener("blur", function () {
    reset();
    if (inputPhone.value.trim()) {
      if (iti.isValidNumber()) {
        errorMsg.classList.add("hide");
        validMsg.classList.remove("hide");
      } else {
        inputPhone.classList.add("error");
        var errorCode = iti.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove("hide");
      }
    }
  });
  inputPhone.addEventListener("change", reset);
  inputPhone.addEventListener("keyup", reset);

  //    function limpa_formulário_cep() {
  //     // Limpa valores do formulário de cep.
  //     $("#rua").val("");
  //     $("#bairro").val("");
  //     $("#cidade").val("");
  //     $("#estado").val("");
  //   }

  //   $("#cep").blur(function() {
  //     //Nova variável "cep" somente com dígitos.
  //     var cep = $(this).val().replace(/\D/g, '');
  //     //Verifica se campo cep possui valor informado.
  //     if (cep != "") {
  //         //Expressão regular para validar o CEP.
  //         var validacep = /^[0-9]{8}$/;
  //         //Valida o formato do CEP.
  //         if(validacep.test(cep)) {
  //             //Preenche os campos com "..." enquanto consulta webservice.
  //             $("#rua").val("...");
  //             $("#bairro").val("...");
  //             $("#cidade").val("...");
  //             $("#estado").val("...");
  //             //Consulta o webservice viacep.com.br/
  //             $.getJSON("https://viacep.com.br/ws/"+ cep +"/json/?callback=?", function(dados) {
  //                 if (!("erro" in dados)) {
  //                     //Atualiza os campos com os valores da consulta.
  //                     $("#rua").val(dados.logradouro);
  //                     $("#bairro").val(dados.bairro);
  //                     $("#cidade").val(dados.localidade);
  //                     $("#estado").val(dados.uf);
  //                 } //end if.
  //                 else {
  //                     //CEP pesquisado não foi encontrado.
  //                     limpa_formulário_cep();
  //                     alert("CEP não encontrado.");
  //                 }
  //             });
  //         } //end if.
  //         else {
  //             //cep é inválido.
  //             limpa_formulário_cep();
  //             alert("Formato de CEP inválido.");
  //         }
  //     } //end if.
  //     else {
  //         //cep sem valor, limpa formulário.
  //         limpa_formulário_cep();
  //     }
  // });

  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function getAttendance() {
    var attendance = window.location.search.replace("?seller_name=", "");

    if (attendance) {
      if (window.location.search.includes("?seller_name")) {
        attendance = attendance.replaceAll("-", " ");
        setCookie("seller_name", attendance, 30);
        var sellerName = getCookie("seller_name");

        var elementAttendanceContainer = document.querySelector(".seller");
        var elementAttendanceName = document.querySelector(".seller-name");

        elementAttendanceContainer.style.cssText = "display: flex;";
        elementAttendanceName.style.cssText = "text-transform: capitalize;";

        elementAttendanceName.textContent = sellerName;
      }
      attendance = undefined;
    } else {
      attendance = undefined;
      setCookie("seller_name", attendance, 30);
    }
  }

  getAttendance();
});







document.addEventListener("DOMContentLoaded", function() {
    // Seleciona o campo de cupom e a div de resposta
    var cupomInput = document.getElementById("cupom");
    var respostaDiv = document.getElementById("cupom-resposta");

    // Verifica se ambos os elementos existem na página
    if (cupomInput && respostaDiv) {
        // Função que será executada quando o valor do campo mudar
        function monitorarCupom() {
            var valorCupom = cupomInput.value.trim(); // Remove espaços em branco

            const cuponsValidos50 = ["mind50", "inside50"];
            const cuponsValidos30 = ["mind30"];
            const cuponsEspecifico = ["odespertar"];

            if (cuponsValidos50.includes(valorCupom.toLowerCase())) {
                respostaDiv.textContent = "Cupom de 50% de desconto válido.";
                respostaDiv.style.color = "green"; // Pinta o texto de verde
                desconto = 0.5;

            } else if (cuponsValidos30.includes(valorCupom.toLowerCase())) {
                respostaDiv.textContent = "Cupom de 30% de desconto válido.";
                respostaDiv.style.color = "green"; // Pinta o texto de verde
                desconto = 0.7;


            } else if (cuponsEspecifico.includes(valorCupom.toLowerCase())) {
                respostaDiv.textContent = "Cupom de 33% de desconto válido.";
                respostaDiv.style.color = "green"; // Pinta o texto de verde
                desconto = 0.666333;

            } else if (valorCupom === "") {
                respostaDiv.textContent = ""; // Limpa o conteúdo da div
                desconto = 1;
            } else {
                respostaDiv.textContent = "Cupom inválido.";
                respostaDiv.style.color = "red"; // Pinta o texto de vermelho
                desconto = 1;
            }
            $("#descontoval").val(desconto);

                  $("#ingressos-pix").change();
                  $("#w-dropdown-list-0").change();
        }

        // Adiciona um listener para o evento 'input' (executa a função a cada mudança no campo)
        cupomInput.addEventListener("input", monitorarCupom);
    } else {
        console.log("Campo cupom ou div de resposta não encontrados.");
    }

    
});
