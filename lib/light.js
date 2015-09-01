var vec2 = require("./vector2d");

function Light(x, y, intensity, colour) {
	this.position = new vec2(x, y);
	this.intensity = intensity;
	this.colour = colour;
};

module.exports = Light;