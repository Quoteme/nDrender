var app = new PIXI.Application({ width: 640, height: 360 });
document.body.appendChild(app.view);

//    Drawing

var shapes=[]
function drawJSON(pJ){
	for (var i in pJ.face) {
		if (pJ.face.hasOwnProperty(i)) {
			var face = pJ.face[i].map(n => shiftPoint(scalePoint(pJ.vert[n], pJ.scle), pJ.posi));
			shapes[shapes.length]=drawFace(face,pJ.mate[i]);
		}
	}
}

function drawFace(f, m = {c:"#ffffff"}){
	// f is the face that is supposed to be drawn (connection of n-dimensional points)
	// m is the material that is supposed to be used.
	var shp = new PIXI.Graphics();
	shp.beginFill(m.c.replace("#","0x"));
	var p = twoDPoint(f[0]);
	shp.moveTo(p[0],p[1]);
	for (var i = 1; i < f.length; i++) {
		var p = twoDPoint(f[i]);
		shp.lineTo(p[0],p[1]);
	}
	shp.endFill();
	app.stage.addChild(shp);
	return shp;
}

function delShapes(shapes){
	for (var i = 0; i < shapes.length; i++) {
		shapes[i].destroy();
		shapes=[];
	}
}

var keys = {};
var mvDimension = 0;
var rotDimension = 0;
function move(){
	extendedIf("ArrowLeft",function (){
		delShapes(shapes);
		mesh.posi[mvDimension]--;
		drawJSON(mesh);
	});
	extendedIf("ArrowRight",function (){
		delShapes(shapes);
		mesh.posi[mvDimension]++;
		drawJSON(mesh);
	});
	extendedIf("ArrowUp",function (){
		if(mvDimension<mesh.dime){
			mvDimension++;
		}else{
			mvDimension = 0;
		}
	});
	extendedIf("ArrowDown",function (){
		if(mvDimension>0){
			mvDimension--;
		}else{
			mvDimension = mesh.dime-1;
		}
	});
	function extendedIf(cond, callback){
		if(typeof keys[cond] == "boolean"){
			if(keys[cond]==true){
				callback();
			}
		}
	}
}

document.addEventListener("keyup", function(e) {
	keys[e.key]=false;
}, false);

document.addEventListener("keydown", function(e) {
	keys[e.key]=true;
	console.log(e);
}, false);

setInterval(function(){
	move();
}, 300);

//    Math

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

// endFill to fill in lines that have been drawn
// moveTo: moves the drawing position to (x,y)
// lineTo: draws a line from the current draw position to (x,y)
