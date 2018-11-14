// basic vector

// simple vector addition
function shiftPoint(p,v){
	// let p be a point
	// let v be a vector, by whom p gets shifted
	var temp = [];
	for (var i = 0; i < p.length; i++) {
		temp[i] = p[i]+v[i];
	}
	return temp;
}
// simple sclar vector multiplication
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

// n-D point to 2-D point function

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

// rotation specific functions

function rotate(x,y,theta) {
	// x,y a point in 2D space
	// theta, the angle theta that determines how much these dimensions get rotated t=[0,2*pi)
	// to rotate an n-dimensional object simply pick two dimensions and perform normal rotation on these two.

	const radius = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
	const angle = Math.atan2(y,x);
	const x1 = Math.cos(angle+theta)*radius;
	const y1 = Math.sin(angle+theta)*radius;
	return [x1,y1];
}
function rotateAroundPoint(o,p,theta){
	// o = [x,y] is the origin around which to rotate
	// p = [x,y] is the point to rotate
	// theta is the angle

	// first create a point that measures the distance from p relative to q
	const q = [p[0]-o[0],p[1]-o[1]];
	// now rotate this point
	const rotated_q = rotate(q[0],q[1],theta);
	// unshift it, by adding back o
	return [rotated_q[0]+o[0], rotated_q[1]+o[1]];
}
