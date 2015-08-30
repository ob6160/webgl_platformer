var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;
var vec2 = require("./vector2d.js");

var renderable = require("./renderable.js");

function Level(w, h, tW, tH, wW, wH) {
    this.map = [];
    this.width = w;
    this.height = h;

    this.windowW = wW;
    this.windowH = wH;

    this.tileW = tW;
    this.tileH = tH;

    this.camera = {
        offset: new vec2(0,0)
    };

    this.renderable = null;

    this.data = {
        vertices: []
    }
};

Level.prototype.generate = function() {
    var levelProportion = this.height * 0.4;
    for (var x = 0; x < this.width; x++) {
        this.map[x] = [];
        for (var y = 0; y < this.height; y++) {
        	var rand = Math.random();
            if(y > levelProportion) {
            	if(y > levelProportion && y <= levelProportion + 1) {
            		this.map[x][y] = 1;
            	} else {
            		if(rand > 0.1) {
            			this.map[x][y] = 2;	
            		} else {
            			this.map[x][y] = 3;
            		}
            		
            	}
            } else {
            	this.map[x][y] = -1;
            }
        }
    }

    this.map[2][10] = -1;
    this.map[3][10] = -1;
    this.map[3][9] = -1;
    this.map[2][9] = -1;
    this.map[2][5] = 1;


    this.map[14][10] = -1;
    this.map[15][10] = -1;
    this.map[15][9] = -1;
    this.map[14][9] = -1;
    this.map[15][5] = 1;
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

    if (xStart < 0 || xEnd > this.width || yStart < 0)
        return 0;
    for (var y = yStart; y < yEnd; y++) {
        for (var x = xStart; x < xEnd; x++) {
            var fieldType = this.map[x][y];
            if (fieldType > -1) return fieldType;
        }
    }
};

Level.prototype.initRenderable = function() {
    if (!this.renderable) {
        return false;
    }

    for (var i = 0; i < this.map.length; i++) {
        for (var j = 0; j < this.map[i].length; j++) {
            var currTile = this.map[i][j];
            if (currTile == 0) {
                this.renderable.addQuad(i * this.tileW, j * this.tileH, this.tileW + 1, this.tileH + 1, 0, 0);
            } else if (currTile == 1) {
                this.renderable.addQuad(i * this.tileW, j * this.tileH, this.tileW + 1, this.tileH + 1, 1, 0);
            } else if (currTile == 2) {
                this.renderable.addQuad(i * this.tileW, j * this.tileH, this.tileW + 1, this.tileH + 1, 3, 0);
            } else if (currTile == 3) {
                this.renderable.addQuad(i * this.tileW, j * this.tileH, this.tileW + 1, this.tileH + 1, 5, 0);
            };
        };
    };



    this.renderable.initBuffers();
};

Level.prototype.render = function() {
    this.renderable.render();
};


module.exports = Level;