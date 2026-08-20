/**
 * 따뜻한 봄날 벚꽃잎 흩날리기 애니메이션 (Spring Cherry Blossom Petals Engine)
 */
class SpringPetals {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.petals = [];
        this.maxPetals = 40;
        this.animationFrame = null;
        this.isRunning = true;
        this.wind = 0.4;
        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // 마우스 움직임에 따른 부드러운 바람 반응
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
            this.wind = 0.2 + (e.clientX / window.innerWidth - 0.5) * 0.6;
        });

        // 벚꽃잎 생성
        for (let i = 0; i < this.maxPetals; i++) {
            this.petals.push(this.createPetal(true));
        }

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createPetal(isInitial = false) {
        const colors = [
            'rgba(255, 182, 193, ', // 라이트 핑크
            'rgba(255, 192, 203, ', // 핑크
            'rgba(255, 218, 185, ', // 피치 퍼프
            'rgba(255, 160, 180, ', // 딥 블라썸
            'rgba(255, 235, 238, '  // 페일 스프링
        ];
        const baseColor = colors[Math.floor(Math.random() * colors.length)];
        const alpha = Math.random() * 0.45 + 0.4;

        return {
            x: Math.random() * (this.canvas.width + 100) - 50,
            y: isInitial ? Math.random() * this.canvas.height : -20,
            size: Math.random() * 10 + 8,
            speedY: Math.random() * 1.1 + 0.7,
            speedX: Math.random() * 1.2 - 0.4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 2,
            swingAngle: Math.random() * Math.PI * 2,
            swingSpeed: Math.random() * 0.03 + 0.015,
            color: baseColor + alpha + ')',
            shadowColor: 'rgba(255, 150, 170, 0.25)',
            petalType: Math.floor(Math.random() * 3)
        };
    }

    drawPetal(petal) {
        this.ctx.save();
        this.ctx.translate(petal.x, petal.y);
        this.ctx.rotate((petal.rotation * Math.PI) / 180);

        this.ctx.fillStyle = petal.color;
        this.ctx.shadowColor = petal.shadowColor;
        this.ctx.shadowBlur = 4;

        this.ctx.beginPath();
        if (petal.petalType === 0) {
            // 하트형 벚꽃잎
            this.ctx.moveTo(0, 0);
            this.ctx.bezierCurveTo(
                -petal.size / 2, -petal.size / 2,
                -petal.size, petal.size / 3,
                0, petal.size
            );
            this.ctx.bezierCurveTo(
                petal.size, petal.size / 3,
                petal.size / 2, -petal.size / 2,
                0, 0
            );
        } else if (petal.petalType === 1) {
            // 살구꽃 타원형 잎
            this.ctx.ellipse(0, 0, petal.size * 0.5, petal.size * 0.85, Math.PI / 4, 0, Math.PI * 2);
        } else {
            // 부드러운 꽃잎
            this.ctx.moveTo(0, -petal.size * 0.5);
            this.ctx.quadraticCurveTo(petal.size * 0.6, 0, 0, petal.size * 0.8);
            this.ctx.quadraticCurveTo(-petal.size * 0.6, 0, 0, -petal.size * 0.5);
        }
        this.ctx.fill();
        this.ctx.restore();
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = 0; i < this.petals.length; i++) {
            const p = this.petals[i];

            p.swingAngle += p.swingSpeed;
            p.x += Math.sin(p.swingAngle) * 1.2 + this.wind + p.speedX * 0.3;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;

            // 마우스 상호작용
            const dx = p.x - this.mouseX;
            const dy = p.y - this.mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                p.x += (dx / dist) * 1.8;
                p.y += (dy / dist) * 1.2;
            }

            this.drawPetal(p);

            // 화면 밖 재순환
            if (p.y > this.canvas.height + 20 || p.x > this.canvas.width + 80 || p.x < -80) {
                this.petals[i] = this.createPetal(false);
            }
        }
    }

    animate() {
        if (!this.isRunning) return;
        this.update();
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    toggle() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.animate();
        } else {
            cancelAnimationFrame(this.animationFrame);
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        return this.isRunning;
    }
}

window.SpringPetals = SpringPetals;
