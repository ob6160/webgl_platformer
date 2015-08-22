var twgl = window.twgl;

var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;



function Sprite(gl, wrapProgram, program, tex) {
    this.vertexBuffer = null;
    this.texture = tex;
    this.translationMatrix = null;
    var x = 0;
    var y = 0;
    var w = 100;
    var h = 100;

    this.program = program;
    this.programWrap = wrapProgram;
    this.gl = gl;

    this.attribs = {
        vertices: new Float32Array([
            x, y, 0, -1,
            x + w, y, 1, -1,
            x + w, y + h, 1, 0,
            x, y, 0, -1,
            x + w, y + h, 1, 0,
            x, y + h, 0, 0
        ]),
        number: 6,
        a_position: gl.getAttribLocation(this.program, 'a_position'),
        a_texcoord: gl.getAttribLocation(this.program, 'a_texcoord')
    }

    this.x = 0;
    this.y = 0;

    this.FSIZE = this.attribs.vertices.BYTES_PER_ELEMENT;

    //Setup
    this.initBuffers();
    this.initUniforms();
};

Sprite.prototype.update = function() {

};

Sprite.prototype.bind = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
};

Sprite.prototype.render = function() {
    var gl = this.gl;

    //Bind buffer;
    this.bind(gl);

    //Set uniforms
    twgl.setUniforms(this.programWrap, {
        tex: this.texture,
        u_transform: this.translationMatrix
    });

    //Set attributes
    gl.vertexAttribPointer(this.attribs.a_position, 2, gl.FLOAT, false, 4 * this.FSIZE, 0);
    gl.enableVertexAttribArray(this.attribs.a_position);

    gl.vertexAttribPointer(this.attribs.a_texcoord, 2, gl.FLOAT, false, 4 * this.FSIZE, 2 * this.FSIZE);
    gl.enableVertexAttribArray(this.attribs.a_texcoord);

    //Render
    gl.drawArrays(gl.TRIANGLES, 0, this.attribs["number"]);
};

Sprite.prototype.initUniforms = function() {
    this.translationMatrix = mat4.create();
    twgl.setUniforms(this.programWrap, {
        tex: this.texture,
        u_transform: this.translationMatrix
    });
};

Sprite.prototype.dropAttribArrays = function(arrays) {

};

Sprite.prototype.initBuffers = function() {
    var vertices = this.attribs["vertices"];
    var gl = this.gl;
    
    this.vertexBuffer = gl.createBuffer()
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

};


module.exports = Sprite;