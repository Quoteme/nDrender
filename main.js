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
	"l": false
}
var mvDimension = 0;
var rotDimension = [0,1];

function update() {
	ctx.clearRect(0,0,c.width,c.height);
	if (mesh!=undefined) {
		move();
		drawJSON(mesh);
	}
	ctx.fillStyle = "red";
	ctx.font = "14 Monospace";
	ctx.textBaseline="hanging";
	ctx.fillText("mvDim: "+mvDimension+" | rotDim: ["+rotDimension[0]+","+rotDimension[1]+"]",3,3);
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
		rotateMesh(mesh,rotDimension[0],rotDimension[1],0.1);
	}
	if (keys["l"]) {
		rotateMesh(mesh,rotDimension[0],rotDimension[1],-0.1);
	}
}
function rotate(x,y,theta) {
	// x,y two dimensions that are part of the n-dimensional object
	// theta, the angle theta that determines how much these dimensions get rotated t=[0,2*pi)
	// to rotate an n-dimensional object simply pick two dimensions and perform normal rotation on these two.

	var radius = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	var angle = Math.atan2(y,x);
	var x1 = Math.cos(angle+theta)*radius;
	var y1 = Math.sin(angle+theta)*radius;
	return [x1,y1];
}
function rotateMesh(pJ,x,y,theta) {
	// perform a basic rotation of the dimension x and y with
	// an angle of theta for the mesh pJ (in json format)
	for (var v in pJ.vert) {
		if (pJ.vert.hasOwnProperty(v)) {
			var newXY = rotate(pJ.vert[v][x],pJ.vert[v][y], theta);
			pJ.vert[v][x] = newXY[0];
			pJ.vert[v][y] = newXY[1];
		}
	}
}
function binomial(n, k) {
	// returns the binomial coefficient of two numbers
	var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}

function drawJSON(pJ){
	for (var i in pJ.face) {
		if (pJ.face.hasOwnProperty(i)) {
			var face = pJ.face[i].map(n => shiftPoint(scalePoint(pJ.vert[n], pJ.scle), pJ.posi));
			drawFace(face,pJ.mate[i]);
		}
	}
}

function drawFace(f, m = {c:"#ffffff"}){
	// f is the face that is supposed to be drawn (connection of n-dimensional points)
	// m is the material that is supposed to be used.
	ctx.fillStyle = m.c;
	ctx.strokeStyle = m.c;
	var p = twoDPoint(f[0]);
	ctx.beginPath();
	ctx.moveTo(p[0],p[1]);
	for (var i = 1; i < f.length; i++) {
		var p = twoDPoint(f[i]);
		ctx.lineTo(p[0],p[1]);
	}
	ctx.closePath();
	ctx.stroke();
}

function shiftPoint(p,v){
	// let p be a point
	// let v be a vector, by whom p gets shifted
	var temp = [];
	for (var i = 0; i < p.length; i++) {
		temp[i] = p[i]+v[i];
	}
	return temp;
}

function scalePoint(p,s){
	// let p be a point
	// let s be a scaler for that point set it to an array equal in
	//	length to p to scale each dimension specifically
	var temp = []
	for (var i = 0; i < p.length; i++) {
		temp[i] = p[i]*s[i]
	}
	return temp;
}
function twoDPoint(k){
	// turn a n dimensional array populated only by numers (ie. a point)
	// into a 2d point for projection on a 2d monitor
	//
	// !important!: Dimensions are sorted in clockwork order.
	// this means you should enter them in this order:
	//
	//        |y   /z
	//        |   /
	//        |  /
	//        | /
	//        |________x
	// [x,z,y], NOT: [x,y,z]
	//
	// LATEX: \sum_{i=0}^{n}\bigg(\cos\bigg(\frac{\frac{\pi}{2}}{n} l\bigg) k_i\bigg)+i\sum_{i=0}^{n}\bigg(\sin\bigg(\frac{\frac{\pi}{2}}{n} l\bigg) k_i\bigg)
	var n = k.length-1;
	var x = (function (){
		// emulated sigma function
		var t = 0;
		for (var i = 0; i <= n; i++) {
			// v represents the vector projection of each dimension (on the x Axis)
			var v = Math.cos( ((Math.PI/2)/n) *i )*k[i];
			t += v;
		}
		return t;
	})();
	var y = (function (){
		// emulated sigma function
		var t = 0;
		for (var i = 0; i <= n; i++) {
			// v represents the vector projection of each dimension (on the y Axis)
			var v = Math.sin( ((Math.PI/2)/n) *i )*k[i];
			t += v;
		}
		return t;
	})();
	return [x,y];
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
		drawJSON(mesh)
	};
	reader.readAsText(input.files[0]);
}
