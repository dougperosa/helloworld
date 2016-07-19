
angular.module('starter.services', [])

.factory('Compras', function($filter) {

	var db = new PouchDB('compras');
    var remoteDB = new PouchDB('http://localhost:5984/compras');

    var result = {};
	
	/* INSERE UMA NOVA COMPRA */
	result.put = function(produtoDesc, categoriaProd, distancia, preco) {
		var date = $filter('date')(new Date(),'dd_MM_yyyy_H_mm_s');
		var date2 = $filter('date')(new Date(),'dd/MM/yyyy');
		
		return db.put({
	    	_id: 'douglas.bilhar_' + date,
	      	produto: produtoDesc,
	      	categoria: categoriaProd,
	      	distancia: distancia / 1000,
	      	valor: preco,
	      	data: date2
	    }).then(function(response) {
	       	return true;
	    }).catch(function(err) {
	    	return false;
	    });
	}

	/* DELETA UMA COMPRA */
	result.delete = function(doc, rev) {

		return db.remove(doc, rev, function(err) {
	     	if(!err) {
	        	return true;
	        } else {
	        	return false;
	        }
      	
    	});
	}

	/* PEGA TODAS AS COMPRAS REALIZADAS */
	result.all = function() {

		return db.allDocs({
	    	include_docs: true,
	      	attachments: true
	    }).then(function (result) {
	    	return result.rows;
	    }).catch(function (err) {
	      	return false;
	    });
	}

	return result;
})

.factory('BD', function() {

	var db = new PouchDB('compras');
    var remoteDB = new PouchDB('http://localhost:5984/compras');

    var result = {};

    result.sincronizaBDs = function() {

		return db.sync(remoteDB, {
      		live: true,
		    retry: true
		}).on('change', function (change) {
	      	// Ocorreu uma alteração!
	      	return "change";
		}).on('paused', function (info) {
		    // replicação pausada, normalmente por que o usuário está offline
		}).on('active', function (info) {
		    // replicação continuada
		}).on('error', function (err) {
		    // erro desconhecido, normalmente não deveria acontecer
		});
	}

	return result;
})