var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var sprite = require("./sprite.js");


function Level(w, h) {
    this.map = [];
    this.width = w;
    this.height = h;

    this.attribs = {
        vertices: new Float32Array()
    }
};

Level.prototype.generate = function() {
    for (var x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (var y = 0; y < this.height; y++) {
            this.map[y][x] = 0;
        }
    }
};

Level.prototype.render = function() {

};


module.exports = Level;