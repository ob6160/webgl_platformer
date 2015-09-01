var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;
var vec2 = require("./vector2d");
var aabb = require("./aabb");

var renderable = require("./renderable.js");

function Level(w, h, tW, tH, wW, wH) {
    this.map = new Float32Array(w * h);
    this.width = w;
    this.height = h;

    this.windowW = wW;
    this.windowH = wH;

    this.tileW = tW;
    this.tileH = tH;

    this.camera = {
        offset: new vec2(0, 0)
    };

    this.renderable = null;

};

Level.prototype.generate = function() {
    var levelProportion = this.height * 0.2;
    this.border = new vec2(0, levelProportion);

    for (var i = 0; i < this.width * this.height; i++) {
        var x = i % this.width;
        var y = Math.floor(i / this.width);
        var rand = Math.random();
        if (y > levelProportion) {
            if (y > levelProportion && y <= levelProportion + 1) {
                this.map[i] = 1;
            } else {
                if (rand > 0.1) {
                    this.map[i] = 2;
                } else {
                    this.map[i] = 3;
                }

            }
        } else {
            this.map[i] = -1;
        }
    };
};

Level.prototype.bindRenderable = function(renderable) {
    this.renderable = renderable;

    this.initRenderable();
};

Level.prototype.isBlocked = function(position, size, shift) {
    var xStart = Math.floor(((position.x + shift.x) / this.tileW));
    var xEnd = Math.ceil((position.x + size.x) / this.tileW);
    var yStart = Math.floor((position.y + shift.y) / this.tileH);
    var yEnd = Math.ceil((position.y + size.y) / this.tileH);

    var corrects = [];

    if (xStart < 0 || xEnd > this.width || yStart < 0)
        return [
            [10, null]
        ];
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = this.map[y * this.width + x];
            if (fieldType > -1) corrects.push([fieldType, new aabb(x * this.tileW, y * this.tileH, x * this.tileW + this.tileW, y * this.tileH + this.tileH)]);
        }
    }

    if (corrects.length === 0) {
        return [
            [-1, new aabb(x * this.tileW, y * this.tileH, x * this.tileW + this.tileW, y * this.tileH + this.tileH)]
        ];
    } else {
        return corrects;
    }
};

Level.prototype.resizeScreen = function(w, h) {
    this.windowW = w;
    this.windowH = h;
};

Level.prototype.initRenderable = function() {
    if (!this.renderable) {
        return false;
    }

    for (var i = 0; i < this.width * this.height; i++) {

        var x = i % this.width;
        var y = Math.floor(i / this.width);
        var currTile = this.map[i];

        if (currTile == 0) {
            this.renderable.addQuad(x * this.tileW, y * this.tileH, this.tileW + 1, this.tileH + 1, 0, 0);
        } else if (currTile == 1) {
            this.renderable.addQuad(x * this.tileW, y * this.tileH, this.tileW + 1, this.tileH + 1, 1, 0);
        } else if (currTile == 2) {
            this.renderable.addQuad(x * this.tileW, y * this.tileH, this.tileW + 1, this.tileH + 1, 3, 0);
        } else if (currTile == 3) {
            this.renderable.addQuad(x * this.tileW, y * this.tileH, this.tileW + 1, this.tileH + 1, 5, 0);
        };
    };

    this.renderable.initBuffers();
};

Level.prototype.render = function() {
    this.renderable.render();
};


module.exports = Level;