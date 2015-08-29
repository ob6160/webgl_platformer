var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var renderable = require("./renderable.js");
var vec2 = require("./vector2d.js");

function Player(position) {
    this.cameraPosition = position;
    this.gamePosition = position.plus(new vec2(0, 0));

    this.speed = new vec2(0.0, 0.0);
    this.size = new vec2(96, 196);
    this.collisionBox = new vec2(85, 196);

    this.shift = new vec2(45,91);
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

    mat4.translate(this.renderable.translationMatrix, mat4.create(), [this.gamePosition.x, this.gamePosition.y, 0.0]);
};

var playerXSpeed = 300;
var gravity = 900;
var jumpSpeed = 500;

Player.prototype.moveX = function(dt, keys, level) {
    if (keys.left) this.speed.x = -playerXSpeed;
    if (keys.right) this.speed.x = playerXSpeed;

    if (!keys.left && !keys.right) {
        this.speed.x = 0;
    }


    var stepped = new vec2(this.speed.x * dt, 0);

    var newPos = this.gamePosition.plus(stepped);

    var obstacle = level.isBlocked(newPos, this.collisionBox, this.shift);

    if (obstacle > -1) {

    } else {

        this.gamePosition = newPos;
    }
};

Player.prototype.moveY = function(dt, keys, level) {

    this.speed.y += dt * gravity;

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
    this.cameraPosition.x = this.gamePosition.x - 300;
    this.cameraPosition.y = this.gamePosition.y;

    level.camera.offset.x = -this.cameraPosition.x;
    level.camera.offset.y = -this.cameraPosition.y;

    mat4.translate(level.renderable.translationMatrix, mat4.create(), [level.camera.offset.x, level.camera.offset.y, 0.0]);

    this.move(dt, keys, level);
};

Player.prototype.render = function() {
    this.renderable.render();
};

module.exports = Player;