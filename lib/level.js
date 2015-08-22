var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;


var renderable = require("./renderable.js");

function Level(w, h, tW, tH) {
    this.map = [];
    this.width = w;
    this.height = h;
    
    this.tileW = tW;
    this.tileH = tH;

    this.renderable = null;

    this.data = {
        vertices: new Float32Array()
    }
};

Level.prototype.generate = function() {
    for (var x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (var y = 0; y < this.height; y++) {
            this.map[y][x] = 0;
            this.data["vertices"][x * width + y] = 0;
        }
    }
};

Level.prototype.bindRenderable = function(renderable) {
	this.renderable = renderable;

};


module.exports = Level;