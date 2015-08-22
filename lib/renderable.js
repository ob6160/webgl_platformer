var twgl = window.twgl;
var mat4 = require('gl-matrix').mat4;
var vec3 = require('gl-matrix').vec3;

function Renderable(gl, wrapProgram, program, tex) {
    this.vertexBuffer = null;
    this.texture = tex;
    this.translationMatrix = null;

    this.mapDimen = 20.5;

    var x = 0;
    var y = 0;
    var w = 100;
    var h = 100;

    this.offset = 0;
    this.program = program;
    this.programWrap = wrapProgram;
    this.gl = gl;

    this.attribs = {
        vertices: [],
        number: 6,
        a_position: gl.getAttribLocation(this.program, 'a_position'),
        a_tilepos: gl.getAttribLocation(this.program, 'a_tilepos'),
        a_texcoord: gl.getAttribLocation(this.program, 'a_texcoord')
    }

    this.x = 0;
    this.y = 0;

    this.FSIZE = new Float32Array().BYTES_PER_ELEMENT;

    this.initUniforms();
};

Renderable.prototype.addQuad = function(x, y, w, h, u, v) {
    var x1 = x;
    var x2 = x + w;
    var y1 = y;
    var y2 = y + h;

    var base_quad = [
        x, y, 0, -1, u, v,
        x + w, y, 1, -1, u, v,
        x + w, y + h, 1, 0, u, v,
        x, y, 0, -1, u, v,
        x + w, y + h, 1, 0, u, v,
        x, y + h, 0, 0, u, v
    ];

    for (var i = 0; i < base_quad.length; i++) {
        this.attribs.vertices.push(base_quad[i]);
    };

    this.offset++;

};

Renderable.prototype.bind = function() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer)
};

Renderable.prototype.render = function() {
    var gl = this.gl;

    //Bind buffer;
    this.bind(gl);

    //Set uniforms
    twgl.setUniforms(this.programWrap, {
        tex: this.texture,
        u_transform: this.translationMatrix,
        u_mapdimen: this.mapDimen
    });

    //Set attributes
    gl.vertexAttribPointer(this.attribs.a_position, 2, gl.FLOAT, false, 6 * this.FSIZE, 0);
    gl.enableVertexAttribArray(this.attribs.a_position);

    gl.vertexAttribPointer(this.attribs.a_texcoord, 2, gl.FLOAT, false, 6 * this.FSIZE, 2 * this.FSIZE);
    gl.enableVertexAttribArray(this.attribs.a_texcoord);

    gl.vertexAttribPointer(this.attribs.a_tilepos, 2, gl.FLOAT, false, 6 * this.FSIZE, 4 * this.FSIZE);
    gl.enableVertexAttribArray(this.attribs.a_tilepos);

    //Render
    gl.drawArrays(gl.TRIANGLES, 0, this.attribs["number"] * this.offset);
};

Renderable.prototype.initUniforms = function() {
    this.translationMatrix = mat4.create();
    twgl.setUniforms(this.programWrap, {
        tex: this.texture,
        u_transform: this.translationMatrix
    });
};



Renderable.prototype.initBuffers = function() {
    var vertices = new Float32Array(this.attribs["vertices"]);
    var gl = this.gl;

    this.vertexBuffer = gl.createBuffer()

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

};


module.exports = Renderable;