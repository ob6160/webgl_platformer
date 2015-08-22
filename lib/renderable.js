// var twgl = window.twgl;
// var mat4 = require('gl-matrix').mat4;
// var vec3 = require('gl-matrix').vec3;

// function Renderable(gl, program, tex) {
//     this.vertices = [];
//     this.floatVertices = null;
//     this.offset = 0;
//     this.translationMatrix = mat4.create();
//     this.texture = tex;


//     this.FSIZE = this.vertices.BYTES_PER_ELEMENT
//     this.initUniforms(gl, program)
// };

// Renderable.prototype.addQuad = function(x, y, w, h, u, v) {
//     var x1 = x;
//     var x2 = x + w;
//     var y1 = y;
//     var y2 = y + h;
//     var n = 4;
//     var base_quad = [
//         x, y, 0, 1,
//         x + w, y, 1, 1,
//         x + w, y + h, 1, 0,
//         x, y, 0, 1,
//         x + w, y + h, 1, 0,
//         x, y + h, 0, 0
//     ];

//     for (var i = 0; i < base_quad.length; i++) {
//         this.vertices.push(base_quad[i]);
//     };

//     this.offset++;
// };

// Renderable.prototype.initUniforms = function(gl, program) {
//     this.translationMatrix = mat4.create();
//     var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrixRend');
//     gl.uniformMatrix4fv(uTransformMatrix, false, this.translationMatrix);

//     return this.translationMatrix;
// };

// Renderable.prototype.applyUniforms = function(gl, program) {
//     var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrixRend');
//     gl.uniformMatrix4fv(uTransformMatrix, false, this.translationMatrix);

    
//     var aPosition = gl.getAttribLocation(program, 'a_Pos');
//     gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * this.FSIZE, 0);
//     gl.enableVertexAttribArray(aPosition);


//     var aTexCoord = gl.getAttribLocation(program, 'a_Tex');
//     gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * this.FSIZE, 2 * this.FSIZE);
//     gl.enableVertexAttribArray(aTexCoord);



   
// };

// Renderable.prototype.normalizeUniforms = function(gl, program) {
//     var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrixRend');
//     gl.uniformMatrix4fv(uTransformMatrix, false, mat4.create());
// };

// Renderable.prototype.render = function(gl, program) {

//     this.bind(gl);
//     this.applyUniforms(gl, program);


//     twgl.setUniforms(program, {
//         tex: this.texture
//     });

//     gl.drawArrays(gl.TRIANGLES, 0, 6 * this.offset);
//     this.normalizeUniforms(gl, program);

// };

// Renderable.prototype.bind = function(gl) {
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
// };

// Renderable.prototype.complete = function(gl, program) {
//     this.floatVertices = new Float32Array(this.vertices);

//     this.initBuffers(gl, program);
// };

// Renderable.prototype.initBuffers = function(gl, program) {
//     var vertices = this.floatVertices

//     this.vertexBuffer = gl.createBuffer()
//     gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
//     gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

//     var FSIZE = vertices.BYTES_PER_ELEMENT

//     var aPosition = gl.getAttribLocation(program, 'a_Pos');
//     gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * FSIZE, 0);
//     gl.enableVertexAttribArray(aPosition);


//     var aTexCoord = gl.getAttribLocation(program, 'a_Tex');
//     gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
//     gl.enableVertexAttribArray(aTexCoord);




// };

// module.exports = Renderable;