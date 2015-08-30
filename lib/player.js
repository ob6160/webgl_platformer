var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var renderable = require("./renderable.js");
var vec2 = require("./vector2d.js");

function Player(position, screenPosition) {
    this.cameraPosition = position;
    this.gamePosition = position.plus(new vec2(0, 0));
    this.screenPosition = screenPosition;

    this.speed = new vec2(0.0, 0.0);
    this.size = new vec2(64, 128);
    this.collisionBox = new vec2(62, 128);

    this.shift = new vec2(1, 0);
    this.renderable = null;
};

Player.prototype.bindRenderable = function(renderable) {
    this.renderable = renderable;

    this.initRenderable();
};

Player.prototype.initRenderable = function() {
    if (!this.renderable) {
        return false;
    }

    this.renderable.mapDimenX = 8;
    this.renderable.mapDimenY = 4;
    this.renderable.addQuad(0, 0, this.size.x, this.size.y, 0, 0);
    this.renderable.initBuffers();
};

var playerXSpeed = 200;
var gravity = 1000;
var jumpSpeed = 550;

Player.prototype.moveX = function(dt, keys, level) {
    if (keys.left) this.speed.x = -playerXSpeed;
    if (keys.right) this.speed.x = playerXSpeed;

    if (!keys.left && !keys.right) {
        this.speed.x = 0;
    }

    var stepped = new vec2(Math.round(this.speed.x * dt), 0);
    var newPos = this.gamePosition.plus(stepped);
    var obstacle = level.isBlocked(newPos, this.collisionBox, this.shift);

    if (obstacle > -1) {

    } else {
        this.gamePosition = newPos;
    }
};

Player.prototype.moveY = function(dt, keys, level) {
    this.speed.y += Math.ceil(dt * gravity);

    var stepped = new vec2(0, this.speed.y * dt);
    var newPos = this.gamePosition.plus(stepped);
    var collided = level.isBlocked(newPos, this.collisionBox, this.shift);

    if (collided > -1) {
        if (keys.up && this.speed.y > 0)
            this.speed.y = -jumpSpeed;
        else
            this.speed.y = 0;
    } else {
        this.gamePosition = newPos;
    }

};

Player.prototype.move = function(dt, keys, level) {
    this.moveX(dt, keys, level);
    this.moveY(dt, keys, level);
};

Player.prototype.update = function(dt, keys, level) {
    this.cameraPosition.x = this.gamePosition.x - this.screenPosition.x;
    this.cameraPosition.y = this.gamePosition.y - this.screenPosition.y;

    console.log((level.windowW * 0.5 + this.collisionBox.x * 0.5));
    //If we escape the bounds of the level
    if (this.gamePosition.x < 350) {
        this.screenPosition.x = this.gamePosition.x;
    } else if (this.gamePosition.x > (level.width * (level.tileW - 1)) - ((level.windowW * 0.5 + this.size.x * 0.5))) {
    	this.screenPosition.x =  (this.gamePosition.x - ((level.width * level.tileW) - level.windowW));
    } else {
        level.camera.offset.x = -this.cameraPosition.x;
    };

    level.camera.offset.y = -this.cameraPosition.y;

    mat4.translate(this.renderable.translationMatrix, mat4.create(), [this.screenPosition.x, this.screenPosition.y, 0.0]);
    mat4.translate(level.renderable.translationMatrix, mat4.create(), [level.camera.offset.x, level.camera.offset.y, 0.0]);

    this.move(dt, keys, level);
};

Player.prototype.render = function() {
    this.renderable.render();
};

module.exports = Player;