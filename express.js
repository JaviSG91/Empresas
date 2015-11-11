var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./empresa.db');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var info="";

//especificamos el subdirectorio donde se encuentran las páginas estáticas
app.use(express.static(__dirname));

//extended: false significa que parsea solo string (no archivos de imagenes por ejemplo)
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/Ranking', function(req, res){
	var v=[];
	db.each("SELECT nombreEmpresa, AVG(nota) AS media FROM calificacion GROUP BY nombreEmpresa order by media desc ", function(err, rows) {
		v.push(rows.nombreEmpresa+"   "+rows.media+"<br>");

	},function(){
		var pagina='<!doctype html><html><head></head><body>';
	    	for(i=0;i<v.length;i++)
			pagina +=v[i];
	    	pagina += '<a href="index.html">Volver</a>';
	    	pagina += '</body></html>';
		
		res.send(pagina);

	});
	
	
	
});

app.post('/listaCalif', function(req, res){
	
	var v=[];
	db.each("SELECT nombreAlumno, nota FROM calificacion WHERE nombreEmpresa='"+req.body.empresa+"'", function(err, rows) {
		v.push(rows.nombreAlumno+"   "+rows.nota+"<br>");

	},function(){
		var pagina='<!doctype html><html><head></head><body>';
		for(i=0;i<v.length;i++)
			pagina +=v[i];
		
	    	pagina += '<a href="index.html">Volver</a>';
	    	pagina += '</body></html>';
		info="";
		res.send(pagina);
	
		



	});
	
	
	
    	
   
});
app.get('/page', function(req, res){
	res.sendfile(__dirname + '/index.html');
	
   
});


app.post('/creaEmpresa', function(req, res){
	//console.log("."+req.body.empresa);
	var v=[];
	db.serialize(function() {
	db.each("SELECT nombre FROM empresa where nombre='"+req.body.empresa+"'", function(err, rows) {
		
	
			v.push({nombre:rows.nombre});
		
		 
		},function(){
			 
			 console.log(info+"in");
			if(v.length==0){
		
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
	

	
	
	
});

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


app.listen(3000);
