var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var renderable = require("./renderable.js");
var vec2 = require("./vector2d.js");
var aabb = require("./aabb");

function Player(position, screenPosition, size, collisionBox, shiftBy) {
    this.cameraPosition = position;
    this.gamePosition = position.plus(new vec2(0, 0));
    this.screenPosition = screenPosition.plus(new vec2(-size.x / 2, 0));

    this.doubleJump = false;

    this.speed = new vec2(0.0, 0.0);
    this.size = size;
    this.collisionBox = collisionBox;
    this.shift = new vec2(16, 128);
    
    this.aabb = new aabb(this.gamePosition.x + this.shift.x, this.gamePosition.y + this.shift.y, this.gamePosition.x + this.collisionBox.x, this.gamePosition.y + this.collisionBox.y);
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

    mat4.translate(this.renderable.translationMatrix, mat4.create(), [Math.round(this.screenPosition.x), Math.round(this.screenPosition.y), 0.0]);

    this.renderable.mapDimenX = 8;
    this.renderable.mapDimenY = 4;
    this.renderable.addQuad(0, 0, this.size.x, this.size.y, 0, 0);
    this.renderable.initBuffers();
};

var playerXSpeed = 300;
var gravity = 1000;
var jumpSpeed = 510;

Player.prototype.moveX = function(dt, keys, level) {
    if (keys.left) this.speed.x = -playerXSpeed;
    if (keys.right) this.speed.x = playerXSpeed;

    if (!keys.left && !keys.right) {
        this.speed.x = 0;
    }

    var stepped = new vec2(this.speed.x * dt, 0);
    var newPos = this.gamePosition.plus(stepped);
    var obstacle = level.isBlocked(newPos, this.collisionBox, this.shift);

    for (var i = 0; i < obstacle.length; i++) {
        this.aabb.pos = new vec2(newPos.x + this.shift.x, newPos.y + this.shift.y);
        this.aabb.pos1 = new vec2(newPos.x + this.collisionBox.x, newPos.y + this.collisionBox.y);
        var obs = obstacle[i];
        if (obs[1] == null && obs[0] > -1) {
            newPos.x = this.gamePosition.x;
            continue;
        };

        //If it's solid and overlapping
        if (obs[1].doesOverlap(this.aabb)) {
            newPos.x += obs[1].resolveOverlap(this.aabb).x;
        };
    };

    this.gamePosition.x = newPos.x;
};

Player.prototype.moveY = function(dt, keys, level) {
    this.speed.y += dt * gravity;

    var stepped = new vec2(0, this.speed.y * dt);
    var newPos = this.gamePosition.plus(stepped);
    var obstacle = level.isBlocked(newPos, this.collisionBox, this.shift);

    
    //console.log(this.speed.y);
    if (obstacle[0][0] > -1) {
        if (keys.up && this.speed.y > 0) {
        	this.speed.y = -jumpSpeed;
        } else {
            this.speed.y = 0;
        }
    };

    for (var i = 0; i < obstacle.length; i++) {
        this.aabb.pos = new vec2(newPos.x + this.shift.x, newPos.y + this.shift.y);
        this.aabb.pos1 = new vec2(newPos.x + this.collisionBox.x, newPos.y + this.collisionBox.y);
        var obs = obstacle[i];
        if (obs[1] == null && obs[0] > -1) {
            newPos.y = this.gamePosition.y;
            continue;
        };
        //If it's overlapping correct
        if (obs[1].doesOverlap(this.aabb)) {
            newPos.y += obs[1].resolveOverlap(this.aabb).y;
        };
    };

    //Apply corrections
    this.gamePosition.y = newPos.y;
};

Player.prototype.move = function(dt, keys, level) {
    this.moveX(dt, keys, level);
    this.moveY(dt, keys, level);

};

Player.prototype.update = function(dt, keys, level) {
    //If we escape the bounds of the level
    if (this.gamePosition.x < level.windowW * 0.5 - this.size.x * 0.5) {
        this.screenPosition.x = this.gamePosition.x;
    }
    if (this.gamePosition.x > (level.width * level.tileW) - (level.windowW * 0.5 + this.size.x * 0.5)) {
        this.screenPosition.x = (this.gamePosition.x - ((level.width * level.tileW) - level.windowW));
    }


    if((this.gamePosition.y / level.tileH) < level.border.y - 2) {
    	this.screenPosition.y = this.gamePosition.y;
    };

    this.cameraPosition.x = this.gamePosition.x - this.screenPosition.x;
    this.cameraPosition.y = this.gamePosition.y - this.screenPosition.y;

    level.camera.offset.x = -this.cameraPosition.x;
    level.camera.offset.y = -this.cameraPosition.y;

    mat4.translate(level.renderable.translationMatrix, mat4.create(), [Math.round(level.camera.offset.x), Math.round(level.camera.offset.y), 0.0]);
    mat4.translate(this.renderable.translationMatrix, mat4.create(), [Math.round(this.screenPosition.x), Math.round(this.screenPosition.y), 0.0]);

    this.move(dt, keys, level);
};

Player.prototype.render = function() {
    this.renderable.render();
};

module.exports = Player;