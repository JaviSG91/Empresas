
var assert = require("assert");

empresa = require(__dirname+"/express.js");

//var empresanueva = new empresa.creaEmpresa("prueba");
assert(empresa,"creada");

empresa.ExisteEmpresa(
	"Microsoft",function(err,data){
	assert.equal(data,true);
	console.log("pruebas superadas");
	

});




