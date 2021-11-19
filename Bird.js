import { vec3, mat4 } from '../../lib/gl-matrix-module.js';
import { Node } from './Node.js';
import { Utils } from './Utils.js';

export class Bird extends Node {

    constructor(mesh, image, options) {
        super(options);
        Utils.init(this, this.constructor.defaults, options);
        this.mesh = mesh;
        this.image = image;

        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);
        this.keys = {};
    }

    update(dt) {
        const c = this;

        const forward = vec3.set(vec3.create(), -Math.sin(c.rotation[1]), 0, -Math.cos(c.rotation[1]));

        const d = 0.015;

        // 1: add movement acceleration
        let acc = vec3.create();
        if (this.keys['KeyW']) {
            this.translation[1] += d;
        }

        if (this.keys['KeyS']) {
            this.translation[1] -= d;
        }

        if (this.keys['KeyD']) {
            this.rotation[1] -= d; 
        }

        if (this.keys['KeyA']) {
            this.rotation[1] += d; 
        }
        //vec3.add(acc, acc, forward);
        // 2: update velocity
        
        vec3.scaleAndAdd(c.velocity, c.velocity, acc, dt * c.acceleration);

        // 3: if no movement, apply friction
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            vec3.scale(c.velocity, c.velocity, 1 - c.friction);
        }

        // 4: limit speed
        const len = vec3.len(c.velocity);
        if (len > c.maxSpeed) {
            vec3.scale(c.velocity, c.velocity, c.maxSpeed / len);
        }
    }

    enable() {
        document.addEventListener('keydown', this.keydownHandler);
        document.addEventListener('keyup', this.keyupHandler);
    }

    disable() {
        document.removeEventListener('keydown', this.keydownHandler);
        document.removeEventListener('keyup', this.keyupHandler);

        for (let key in this.keys) {
            this.keys[key] = false;
        }
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }
}

Bird.defaults = {
    velocity         : [0, 0, 0],
    maxSpeed         : 3,
    friction         : 0.2,
    acceleration     : 20
};