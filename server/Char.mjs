import { Vector3 } from "three";
import { FirstPersonControls, OrbitControls } from "three/examples/jsm/Addons.js";
import { mx_bits_to_01 } from "three/examples/jsm/nodes/materialx/lib/mx_noise.js";

export class Char {
    constructor(vectoring) {
        this.position = vectoring.newPos(0, 0, 0);

        this.isGround = true;
        this.spdBoost = 1;
        this.vspeed = 0;
        this.isMoving = false;
        this.gravity = new Vector3(0, -0.01, 0);
        this.feet = new Vector3(0, -1, 0);
        this.spd = 0.3;

        this.camera = {
            camera: {},
            positionRelative: vectoring.newPos(0, 1, 0),
            rotation: vectoring.newPos(0, 0, 0),
            fov: 80,
            effects: {
                position: vectoring.newPos(0, 0, 0),
                rotation: vectoring.newPos(0, 0, 0)
            },
            animateWalk: () => {

                if (this.isMoving) {
                    this.camera.effects.position.y = parseFloat(Math.sin(performance.now() / 80)) / 140;
                } else {
                    this.camera.effects.position.y = 0;
                }
            }
        };
        this.hands = {
            left: new Vector3(-0.32, -0.18, 0),
            right: new Vector3(0.3, -0.15, 0),
            pos: new Vector3(1, 0, 0)
        }

        this.hitbox = {}
    }

    compute(gameobject, model, camera) {

    }


    updateTransform(inputs, vectoring) {
        let inputVector = new Vector3(inputs.D - inputs.A, 0, inputs.S - inputs.W);

        const quaternion = this.camera.camera.quaternion;

        inputVector.applyQuaternion(quaternion);

        if (inputVector.length() > 0) {
            inputVector.normalize();
        }
        inputVector.multiplyScalar(this.spd);

        this.position = vectoring.sumVector3(this.position, inputVector)

        this.hands.pos.add(inputVector);

        const cameraPosition = vectoring.sumPositions(this.position, this.camera.positionRelative);
        this.reCam(cameraPosition);

    }


    reCam(newPos) {
        this.camera.camera.position.x = newPos.x;
        this.camera.camera.position.y = newPos.y;
        this.camera.camera.position.z = newPos.z;
    }

    applyCamEffects() {
        this.camera.camera.position.y += this.camera.effects.position.y
    }

    applyHandEffects() {

    }

    computeGravity() {
        if (!this.isGround) {
            if (this.vspeed < 0.25) {
                this.vspeed -= 0.002
            }
        }
        this.position.y += this.vspeed;
    }

    checkGround() {
    }

}