import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class ParticleSystem {
  constructor(particleCount = 1000, particleSize = 0.1, emitterPosition = new THREE.Vector3(0, 0, 0)) {
    this.particleCount = particleCount;
    this.particleSize = particleSize;
    this.emitterPosition = emitterPosition;
    this.particleSystem = null;
    this.initParticles();
  }

  initParticles() {
    // Create particle geometry
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = this.emitterPosition.x + (Math.random() - 0.5) * 2;
      positions[i * 3 + 1] = this.emitterPosition.y + (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = this.emitterPosition.z + (Math.random() - 0.5) * 2;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: this.particleSize,
    });

    // Create particle system
    this.particleSystem = new THREE.Points(particles, particleMaterial);
  }

  addToScene(scene) {
    scene.add(this.particleSystem);
  }

  removeFromScene(scene) {
    scene.remove(this.particleSystem);
    this.particleSystem.geometry.dispose();
    this.particleSystem.material.dispose();
    this.particleSystem = null;
  }

  updateParticles() {
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