import * as THREE from '../libs/three125/three.module.js';
import { OrbitControls } from '../libs/three125/OrbitControls.js';
import { Stats } from '../libs/stats.module.js';
import { ARButton } from '../libs/ARButton.js';

class App {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);
        this.camera.position.set(0, 1.6, 3);

        this.scene = new THREE.Scene();

        this.scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

        const light = new THREE.DirectionalLight(0xffffff);
        light.position.set(1, 1, 1).normalize();
        this.scene.add(light);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 1.6, 0);
        this.controls.update();

        this.stats = new Stats();
        container.appendChild(this.stats.dom);

        this.initScene();
        this.setupVR();

        // Initialize socket connection
        this.socket = io();

        // Handle incoming paint data
        this.socket.on('paint', this.handleIncomingPaintData.bind(this));

        window.addEventListener('resize', this.resize.bind(this));
    }

    initScene() {
        this.geometry = new THREE.SphereBufferGeometry(0.01, 16, 16);  // Geometry for the paint strokes
        this.material = new THREE.MeshPhongMaterial({ color: 0xff0000 });  // Fixed color (red)
        this.meshes = [];
        this.isPainting = false;  // State to check if painting is ongoing
    }

    setupVR() {
        this.renderer.xr.enabled = true;

        const btn = new ARButton(this.renderer);

        this.controller = this.renderer.xr.getController(0);
        this.controller.addEventListener('selectstart', this.onSelectStart.bind(this));
        this.controller.addEventListener('selectend', this.onSelectEnd.bind(this));
        this.scene.add(this.controller);

        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    onSelectStart() {
        this.isPainting = true;
    }

    onSelectEnd() {
        this.isPainting = false;
    }

    paint() {
        if (this.isPainting) {
            const mesh = new THREE.Mesh(this.geometry, this.material);
            mesh.position.set(0, 0, -0.05).applyMatrix4(this.controller.matrixWorld);
            mesh.quaternion.setFromRotationMatrix(this.controller.matrixWorld);
            this.scene.add(mesh);
            this.meshes.push(mesh);

            // Emit paint data
            const paintData = {
                position: mesh.position.toArray(),
                quaternion: mesh.quaternion.toArray()
            };
            this.socket.emit('paint', paintData);
        }
    }

    handleIncomingPaintData(data) {
        const { position, quaternion } = data;
        const mesh = new THREE.Mesh(this.geometry, this.material);
        mesh.position.fromArray(position);
        mesh.quaternion.fromArray(quaternion);
        this.scene.add(mesh);
        this.meshes.push(mesh);
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        this.stats.update();
        this.paint();
        this.renderer.render(this.scene, this.camera);
    }
}

export { App };
