import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class ParticleSystem {
  constructor(particleCount = 1000, particleSize = 0.1, emitterPosition = new THREE.Vector3(0, 0, 0)) {
    this.particleCount = particleCount;
    this.particleSize = particleSize;
    this.emitterPosition = emitterPosition;
    this.particleSystem = null;
  }

  setPosition(position) {
    this.emitterPosition = position;
  }

  // Function to show particles
    showParticles(scene, position = this.emitterPosition) {
        
        if (this.particleSystem) this.removeFromScene(scene);
        
        this.setPosition(position);
        this.initParticles();
        this.addToScene(scene);
    }

  initParticles() {
    // Create particle geometry
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = this.emitterPosition.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = this.emitterPosition.y + (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = this.emitterPosition.z + (Math.random() - 0.5) * 2;

      // Generate random color in HSV format and convert to RGB
      const hue = Math.random() * 0.1; // Orange to red hue range
      const color = new THREE.Color();
      color.setHSL(hue, 1.0, 0.5); // Full saturation and medium lightness

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      size: this.particleSize,
      vertexColors: true, // So the set colors apply
    });

    // Create particle system
    this.particleSystem = new THREE.Points(particles, particleMaterial);
  }

  addToScene(scene) {
    if (this.particleSystem) {
        scene.add(this.particleSystem);
    }
    else console.log("You can't add particles before initializing them!!");
  }

  removeFromScene(scene) {
    if (this.particleSystem) {
        scene.remove(this.particleSystem);
        this.particleSystem.geometry.dispose();
        this.particleSystem.material.dispose();
        this.particleSystem = null;
      }
    else console.log("There is no particle system to remove!!");
  }

  updateParticles() {
    if (! this.particleSystem) return;

    const positions = this.particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3 + 1] -= 0.01;
      if (positions[i * 3 + 1] < -5) {
        positions[i * 3 + 1] = 5;
      }
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }
}