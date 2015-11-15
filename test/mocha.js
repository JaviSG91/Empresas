empresa = require("../express");
express = require("express");
var app = express();
var should = require('should'); 
var request = require('supertest');
 
var assert = require("assert");
describe('Empresa', function(){
		var url = 'http://localhost:3000/';
		// Testea que se haya cargado bien la librería
		 before(function(done) {
		   
		    						
		    done();
		  });
		it('Deberia existir', function(){
			empresa.ExisteEmpresa(
				"Microsot",function(err,data){
				assert.equal(data,true);
			
	

			});
		 	
		});

		/*it('should return error trying to save duplicate username', function(done) {
		      var profile = {
			nombre: 'Apple'};
		      request(url)
			.post('/creaEmpresa')
			.send(profile)
		    // end handles the response
			.end(function(err, res) {
			  if (err) {
			    throw err;
			  }
			  // this is should.js syntax, very clear
			  res.should.have.status(400);
			  done();
			 });
			
		});*/
		
		 
		

});



