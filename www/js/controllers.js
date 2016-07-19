angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Cria o modal de login
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Fecha o modal login
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Exibe o modal login
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
  
  // Cria o modal perfil
  $ionicModal.fromTemplateUrl('perfil.html', {
    scope: $scope
  }).then(function(modalPerfil) {
    $scope.modalPerfil = modalPerfil;
  });

  // Fecha o modal perfil
  $scope.closePerfil = function() {
    $scope.modalPerfil.hide();
  };

  // Exibe o modal perfil
  $scope.perfil = function() {
    $scope.modalPerfil.show();
  };

  // Cria o modal editar perfil
  $ionicModal.fromTemplateUrl('editarPerfil.html', {
    scope: $scope
  }).then(function(modalEditarPerfil) {
    $scope.modalEditarPerfil = modalEditarPerfil;
  });

  // Fecha o modal editar perfil
  $scope.closeEditarPerfil = function() {
    $scope.modalEditarPerfil.hide();
  };

  // Exibe o modal editar perfil
  $scope.editarPerfil = function() {
    $scope.modalEditarPerfil.show();
  };

  // Cria o modal do chat
  $ionicModal.fromTemplateUrl('chat.html', {
    scope: $scope
  }).then(function(modalChat) {
    $scope.modalChat = modalChat;
  });

  // Fecha o modal chat
  $scope.closeChat = function() {
    $scope.modalChat.hide();
  };

  // Exibe o modal chat
  $scope.chat = function() {
    $scope.modalChat.show();
  };
})

.controller('ListaComprasCtrl', ['$scope', '$ionicModal', '$cordovaActionSheet', '$cordovaVibration', '$ionicPopup', '$timeout', 'Compras', 'BD', function($scope, $ionicModal, $cordovaActionSheet, $cordovaVibration, $ionicPopup, $timeout, Compras, BD) {
  var db = new PouchDB('compras');
  
  var remoteDB = new PouchDB('http://localhost:5984/compras');
  
  
$timeout(function(){
    $scope.sincronizaBDs();
  }, 3000);
  $scope.sincronizaBDs = function() {
    /*
    BD.sincronizaBDs().then(function(response) {
      $scope.allDocs();
    })
*/
    
    db.sync(remoteDB, {
      live: true,
      retry: true
    }).on('change', function (change) {
      // Ocorreu uma alteração!
      $scope.allDocs();
    }).on('paused', function (info) {
      // replicação pausada, normalmente por que o usuário está offline
    }).on('active', function (info) {
      // replicação continuada
    }).on('error', function (err) {
      // erro desconhecido, normalmente não deveria acontecer
    });

  }

  $scope.allDocs = function () {
    Compras.all().then(function(response) {
        $scope.comprasAbertas = response;
        $scope.$apply();
    })
  }

  $scope.deleteDoc = function (doc, rev) {
    Compras.delete(doc, rev).then(function(response) {
      if (response) {
        $ionicPopup.alert({ title: 'Aviso', template: 'Exclusão realizada com sucesso!' });
        $scope.allDocs();
      }
    })
  }

  $scope.allDocs();

  // Lista de compras
  /*
  $scope.comprasAbertas = [
    { link: '#/app/detalhes/', img: 'img/perfil.jpg', title: 'TV - 42, 4k, Samsung', data: '09/05/2016', texto: 'Nenhuma oferta.' },
    { link: '#/app/detalhes/', img: 'img/perfil.jpg', title: 'Abastecer', data: '09/05/2016', texto: 'Nenhuma oferta.'}
  ];

  $scope.comprasAtendimento = [
  { link: '#/app/detalhes/', img: 'img/perfil.jpg', title: 'Chaleira Tramontina', data: '09/05/2016', texto: 'Douglas, a Ponto Frio fez uma oferta.'}
    
  ];

  $scope.comprasFechadas = [
    { link: '#/app/detalhes/', img: 'img/perfil.jpg', title: 'Notebook', data: '09/05/2016', texto: 'Compra fechada.' },
    { link: '#/app/detalhes/', img: 'img/perfil.jpg', title: 'Teclado', data: '09/05/2016', texto: 'Compra fechada.' }
  ];
  */
  // Cria o modal de compras
  $ionicModal.fromTemplateUrl('novaCompra.html', {
    scope: $scope
  }).then(function(modalNovaCompra) {
    $scope.modalNovaCompra = modalNovaCompra;
  });

  // Fecha o modal de compras
  $scope.closeNovaCompra = function() {
    $scope.modalNovaCompra.hide();
  };

  // Exibe o modal de compras
  $scope.novaCompra = function() {
    $scope.modalNovaCompra.show();
  };

  // Cria o modal de editar compras
  $ionicModal.fromTemplateUrl('editarCompra.html', {
    scope: $scope
  }).then(function(modalEditarCompra) {
    $scope.modalEditarCompra = modalEditarCompra;
  });

  // Fecha o modal de editar compras
  $scope.closeEditarCompra = function() {
    $scope.modalEditarCompra.hide();
  };

  // Exibe o modal de editar compras
  $scope.editarCompra = function() {
    $scope.modalEditarCompra.show();
  };

  // Exibe as ações disponíveis para a compra selecionada, editar e excluir
  $scope.showActions = function(item, id, rev) {
    // Faz o celular vibrar ao exibir as ações
    $cordovaVibration.vibrate(80);
    var options = {
      buttonLabels: ['Editar', 'Fechar Compra'],
      androidEnableCancelButton : true,
      winphoneEnableCancelButton : true,
      addDestructiveButtonWithLabel : 'Excluir'
    };

    document.addEventListener("deviceready", function () {
      $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
          var index = btnIndex;
          if (index === 1) {
            //$scope.showConfirm('Excluir', 'Você deseja realmente excluir essa compra?', id, rev);
            $scope.deleteDoc(id, rev);
          } else if (index === 2) {
            $scope.editarCompra();
          } else if (index === 3) {
            $scope.showConfirm('Fechar Compra', 'Você deseja realmente fechar essa compra?');
          }
        });
    }, false);
  };

  // Popup de confirmação
  $scope.showConfirm = function(title, template, id, rev) {
    $cordovaVibration.vibrate(80);
    var confirmPopup = $ionicPopup.confirm({
      title: title,
      template: template,
      buttons: [{ text: 'Cancelar' , type: 'button-assertive'},{ text: 'Ok', type: 'button-positive' }], 
    });

    confirmPopup.then(function(res) {
      if(res) {
        $scope.deleteDoc(id, rev);
        $scope.showAlert();
      } else {
        console.log("Cancelou");
        $scope.deleteDoc(id, rev);
      }
    });
  };

  // Alert de ação realizada com sucesso
 $scope.showAlert = function() {
   var alertPopup = $ionicPopup.alert({
     title: 'Aviso',
     template: 'Ação realizada com sucesso!'
   });

   alertPopup.then(function(res) {
     console.log('Thank you for not eating my delicious ice cream cone');
   });
 };
}])

