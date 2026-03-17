document.addEventListener('DOMContentLoaded', () => {
    const gameScreen = document.getElementById('game-screen');
    const surpriseScreen = document.getElementById('surprise-screen');
    const gameContainer = document.getElementById('game-container');
    const scoreElement = document.getElementById('score');
    const replayBtn = document.getElementById('replay-btn');
    
    let score = 0;
    const targetScore = 18;
    let gameInterval;
    let particlesInterval;
    
    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        // Random horizontal position (keep away from very edges)
        const leftPos = Math.random() * 80 + 10;
        heart.style.left = leftPos + 'vw';
        
        // Random size for parallax effect
        const scale = Math.random() * 0.6 + 0.7; // 0.7 to 1.3
        const zIndex = Math.floor(scale * 10);
        
        heart.style.transform = `scale(${scale})`;
        heart.style.zIndex = zIndex;
        
        // Random float duration based on size (bigger = faster to simulate closeness)
        const duration = 8 - (scale * 2.5); // 4.5s to 6.5s
        heart.style.animationDuration = duration + 's';
        
        // Interaction
        heart.addEventListener('click', (e) => {
            if (heart.classList.contains('popped')) return;
            
            heart.classList.add('popped');
            score++;
            scoreElement.textContent = score;
            
            // Pop effect
            createClickEffect(e.clientX, e.clientY);
            
            setTimeout(() => {
                if (gameContainer.contains(heart)) {
                    heart.remove();
                }
            }, 400); 
            
            checkWin();
        });
        
        gameContainer.appendChild(heart);
        
        setTimeout(() => {
            if (gameContainer.contains(heart)) {
                heart.remove();
            }
        }, duration * 1000);
    }
    
    function createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.style.position = 'absolute';
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        effect.style.width = '20px';
        effect.style.height = '20px';
        effect.style.borderRadius = '50%';
        effect.style.background = 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,117,140,0) 70%)';
        effect.style.transform = 'translate(-50%, -50%)';
        effect.style.pointerEvents = 'none';
        effect.style.boxShadow = '0 0 30px 15px rgba(255, 51, 102, 0.6)';
        effect.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        effect.style.zIndex = '100';
        
        document.body.appendChild(effect);
        
        // Trigger reflow
        effect.getBoundingClientRect();
        
        effect.style.transform = 'translate(-50%, -50%) scale(4)';
        effect.style.opacity = '0';
        
        // Floating particles from pop
        for(let i=0; i<4; i++) {
            createMiniParticle(x, y);
        }
        
        setTimeout(() => {
            if (document.body.contains(effect)) {
                document.body.removeChild(effect);
            }
        }, 500);
    }
    
    function createMiniParticle(x, y) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.background = '#ff758c';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '99';
        
        document.body.appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 60 + 20;
        const destX = x + Math.cos(angle) * distance;
        const destY = y + Math.sin(angle) * distance;
        
        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${destX - x}px, ${destY - y}px) scale(0)`, opacity: 0 }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
            fill: 'forwards'
        });
        
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 600);
    }
    
    function checkWin() {
        if (score >= targetScore) {
            clearInterval(gameInterval);
            
            // Pop all remaining hearts
            const remainingHearts = document.querySelectorAll('.heart:not(.popped)');
            remainingHearts.forEach(h => {
                h.classList.add('popped');
            });
            
            setTimeout(() => {
                gameScreen.classList.remove('active');
                gameScreen.classList.add('hidden');
                
                setTimeout(() => {
                    surpriseScreen.classList.remove('hidden');
                    surpriseScreen.classList.add('active');
                    startAmbientConfetti();
                    triggerBurst();
                }, 800); // Wait for game screen to hide completely
            }, 600);
        }
    }
    
    function startGame() {
        score = 0;
        scoreElement.textContent = score;
        gameContainer.innerHTML = '';
        
        clearInterval(particlesInterval);
        document.getElementById('particles').innerHTML = '';
        
        gameScreen.classList.remove('hidden');
        gameScreen.classList.add('active');
        surpriseScreen.classList.remove('active');
        surpriseScreen.classList.add('hidden');
        
        // Initial wave
        for(let i=0; i<3; i++) {
            setTimeout(createHeart, i * 400);
        }
        
        // Game loop
        gameInterval = setInterval(() => {
            createHeart();
            // More intensity as game progresses
            if (score > 8 && Math.random() > 0.5) {
                setTimeout(createHeart, 300);
            }
            if (score > 14 && Math.random() > 0.3) {
                setTimeout(createHeart, 150);
            }
        }, 850);
    }
    
    function triggerBurst() {
        const colors = ['#ff3366', '#ff758c', '#ffffff', '#ffd700', '#ff9a9e'];
        const container = document.getElementById('particles');
        
        for (let i = 0; i < 150; i++) {
            const confetti = document.createElement('div');
            
            // Random shape (circle or rectangle)
            const isCircle = Math.random() > 0.5;
            confetti.style.borderRadius = isCircle ? '50%' : '2px';
            
            const size = Math.random() * 12 + 4;
            confetti.style.width = size + 'px';
            confetti.style.height = (isCircle ? size : size * (Math.random() * 2 + 1)) + 'px';
            
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'absolute';
            confetti.style.left = '50vw';
            confetti.style.top = '50vh';
            confetti.style.boxShadow = '0 0 6px rgba(0,0,0,0.2)';
            
            container.appendChild(confetti);
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 25 + 5;
            const tx = Math.cos(angle) * velocity * 20;
            const ty = Math.sin(angle) * velocity * 20 + 200; // adding gravity
            
            confetti.animate([
                { transform: 'translate(-50%, -50%) rotate(0deg) scale(0)', opacity: 0 },
                { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)', opacity: 1, offset: 0.1 },
                { transform: `translate(${tx}px, ${ty}px) rotate(${Math.random() * 1000}deg) scale(${Math.random() * 0.5 + 0.5})`, opacity: 0 }
            ], {
                duration: Math.random() * 2000 + 2000,
                easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                if (container.contains(confetti)) confetti.remove();
            }, 4000);
        }
    }
    
    function startAmbientConfetti() {
        const container = document.getElementById('particles');
        const colors = ['#ff758c', '#ffffff', '#ff9a9e', 'rgba(255,255,255,0.5)'];
        
        particlesInterval = setInterval(() => {
            if(!surpriseScreen.classList.contains('active')) return;
            
            const confetti = document.createElement('div');
            const size = Math.random() * 8 + 3;
            
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.position = 'absolute';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = -20 + 'px';
            confetti.style.borderRadius = '50%';
            confetti.style.filter = 'blur(1px)';
            
            container.appendChild(confetti);
            
            confetti.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: Math.random() * 0.5 + 0.3 },
                { transform: `translate(${Math.random() * 100 - 50}px, 110vh) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: (Math.random() * 5 + 5) * 1000,
                easing: 'linear',
                fill: 'forwards'
            });
            
            setTimeout(() => {
                if (container.contains(confetti)) {
                    confetti.remove();
                }
            }, 10000);
        }, 400);
    }
    
    replayBtn.addEventListener('click', startGame);
    
    // Start!
    startGame();
});
