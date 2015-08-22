var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

function Sprite(gl, program, tex) {
    this.vertexBuffer = null;
    this.texture = tex;
    this.translationMatrix = null;
    var x = 0;
    var y = 0;
    var w = 100;
    var h = 100;
    this.attribs = {
        vertices: new Float32Array([
            x, y, 0, 1,
            x + w, y, 1, 1,
            x + w, y + h, 1, 0,
            x, y, 0, 1,
            x + w, y + h, 1, 0,
            x, y + h, 0, 0
        ]),
        number: 6
    }
    this.x = 0;
    this.y = 0;
    this.FSIZE = this.attribs.vertices.BYTES_PER_ELEMENT
    //Setup
    this.initBuffers(gl, program);
    this.initUniforms(gl, program);
};

Sprite.prototype.bind = function(gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
};

Sprite.prototype.update = function(gl) {

};

Sprite.prototype.render = function(gl, program) {
    this.bind(gl);
    var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix');
    gl.uniformMatrix4fv(uTransformMatrix, false, this.translationMatrix);

    twgl.setUniforms(program, {
        tex: this.texture
    });

    gl.drawArrays(gl.TRIANGLES, 0, this.attribs["number"]);

    gl.uniformMatrix4fv(uTransformMatrix, false, mat4.create());

};

Sprite.prototype.initUniforms = function(gl, program) {
    this.translationMatrix = mat4.create();
    var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix');
    gl.uniformMatrix4fv(uTransformMatrix, false, this.translationMatrix);

    return this.translationMatrix;
};

Sprite.prototype.applyUniforms = function(gl, program) {
    var uTransformMatrix = gl.getUniformLocation(program, 'u_TransformMatrix');
    gl.uniformMatrix4fv(uTransformMatrix, false, this.translationMatrix);

    var aPosition = gl.getAttribLocation(program, 'a_PositionSprite');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * this.FSIZE, 0);
    gl.enableVertexAttribArray(aPosition);

    var aTexCoord = gl.getAttribLocation(program, 'a_TextureCoordinate');
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * this.FSIZE, 2 * this.FSIZE);
    gl.enableVertexAttribArray(aTexCoord);
};

Sprite.prototype.initBuffers = function(gl, program) {
    var vertices = this.attribs["vertices"];

    this.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    var FSIZE = vertices.BYTES_PER_ELEMENT

    // vertexAttrPointer params
    // - location
    // - size of each component
    // - normalized (true to normalize to (0, 1))
    // - stride (number of bytes between different vertex data)
    // - offset (the offset in bytes from where to start reading
    var aPosition = gl.getAttribLocation(program, 'a_PositionSprite');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 4 * FSIZE, 0);
    gl.enableVertexAttribArray(aPosition);

    var aTexCoord = gl.getAttribLocation(program, 'a_TextureCoordinate');
    gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(aTexCoord);


};


module.exports = Sprite;