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
var gameSun = null;
var gameBackground = null;

var projectionMatrix = mat4.create();
var program_sprite = null;
var program_map = null;

var test_sprite = null;
var test_renderable = null;

var arrowCodes = {37: "left", 38: "up", 39: "right"};
var currentlyPressed = null;

function init() {
    currentlyPressed = trackKeys(arrowCodes);

    gl = twgl.getWebGLContext(document.getElementById("c"));
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    program_sprite = twgl.createProgramInfo(gl, ["vs-sprite", "fs-sprite"]);
    program_map = twgl.createProgramInfo(gl, ["vs-map", "fs-map"]);

    loadAssets();

    mat4.ortho(projectionMatrix, 0.0, gl.canvas.width, gl.canvas.height, 0.0, 0.0, -100);

    gameLevel = new level(2000, 100, 64, 64, gl.canvas.width, gl.canvas.height);
    gamePlayer = new player(new vec2(gl.canvas.width * 0.5, 0.0), new vec2(gl.canvas.width * 0.5, 450.0), new vec2(64, 128), new vec2(64, 128));

    gameLevel.generate();

    prepareUniform();
   
    gl.useProgram(program_map.program);
    
    gameLevel.bindRenderable(new renderable(gl, program_map, program_map.program, textures.tilesheet));
    gamePlayer.bindRenderable(new renderable(gl, program_map, program_map.program, textures.player));

    gl.useProgram(program_sprite.program);

    gameBackground = new sprite(gl, program_sprite, program_sprite.program, textures.background, 0, 0, gl.canvas.width, 1024);
    
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
        },
        background: {
            src: "images/1.png",
            mag: gl.NEAREST
        }
    });
}

function prepareUniform() {
    //Init sprites
    gl.useProgram(program_sprite.program);
    var u_projection = gl.getUniformLocation(program_sprite.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, projectionMatrix);


    //Init map
    gl.useProgram(program_map.program);
    var u_projection = gl.getUniformLocation(program_map.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, projectionMatrix);

    var u_sunlight = gl.getUniformLocation(program_map.program, 'u_sunlight');
    gl.uniform4f(u_sunlight, gameLevel.gameLight.position.x, gameLevel.gameLight.position.y, gameLevel.gameLight.intensity, gameLevel.gameLight.colour);
}

var fps = 512,
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
};

function refreshContext() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);

    mat4.ortho(projectionMatrix, 0.0, gl.canvas.width, gl.canvas.height, 0.0, 1000.0, -1000);
    
    prepareUniform();

    gameLevel.resizeScreen(gl.canvas.width, gl.canvas.height);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.0, 0.7, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
};

function render(dt) {    
    refreshContext();

    //gl.useProgram(program_map.program);
    gamePlayer.render(gameLevel);
    gameLevel.render();
    gameBackground.render();
};

function update(dt) {
    gamePlayer.update(dt, currentlyPressed, gameLevel);
    gameBackground.texOffset.x = gamePlayer.gamePosition.x / 10000.0;
    gameBackground.texOffset.y = gamePlayer.gamePosition.y / 10000.0;
};

module.exports.init = init;