// collection of functions needed to render higher dimensional objects
function drawJSON(pJ,options){
	for (var i in pJ.face) {
		if (pJ.face.hasOwnProperty(i)) {
			var face = pJ.face[i].map(n => shiftPoint(scalePoint(pJ.vert[n], pJ.scle), pJ.posi));
			drawFace(face,{...pJ.mate[i], ...options});
		}
	}
}
function drawCrossSection(faces,d,fov,fill,wire){
	// faces a collection of faces as they are returned by crossSection();
	// d dimension where the opbject was cut
	// fov field of view
	// material a collection of materials for each face {cface,cwire,opacity...}
	ctx.fillStyle=fill;
	ctx.strokeStyle=wire;
	var init = false;
	for (var i = 0; i < faces.length; i++) {
		for (var j = 0; j < faces[i].length; j++) {
			var lal = faces[i][j].filter((x,i)=>i!=d);
			var position = convTo2D(...lal,fov);
			if(init==false){
				ctx.moveTo(...position);
				ctx.beginPath();
				init = true;
			}else{
				ctx.lineTo(...position);
			}
		}
		ctx.stroke();
		ctx.fill();
	}
	function convTo2D(x,y,z,fov){
		return [
			x*fov/(fov+z),
			y*fov/(fov+z),
		];
	}
}
function drawFace(f, m = {cface:"#ffffff",cwire:"#000000",opacity:1,faceDraw:true,wireframe:false}){
	// f is the face that is supposed to be drawn (connection of n-dimensional points)
	// m is the material that is supposed to be used.
	m.cface = m.cface!=undefined?m.cface:"#ffffff";
	m.cwire = m.cwire!=undefined?m.cwire:"#000000";
	m.opacity = m.opacity!=undefined?m.opacity:1;
	m.faceDraw = m.faceDraw!=undefined?m.faceDraw:true;
	m.wireframe = m.wireframe!=undefined?m.wireframe:false;
	ctx.fillStyle = m.cface;
	ctx.strokeStyle = m.cwire;
	var p = twoDPoint(f[0]);
	ctx.beginPath();
	ctx.moveTo(p[0],p[1]);
	for (var i = 1; i < f.length; i++) {
		var p = twoDPoint(f[i]);
		ctx.lineTo(p[0],p[1]);
	}
	ctx.closePath();

	// actual drawing
	ctx.globalAlpha = m.opacity;
	if(m.wireframe){
		ctx.stroke();
	}
	if(m.faceDraw){
		ctx.fill();
	}
	ctx.globalAlpha=1;
}
function rotateByVector(obj,rv){
	// obj is the object that is supposed to be rotated
	// rv is the rotationvector that will rotate the object accordingly
	var count = 0;
	for (var i = 0; i < obj.dime; i++) {
		for (var j = i; j < obj.dime; j++) {
			if(i==j){
				continue;
			}
			rotateMesh(obj,i,j,rv[count]);
			count++;
		}
	}
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
function rotateMeshAroundPoint(pJ,origin,x,y,theta) {
	// perform a basic rotation of the dimension x and y with
	// an angle of theta for the mesh pJ (in json format)
	// use origin as an origin for this rotation
	for (var v in pJ.vert) {
		if (pJ.vert.hasOwnProperty(v)) {
			var newXY = rotateAroundPoint(origin,[pJ.vert[v][x],pJ.vert[v][y]], theta);
			pJ.vert[v][x] = newXY[0];
			pJ.vert[v][y] = newXY[1];
		}
	}
}
function crossSection(shape,d,w){
	// returns the crosssection of an n dimensional object in n-1 dimensions
	// shape = a n-d shape
	// d = dimension to cut at
	// w = value where to cut at
	var projections = [];
	for (var i in shape.face) {
		if (shape.face.hasOwnProperty(i)) {
			var face = shape.face[i].map(n => shiftPoint(scalePoint(shape.vert[n], shape.scle), shape.posi));
			verts = (function(){
				var tempvert = [];
				// traverse the faces of the shape to find cross sections in the desired position
				for (var j = 0; j < face.length; j++) {
					for (var k = 0; k < face.length; k++) {
						if(i==k){
							continue;
						}
						if(face[j][d]<w && face[k][d]>w){
							var dist = Math.abs(face[j][d]-face[k][d]);
							var diff = w/dist;
							var vert = (function (){
								var tmp =  [];
								for (var q = 0; q < face[j].length; q++) {
									var d = Math.abs(face[j][q]-face[k][q]);
									tmp.push(Math.min(face[j][q],face[k][q])+d*diff);
								}
								return tmp;
							})();
							tempvert.push(vert);
						}
					}
				}
				return tempvert;
			})();
			if(verts.length>0){
				projections[projections.length] = verts;
			}
		}
	}
	return projections;
}
function binomial(n, k) {
	// returns the binomial coefficient of two numbers
	var coeff = 1;
    for (var x = n-k+1; x <= n; x++) coeff *= x;
    for (x = 1; x <= k; x++) coeff /= x;
    return coeff;
}
