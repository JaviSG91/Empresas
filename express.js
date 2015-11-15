var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./empresa.db');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var empresa=[];


app.use(express.static(__dirname));

app.use(bodyParser.urlencoded({ extended: false }));

//RANKING
app.get('/Ranking', function(req, res){
	var v=[];
	var pagina='<!doctype html><html><head></head><body>';
	empresa.ranking(function(error, data) {
	     for(i=0;i<data.length;i++)
		pagina +=data[i].nombreEmpresa+" con media:"+data[i].media+"<br>";
	     pagina += '<a href="index.html">Volver</a>';
             pagina += '</body></html>';
	     	
		
	     
	     res.send(pagina);
	   
	});
	
	
	
	
	
	
});

//Lista de calificaciones para una empresa
app.post('/listaCalif', function(req, res){
	
	
	listaCalificaciones(req.body.empresa,function(error,data){
		var pagina='<!doctype html><html><head></head><body>';
		for(i=0;i<data.length;i++)
			pagina +=data[i].nombreAlumno+" con nota:"+data[i].nota+"<br>";
		
	    	pagina += '<a href="index.html">Volver</a>';
	    	pagina += '</body></html>';
		info="";
		res.send(pagina);
	
		



	});
	
	
	
    	
   
});

//Pagina principal
app.get('/page', function(req, res){
	res.sendfile(__dirname + '/index.html');
	
   
});

//Crea una empresa que no exista previamente
app.post('/creaEmpresa', function(req, res){
	
	var v=[];
	empresa.ExisteEmpresa(req.body.empresa,function(error,data){
		console.log(data);
		if(!data){
		
				 db.run("Insert into empresa values(?)", {
				  1: req.body.empresa,
		
			      	 });
				var pagina='<!doctype html><html><head></head><body>';
			    	pagina +="La empresa insertada";
			    	pagina += '<a href="index.html">Volver</a>';
			    	pagina += '</body></html>';
	
	
		}
		else{
				var pagina='<!doctype html><html><head></head><body>';
			    	pagina +="La empresa ya existe";
			    	pagina += '<a href="index.html">Volver</a>';
			    	pagina += '</body></html>';
	
			
		}
	   	res.send(pagina);

	
	


	
	});
	

	
	
	
});

//crea una calificacion nueva para una empresa existente
app.post('/creaCalif', function(req, res){
	//console.log("."+req.body.empresa);
	var v=[];
	db.serialize(function() {
	db.each("SELECT nombre  FROM empresa where nombre='"+req.body.empresa+"'", function(err, rows) {
		
	
			v.push({nombre:rows.nombre});
		
		 
		},function(){
			 
			console.log(v.length);
			if(v.length>0){
				db.serialize(function(){
				db.each("SELECT nombreAlumno from calificacion where nombreEmpresa='"+req.body.empresa+"' and nombreAlumno='"+req.body.alumno+"'", function(err, rows) {
					v.push({alumno:rows.nombreAlumno});

				},function(){
					console.log(v.length);
					if(v.length==1){
					 db.run("Insert into calificacion values ('"+req.body.empresa+"','"+req.body.alumno+"','"+req.body.nota+"')");
		
				      	 
						var pagina='<!doctype html><html><head></head><body>';
					    	pagina +="Calificacion insertada";
					    	pagina += '<a href="index.html">Volver</a>';
					    	pagina += '</body></html>';
						res.send(pagina);
					}
					else{
						var pagina='<!doctype html><html><head></head><body>';
					    	pagina +="Ya existe la calificacion de ese alumno para esa empresa";
					    	pagina += '<a href="index.html">Volver</a>';
					    	pagina += '</body></html>';
						res.send(pagina);
						
					}
					

				});
				});
	
	
			}
			else{
				var pagina='<!doctype html><html><head></head><body>';
			    	pagina +="La empresa no existe";
			    	pagina += '<a href="index.html">Volver</a>';
			    	pagina += '</body></html>';
				res.send(pagina);
			}
	
			
		});
	   	

	
	


	
	});
	

	
	
	
});

//borra una calificacion
app.post('/borraCalif', function(req, res){
	var v=[];
	db.serialize(function (){
		 db.run("delete from calificacion where nombreEmpresa='"+req.body.empresa+"' AND nombreAlumno='"+req.body.alumno+"'");
		
		



		
			var pagina='<!doctype html><html><head></head><body>';
			 pagina +="Calificación borrada";
			    	pagina += '<a href="index.html">Volver</a>';
			    	pagina += '</body></html>';
	
			
		
	   	res.send(pagina);


	
	
	});
	

	
	
	
});

empresa.ranking = function(res){
	
	
	db.all("SELECT nombreEmpresa, AVG(nota) AS media FROM calificacion GROUP BY nombreEmpresa order by media desc ", function(err, rows) {
			
 			if (err)
  			      throw err;
  			
			else
				res(null, rows);
			      
			

	});	
}

var listaCalificaciones = function(req,res){
	
	
	db.all("SELECT nombreAlumno, nota FROM calificacion WHERE nombreEmpresa='"+req+"'", function(err, rows) {
		

	
 			if (err)
  			      throw err;
  			
			else
				res(null, rows);
			      
			

	});	
}

empresa.ExisteEmpresa = function(req,res){
	
	
	db.all("SELECT nombre FROM empresa where nombre='"+req+"'", function(err, rows) {
		
			//console.log(rows.length);
	
 			if (err)
  			      throw err;
  			
			else{
				
				if(rows.length!=0)
					res(null, true);
				else
					res(null,false);
			}
			      
			

	});	
}

app.listen(3000);
exports.app = app;
module.exports = empresa;
