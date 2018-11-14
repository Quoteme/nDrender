c = document.getElementById("canvas");
ctx = c.getContext("2d");

var keys = {
	"w": false,
	"a": false,
	"s": false,
	"d": false,
	"h": false,
	"u": false,
	"j": false,
	"i": false,
	"k": false,
	"l": false,
	"r": false,
	"f": false,
	"t": false,
	"g": false
}
var opacity = 1;
var faceDraw = true;
var wireframe = false;
var mvDimension = 0;
var rotDimension = [0,1];
var rotOrigin = [0.5,0.5];

function update() {
	ctx.clearRect(0,0,c.width,c.height);
	if (mesh!=undefined) {
		move();
		drawJSON(mesh, {opacity:opacity, faceDraw:faceDraw, wireframe:wireframe});
	}
	ctx.fillStyle = "red";
	ctx.font = "14 Monospace";
	ctx.textBaseline="hanging";
	ctx.fillText("mvDim: "+mvDimension+" | rotDim: ["+rotDimension[0]+","+rotDimension[1]+"] | rotOrigin: ["+Math.round(rotOrigin[0]*1000)/1000+","+Math.round(rotOrigin[1]*1000)/1000+"]",3,3);
	requestAnimationFrame(update);
}
update();

document.addEventListener("keyup", function(e) {
	keys[e.key]=false;
}, false);

document.addEventListener("keydown", function(e) {
	keys[e.key]=true;
}, false);
document.addEventListener("keypress", function(e) {
	if (e.key=="w") {
		if (mesh!=undefined) {
			if(mvDimension<mesh.dime-1){
				mvDimension++;
			}else{
				mvDimension = 0;
			}
		}
	}
	if (e.key=="s") {
		if (mesh!=undefined) {
			if(mvDimension>0){
				mvDimension--;
			}else{
				mvDimension = mesh.dime-1;
			}
		}
	}
	if (e.key=="u") {
		if (mesh!=undefined) {
			if(rotDimension[0]<mesh.dime-1){
				rotDimension[0]++;
			}else{
				rotDimension[0] = 0;
			}
		}
	}
	if (e.key=="j") {
		if (mesh!=undefined) {
			if(rotDimension[0]>0){
				rotDimension[0]--;
			}else{
				rotDimension[0] = mesh.dime-1;
			}
		}
	}
	if (e.key=="i") {
		if (mesh!=undefined) {
			if(rotDimension[1]<mesh.dime-1){
				rotDimension[1]++;
			}else{
				rotDimension[1] = 0;
			}
		}
	}
	if (e.key=="k") {
		if (mesh!=undefined) {
			if(rotDimension[1]>0){
				rotDimension[1]--;
			}else{
				rotDimension[1] = mesh.dime-1;
			}
		}
	}
	if(e.key=="y"){
		wireframe=!wireframe;
	}
	if(e.key=="x"){
		faceDraw=!faceDraw;
	}
	if(e.key=="c"){
		if(opacity>0.06){
			opacity-=0.05;
		}
	}
	if(e.key=="v"){
		if(opacity<1){
			opacity+=0.05;
		}
	}
	if (rotDimension[0]==rotDimension[1]) {
		if (rotDimension[1]>0) {
			rotDimension[1]--;
		}else {
			rotDimension[1]=mesh.dime-1;
		}
	}
}, false);

function move() {
	if (keys["a"]) {
		mesh.posi[mvDimension]--;
	}
	if (keys["d"]) {
		mesh.posi[mvDimension]++;
	}
	if (keys["h"]) {
		rotateMeshAroundPoint(mesh,rotOrigin,rotDimension[0],rotDimension[1],0.1);
	}
	if (keys["l"]) {
		rotateMeshAroundPoint(mesh,rotOrigin,rotDimension[0],rotDimension[1],-0.1);
	}
	if(keys["r"]){
		rotOrigin[0]+=0.05;
	}
	if(keys["f"]){
		rotOrigin[0]-=0.05;
	}
	if(keys["t"]){
		rotOrigin[1]+=0.05;
	}
	if(keys["g"]){
		rotOrigin[1]-=0.05;
	}
}

function binomial(n, k) {
	// returns the binomial coefficient of two numbers
	var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}

//    I/O

var mesh;
var openFile = function(event) {
	var input = event.target;
	var reader = new FileReader();
	reader.onload = function(){
		var dataURL = reader.result;
		var data = JSON.parse(dataURL);
		mesh = data;
		rotateByVector(mesh,mesh.rota);
		drawJSON(mesh, {opacity:opacity, faceDraw:faceDraw, wireframe:wireframe});
	};
	reader.readAsText(input.files[0]);
}
