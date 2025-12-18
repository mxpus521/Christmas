// Snow Particle System
class Snowfall {
    constructor() {
        this.canvas = document.getElementById('snow-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.resize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                density: Math.random() * this.particleCount,
                speed: Math.random() * 0.5 + 0.2
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.beginPath();

        for (let i = 0; i < this.particleCount; i++) {
            let p = this.particles[i];
            this.ctx.moveTo(p.x, p.y);
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2, true);

            p.y += p.speed;
            p.x += Math.sin(p.density) * 0.5;

            if (p.y > this.canvas.height) {
                this.particles[i] = {
                    x: Math.random() * this.canvas.width,
                    y: -10,
                    radius: p.radius,
                    density: p.density,
                    speed: p.speed
                };
            }
        }
        this.ctx.fill();
        requestAnimationFrame(() => this.animate());
    }
}

// Interactive Progress Ring
class ProgressRing {
    constructor() {
        this.circle = document.getElementById('progress-circle');
        this.radius = this.circle.r.baseVal.value;
        this.circumference = this.radius * 2 * Math.PI;
        this.label = document.getElementById('ring-label');
        this.value = document.getElementById('ring-value');
        this.listItems = document.querySelectorAll('.order-list li');

        this.circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;
        this.circle.style.strokeDashoffset = this.circumference;

        this.init();
    }

    setProgress(percent) {
        const offset = this.circumference - (percent / 100 * this.circumference);
        this.circle.style.strokeDashoffset = offset;
    }

    init() {
        this.listItems.forEach((li) => {
            li.addEventListener('mouseenter', () => {
                const percent = li.getAttribute('data-percent');
                const label = li.getAttribute('data-label');
                const value = li.getAttribute('data-value');

                this.setProgress(percent);
                this.label.textContent = label;
                this.value.textContent = value;

                this.listItems.forEach(i => i.classList.remove('active'));
                li.classList.add('active');
            });
        });

        // Set initial state
        this.setProgress(100);
        const initial = this.value.getAttribute('data-initial');
        if (initial) this.value.textContent = initial;
    }
}

// Scroll Animations (AOS)
const initScrollAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                if (entry.target.classList.contains('reveal-text')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos], .reveal-text').forEach(el => {
        observer.observe(el);
    });
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Snow
    new Snowfall();

    // 2. Interactive Ring
    new ProgressRing();

    // 3. Scroll Animations
    initScrollAnimations();

    // 4. Smooth revealing for hero immediately
    setTimeout(() => {
        document.querySelectorAll('#hero .reveal-text').forEach(el => {
            el.classList.add('active');
        });
    }, 300);
});
