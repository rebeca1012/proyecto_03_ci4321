import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

// This particle system currently is just to simulate a simple explosion with red-ish particle that
// go outward from the emitter's position
export class ParticleSystem {
  constructor(particleCount = 1000, particleSize = 0.1, emitterPosition = new THREE.Vector3(0, 0, 0)) {
    this.particleCount = particleCount;
    this.particleSize = particleSize;
    this.emitterPosition = emitterPosition;
    this.particleSystem = null;
    // Store velocities for each particle
    this.velocities = new Float32Array(this.particleCount * 3); 
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
    const spawnRange = 0.5;  // range will be -spawnRange to spawnRange
    const speedRange = 0.1; // speed will be 0 to speedRange

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = this.emitterPosition.x + (Math.random() - 0.5) * spawnRange;
      positions[i * 3 + 1] = this.emitterPosition.y + (Math.random() - 0.5) * spawnRange;
      positions[i * 3 + 2] = this.emitterPosition.z + (Math.random() - 0.5) * spawnRange;

      // Generate random color in HSV format and convert to RGB
      const hue = Math.random() * 0.1; // Orange to red hue range
      const color = new THREE.Color();
      color.setHSL(hue, 1.0, 0.5); // Full saturation and medium lightness

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Calculate initial velocity so they move away from center
      const direction = new THREE.Vector3(
        positions[i * 3] - this.emitterPosition.x,
        positions[i * 3 + 1] - this.emitterPosition.y,
        positions[i * 3 + 2] - this.emitterPosition.z
      ).normalize();
      this.velocities[i * 3] = direction.x * Math.random() * speedRange;
      this.velocities[i * 3 + 1] = direction.y * Math.random() * speedRange;
      this.velocities[i * 3 + 2] = direction.z * Math.random() * speedRange;
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
        positions[i * 3] += this.velocities[i * 3];
        positions[i * 3 + 1] += this.velocities[i * 3 + 1];
        positions[i * 3 + 2] += this.velocities[i * 3 + 2];
    }
    this.particleSystem.geometry.attributes.position.needsUpdate = true;
  }
}