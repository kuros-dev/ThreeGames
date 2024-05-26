import { Vector3 } from "three";

export class Vectoring {


    addVectors(vec1, vec2) {
        return [vec1[0] + vec2[0], vec1[1] + vec2[1], vec1[2] + vec2[2]];
    }

    subtractVectors(vec1, vec2) {
        return [vec1[0] - vec2[0], vec1[1] - vec2[1], vec1[2] - vec2[2]];
    }

    dotProduct(vec1, vec2) {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1] + vec1[2] * vec2[2];
    }

    crossProduct(vec1, vec2) {
        return [
            vec1[1] * vec2[2] - vec1[2] * vec2[1],
            vec1[2] * vec2[0] - vec1[0] * vec2[2],
            vec1[0] * vec2[1] - vec1[1] * vec2[0]
        ];
    }

    rotateVector(vector, axis, angle) {
        var cosTheta = Math.cos(angle);
        var sinTheta = Math.sin(angle);

        var x = vector[0];
        var y = vector[1];
        var z = vector[2];

        var u = axis[0];
        var v = axis[1];
        var w = axis[2];

        var rotatedVector = [
            (cosTheta + (1 - cosTheta) * u * u) * x + ((1 - cosTheta) * u * v - sinTheta * w) * y + ((1 - cosTheta) * u * w + sinTheta * v) * z,
            ((1 - cosTheta) * u * v + sinTheta * w) * x + (cosTheta + (1 - cosTheta) * v * v) * y + ((1 - cosTheta) * v * w - sinTheta * u) * z,
            ((1 - cosTheta) * u * w - sinTheta * v) * x + ((1 - cosTheta) * v * w + sinTheta * u) * y + (cosTheta + (1 - cosTheta) * w * w) * z
        ];

        return rotatedVector;
    }

    sumPositions(elem1, elem2) {
        return {
            x: elem1.x + elem2.x,
            y: elem1.y + elem2.y,
            z: elem1.z + elem2.z
        }
    }

    sumVector3(v1, v2){
        return new Vector3(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    newPos(x, y, z) {
        return {
            x: x,
            y: y,
            z: z
        }
    }

}
