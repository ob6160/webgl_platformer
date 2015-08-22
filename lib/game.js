//Main entry point into game.
var twgl = window.twgl;
var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

var sprite = require("./sprite.js");
var renderable = require("./renderable.js");

var gl = null;
var program = null;
var test_quad = null;
var other_test_quad = null;
var textures = null;

var camera = {
    viewMat: mat4.create()
};

var test_quad = null;
var test_renderable = null;

function init() {
    gl = twgl.getWebGLContext(document.getElementById("c"));
    program_sprite = twgl.createProgramInfo(gl, ["vs", "fs"]);


    gl.canvas.width = 800;
    gl.canvas.height = 600;



    textures = twgl.createTextures(gl, {
        tilesheet: {
            src: "images/tilesheet.png",
            mag: gl.NEAREST
        }
    });



    mat4.ortho(camera.viewMat, 0.0, gl.canvas.width, gl.canvas.height, 0.0, 0.0, -100);


    gl.useProgram(program_sprite.program);
    var uProjMat = gl.getUniformLocation(program_sprite.program, 'u_projMat');
    gl.uniformMatrix4fv(uProjMat, false, camera.viewMat);

    test_quad = new sprite(gl, program_sprite.program, textures.tilesheet);
    
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
    // gl.disable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);


    gl.useProgram(program_sprite.program);

    test_quad.applyUniforms(gl, program_sprite.program);
    test_quad.render(gl, program_sprite.program);


};

var poo = 0;

function update() {
    poo += 10;
    mat4.translate(test_quad.translationMatrix, mat4.create(), [poo / 10, Math.sin(poo / 100) * 10 + 100, 0.0]);
    mat4.scale(test_quad.translationMatrix, test_quad.translationMatrix, [4, 4, 0]);
    // mat4.rotateX(test_quad.translationMatrix, mat4.create(), poo);
    //  mat4.rotateY(test_quad.translationMatrix, test_quad.translationMatrix, poo / 500);
    // mat4.rotateX(test_quad.translationMatrix, test_quad.translationMatrix, poo / 600);
    // mat4.rotateZ(test_quad.translationMatrix, test_quad.translationMatrix, 1);
};

module.exports.init = init;



// // var arrays = {
// //     position: [-1, -1, 0, 1, -1, 0, -1, 1, 0, -1, 1, 0, 1, -1, 0, 1, 1, 0]
// // };

// // var bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);

// function render(time) {


//     var uniforms = {
//         time: time * 0.001,
//         resolution: [gl.canvas.width, gl.canvas.height],
//     };


//     twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
//     twgl.setUniforms(programInfo, uniforms);
//     twgl.drawBufferInfo(gl, gl.TRIANGLE_STRIP, bufferInfo);

//     requestAnimationFrame(render);
// }
// requestAnimationFrame(render);