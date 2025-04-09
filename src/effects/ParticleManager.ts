import { Particle } from './Particle';

/**
 * Manages particle effects in the game
 */
export class ParticleManager {
  private container: HTMLElement;
  private particles: Particle[] = [];
  private isRunning: boolean = false;
  private lastTimestamp: number = 0;

  /**
   * Create a new particle manager
   * @param container Container element for particles
   */
  constructor(container: HTMLElement) {
    this.container = container;
    this.start();
  }

  /**
   * Start the particle update loop
   */
  private start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTimestamp = performance.now();
    requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Update all particles
   * @param timestamp Current timestamp from requestAnimationFrame
   */
  private update(timestamp: number): void {
    if (!this.isRunning) return;

    // Calculate delta time in seconds
    const deltaTime = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    // Update all particles and remove dead ones
    this.particles = this.particles.filter(particle => particle.update(deltaTime));

    // Continue the loop if there are particles
    if (this.particles.length > 0 || this.isRunning) {
      requestAnimationFrame(this.update.bind(this));
    }
  }

  /**
   * Create a burst of particles at the specified position
   * @param x Center X position
   * @param y Center Y position
   * @param count Number of particles to create
   * @param color Color of the particles
   * @param value Optional value to display
   */
  createParticleBurst(
    x: number, 
    y: number, 
    count: number = 10, 
    color: string = '#ffffff',
    value: number | null = null
  ): void {
    // Ensure the update loop is running
    if (!this.isRunning) {
      this.start();
    }

    // Create the specified number of particles
    for (let i = 0; i < count; i++) {
      // Calculate random velocity in all directions
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;
      const velocityX = Math.cos(angle) * speed;
      const velocityY = Math.sin(angle) * speed;

      // Randomize size slightly
      const size = 5 + Math.random() * 5;

      // Randomize lifespan
      const lifespan = 0.5 + Math.random() * 1;

      // Create the particle
      const particle = new Particle(
        x,
        y,
        velocityX,
        velocityY,
        size,
        color,
        lifespan,
        this.container,
        i === 0 ? value : null // Only show value on one particle
      );

      // Add to the particles array
      this.particles.push(particle);
    }
  }

  /**
   * Create a trail of particles following a path
   * @param startX Start X position
   * @param startY Start Y position
   * @param endX End X position
   * @param endY End Y position
   * @param count Number of particles to create
   * @param color Color of the particles
   */
  createParticleTrail(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    count: number = 10,
    color: string = '#ffffff'
  ): void {
    // Ensure the update loop is running
    if (!this.isRunning) {
      this.start();
    }

    // Create particles along the path
    for (let i = 0; i < count; i++) {
      // Interpolate position along the path
      const t = i / (count - 1);
      const x = startX + (endX - startX) * t;
      const y = startY + (endY - startY) * t;

      // Calculate velocity perpendicular to the path
      const pathAngle = Math.atan2(endY - startY, endX - startX);
      const perpAngle = pathAngle + Math.PI / 2;
      const spread = 30;
      const velocityX = Math.cos(perpAngle) * (Math.random() * spread - spread / 2);
      const velocityY = Math.sin(perpAngle) * (Math.random() * spread - spread / 2);

      // Randomize size and lifespan
      const size = 3 + Math.random() * 3;
      const lifespan = 0.3 + Math.random() * 0.7;

      // Create the particle
      const particle = new Particle(
        x,
        y,
        velocityX,
        velocityY,
        size,
        color,
        lifespan,
        this.container
      );

      // Add to the particles array
      this.particles.push(particle);
    }
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles.forEach(particle => particle.remove());
    this.particles = [];
  }
}