.controller('DetalhesCtrl', function($scope, $stateParams) {
  $scope.compra = $stateParams.compra;
  $scope.ofertas = [
    {loja: 'Ponto Frio', imgEmpresa: 'img/pontoFrio.png', imgProd: 'img/chaleira2.jpg', dataComp: 'Abril 21, 2016, 10:00hrs', descProd: 'Chaleira 1.9 Litros Vivacor 20618419 Tramontina', preco: 'R$ 85,50', parcelas: '2x com juros de R$ 43,58'},
    {loja: 'Americanas', imgEmpresa: 'img/americanas.jpg', imgProd: 'img/chaleira.jpg', dataComp: 'Abril 21, 2016, 09:30hrs', descProd: 'Chaleira Apito Fixo Vermelha 2 litros - Tramontina', preco: 'R$ 87,00', parcelas: '4x de R$ 21,75 sem juros'}
  ];
})

.controller('LoginCtrl', function($scope, $ionicModal) {
  // Cria o modal de cadastro
  $ionicModal.fromTemplateUrl('cadastroUsuario.html', {
    scope: $scope
  }).then(function(modalCadastroUsuario) {
    $scope.modalCadastroUsuario = modalCadastroUsuario;
  });

  // Fecha o modal de cadastro
  $scope.closeCadastroUsuario = function() {
    $scope.modalCadastroUsuario.hide();
  };

  // Exibe o modal de cadastro
  $scope.cadastroUsuario = function() {
    $scope.modalCadastroUsuario.show();
  };
})

.controller('CadastroUsuarioCtrl', function($scope) {
  
})

.controller('PerfilCtrl', function($scope, $cordovaCamera, $cordovaActionSheet) {
  $scope.nomeCompleto = "Douglas Bilhar";
  $scope.endereco = "Rua Herminio Dal Mas, 430, Bl 1, Ap 14, Erechim-RS";
  $scope.login = "douglasb";

  $scope.showOpcoesFoto = function() {
    var options = {
      buttonLabels: ['Câmera', 'Galeria'],
      androidEnableCancelButton : true,
      winphoneEnableCancelButton : true,
    };

    document.addEventListener("deviceready", function () {
      $cordovaActionSheet.show(options)
        .then(function(btnIndex) {
          var index = btnIndex;
          if (index === 1) {
            $scope.fotoCamera();
          } else if (index === 2) {
            $scope.fotoGaleria();
          }
        });
    }, false);
  }


  $scope.fotoCamera = function() {
    document.addEventListener("deviceready", function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        
      });

    }, false);
  }

  $scope.fotoGaleria = function() {
    document.addEventListener("deviceready", function () {

      var options = {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 100,
        targetHeight: 100,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false,
        correctOrientation:true
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        var image = document.getElementById('myImage');
        $scope.imgURI = "data:image/jpeg;base64," + imageData;
      }, function(err) {
       
      });

    }, false);
  }

})

.controller('IntroducaoCtrl', function($scope, $ionicSlideBoxDelegate) {
  $scope.nextSlide = function() {
    $ionicSlideBoxDelegate.next();
  }
  $scope.previousSlide = function() {
    $ionicSlideBoxDelegate.previous();
  }
})

.controller('ChatCtrl', function($scope) {
  $scope.contatos = [
    { loja: 'Americanas', imgEmpresa: 'img/americanas.jpg', texto: 'Americanas respondeu', data: '09/05/2016' },
    { loja: 'Ponto Frio', imgEmpresa: 'img/pontoFrio.png', texto: 'Ponto Frio respondeu', data: '09/05/2016' }
  ];
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile) {
      function initialize() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };
      
    })

.controller('NovaCompraCtrl', ['$scope', '$timeout', '$filter', '$ionicPopup', 'Compras', function($scope, $timeout, $filter, $ionicPopup, Compras) {    
    $scope.distancia = { min: '0', max: '10000', value: '0' };
    
    $scope.preco = { min: '0', max: '500', value: '0' };

    $scope.addNewCompra = function() {
      Compras.put($scope.produtoDesc, $scope.categoriaProd, $scope.distancia.value, $scope.preco.value).then(function(response){
        if (response) {
          $ionicPopup.alert({ title: 'Aviso', template: 'Ação realizada com sucesso!' });
          $scope.allDocs();
          $scope.closeNovaCompra();
        }
      })
    }
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
});


