//Main entry point into game.
var twgl = window.twgl;
var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var sprite = require("./sprite.js");
var renderable = require("./renderable.js");
var level = require("./level.js");

var gl = null;
var program = null;
var test_quad = null;
var other_test_quad = null;
var textures = null;

var gameLevel = new level(1000, 20, 32, 32);

var camera = {
    viewMat: mat4.create()
};

var test_quad = null;
var test_renderable = null;

function init() {
    gl = twgl.getWebGLContext(document.getElementById("c"));
    program_sprite = twgl.createProgramInfo(gl, ["vs-sprite", "fs-sprite"]);
    program_map = twgl.createProgramInfo(gl, ["vs-map", "fs-map"]);


    gl.canvas.width = 800;
    gl.canvas.height = 600;

    textures = twgl.createTextures(gl, {
        tilesheet: {
            src: "images/tilesheet.png",
            mag: gl.NEAREST
        }
    });

    mat4.ortho(camera.viewMat, 0.0, gl.canvas.width, gl.canvas.height, 0.0, 0.0, -100);

    //Init sprites
    gl.useProgram(program_sprite.program);
    var u_projection = gl.getUniformLocation(program_sprite.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, camera.viewMat);
    test_quad = new sprite(gl, program_sprite, program_sprite.program, textures.tilesheet);

    //Init map
    gl.useProgram(program_map.program);
    var u_projection = gl.getUniformLocation(program_map.program, 'u_projection');
    gl.uniformMatrix4fv(u_projection, false, camera.viewMat);

    test_renderable = new renderable(gl, program_map, program_map.program, textures.tilesheet);
    gameLevel.bindRenderable(test_renderable);
    
    test_renderable.addQuad(0,0,100,100,1,0);
    
    test_renderable.initBuffers();

    requestAnimationFrame(gameLoop);
}

function gameLoop() {
    update();
    render();

    requestAnimationFrame(gameLoop);
}

function render() {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    // gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    gl.useProgram(program_sprite.program);
    test_quad.render(gl, program_sprite);

    // gl.useProgram(program_map.program);
    // test_renderable.render();

};

var poo = 0;

function update() {
    poo += 10;

    //mat4.translate(test_renderable.translationMatrix, mat4.create(), [poo / 10, Math.sin(poo / 100) * 10 + 100, 0.0]);
    mat4.translate(test_quad.translationMatrix, mat4.create(), [poo / 10, Math.cos(poo / 100) * 10 + 100, 0.0]);
    mat4.scale(test_quad.translationMatrix, test_quad.translationMatrix, [4, 4, 0]);
};

module.exports.init = init;