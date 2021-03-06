var vec2 = require("./vector2d")

function AABB(x, y, x1, y1) {
    this.pos = new vec2(x, y);
    this.pos1 = new vec2(x1, y1);

    this.dimension = new vec2(Math.abs(this.pos1.x - this.pos.x), Math.abs(this.pos1.y - this.pos.y));

};

AABB.prototype.doesOverlap = function(comparison) {
    if (!(comparison instanceof AABB)) {
        return false;
    }

    if (this.pos1.x <= comparison.pos.x || this.pos.x >= comparison.pos1.x) {
        return false;
    };

    if (this.pos1.y <= comparison.pos.y || this.pos.y >= comparison.pos1.y) {
        return false;
    };

    return true;
};

AABB.prototype.resolveOverlap = function(comparison) {
    var left = this.pos.x - comparison.pos1.x;
    var right = this.pos1.x - comparison.pos.x;
    var top = this.pos.y - comparison.pos1.y;
    var bottom = this.pos1.y - comparison.pos.y;
    var resolvedVector = new vec2(0, 0);

    if ((left > 0 || right < 0) || (top > 0 || bottom < 0)) {
        return resolvedVector;
    };

    if (Math.abs(left) < right) {
        resolvedVector.x = left;
    } else {
        resolvedVector.x = right;
    };

    if (Math.abs(top) < bottom) {
        resolvedVector.y = top;
    } else {
        resolvedVector.y = bottom;
    };

    if (Math.abs(resolvedVector.x) < Math.abs(resolvedVector.y)) {
        resolvedVector.y = 0;
    } else {
        resolvedVector.x = 0;
    };

    return resolvedVector;
};

module.exports = AABB;