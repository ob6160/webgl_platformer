var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var renderable = require("./renderable.js");
var vec2 = require("./vector2d.js");

function Player(position) {
    this.position = position;
    this.speed = new vec2(0.0, 0.0);

    this.size = new vec2(128, 256);
    this.collisionBox = new vec2(64, 256);

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

var playerXSpeed = 100;
var gravity = 500;
var jumpSpeed = 200;

Player.prototype.moveX = function(dt, keys, level) {
    if (keys.left) this.speed.x = -playerXSpeed;
    if (keys.right) this.speed.x = playerXSpeed;

    if(!keys.left && !keys.right) {
    	this.speed.x = 0;
    }

    var stepped = new vec2(this.speed.x * dt, 0);
    var newPos = this.position.plus(stepped);

    var obstacle = level.isBlocked(newPos, this.collisionBox);


    if (obstacle > -1) {
        // level.playerTouched(obstacle);
    } else {

        this.position = newPos;
    }
};

Player.prototype.moveY = function(dt, keys, level) {
    this.speed.y += dt * gravity;

    var stepped = new vec2(0, this.speed.y * dt);
    var newPos = this.position.plus(stepped);

    var collided = level.isBlocked(newPos, this.collisionBox);

    if (collided > -1) {
        // level.playerTouched(obstacle);

        if (keys.up && this.speed.y > 0)
            this.speed.y = -jumpSpeed;
        else
            this.speed.y = 0;
    } else {
        this.position = newPos;
    }

};

Player.prototype.move = function(dt, keys, level) {
    this.moveX(dt, keys, level);
    this.moveY(dt, keys, level);

    this.update(dt);
};

Player.prototype.update = function(dt) {

    mat4.translate(this.renderable.translationMatrix, mat4.create(), [this.position.x, this.position.y, 0.0]);
};

Player.prototype.render = function() {
    this.renderable.render();
};

module.exports = Player;