//Main entry point into game.
var twgl = window.twgl;
var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;
var vec2 = require("./vector2d.js");

var sprite = require("./sprite.js");
var renderable = require("./renderable.js");
var level = require("./level.js");
var player = require("./player.js");

var gl = null;
var textures = null;

var gameLevel = null;
var gamePlayer = null;

var projectionMatrix = mat4.create();

var test_sprite = null;
var test_renderable = null;


var arrowCodes = {37: "left", 38: "up", 39: "right"};
var currentlyPressed = null;

function init() {
    currentlyPressed = trackKeys(arrowCodes);

    gl = twgl.getWebGLContext(document.getElementById("c"));
    gl.canvas.width = 800;
    gl.canvas.height = 600;

    var program_sprite = twgl.createProgramInfo(gl, ["vs-sprite", "fs-sprite"]);
    var program_map = twgl.createProgramInfo(gl, ["vs-map", "fs-map"]);

    loadAssets();

    mat4.ortho(projectionMatrix, 0.0, gl.canvas.width, gl.canvas.height, 0.0, 0.0, -100);
    prepareUniform(program_sprite, program_map);


    gameLevel = new level(100, 20, 64, 64, gl.canvas.width, gl.canvas.height);
    gameLevel.generate();
    gameLevel.bindRenderable(new renderable(gl, program_map, program_map.program, textures.tilesheet));
    mat4.translate(gameLevel.renderable.translationMatrix, mat4.create(), [Math.round(gameLevel.camera.offset.x), Math.round(gameLevel.camera.offset.y), 0.0]);

    gamePlayer = new player(new vec2(400.0, 0.0), new vec2(400.0, 300.0), new vec2(64, 64), new vec2(64, 64));
    gamePlayer.bindRenderable(new renderable(gl, program_map, program_map.program, null));



    requestAnimationFrame(gameLoop);
};


function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}


function loadAssets() {
    textures = twgl.createTextures(gl, {
        tilesheet: {
            src: "images/tilesheet.png",
            mag: gl.NEAREST
        },
        player: {
            src: "images/player.png",
            mag: gl.NEAREST
        }
    });
}

function prepareUniform(program_sprite, program_map) {
    //Init sprites
    gl.useProgram(program_sprite.program);
    var u_projection = gl.getUniformLocation(program_sprite.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, projectionMatrix);


    //Init map
    gl.useProgram(program_map.program);
    var u_projection = gl.getUniformLocation(program_map.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, projectionMatrix);
}



var fps = 60,
    step = 1 / fps,
    dt = 0,
    now, last = timestamp();

function timestamp() {
    if (window.performance && window.performance.now)
        return window.performance.now();
    else
        return new Date().getTime();
}

function gameLoop() {
    now = timestamp();
    
    dt = dt + Math.min(1, (now - last) / 1000);
    
    while (dt > step) {
        dt = dt - step;
        update(step);
    }

    render(dt);
    last = now;

    requestAnimationFrame(gameLoop);
}



function render(dt) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.7, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    gamePlayer.render();
    gameLevel.render();
    
};

var poo = 0;

function update(dt) {
    poo += 1;

    gamePlayer.update(dt, currentlyPressed, gameLevel);

};

module.exports.init = init;