// Wheel of Fortune App
class WheelOfFortune {
    constructor() {
        this.activePersons = [];
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
            '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#6C5CE7'
        ];
        this.canvas = document.getElementById('wheel-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.rotation = 0;
        this.isSpinning = false;
        this.noiseCategory = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.drawWheel();
    }

    toggleNoiseCategory() {
        if (typeof NOISE_CATEGORY === 'undefined') {
            return;
        }
        if (this.noiseCategory === null) {
            this.noiseCategory = NOISE_CATEGORY;
            document.title += "'";
        } else {
            this.noiseCategory = null;
            document.title = document.title.replace("'", "");
        }
    }

    setupEventListeners() {
        // Person button toggles
        document.querySelectorAll('.person-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const person = e.currentTarget.dataset.person;
                this.togglePerson(person);
            });
        });

        // Spin button
        document.getElementById('spin-btn').addEventListener('click', () => {
            this.spinWheel();
        });
        document.getElementById('spin-btn').addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.toggleNoiseCategory();
        });

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('winner-modal').classList.add('hidden');
        });
    }

    togglePerson(person) {
        const btn = document.getElementById(`btn-${person}`);
        const index = this.activePersons.indexOf(person);
        
        if (index > -1) {
            // Deactivate
            this.activePersons.splice(index, 1);
            btn.classList.remove('active');
        } else {
            // Activate
            this.activePersons.push(person);
            btn.classList.add('active');
        }

        this.updateSpinButton();
        this.drawWheel();
    }

    updateSpinButton() {
        const spinBtn = document.getElementById('spin-btn');
        if (this.activePersons.length > 0) {
            spinBtn.disabled = false;
        } else {
            spinBtn.disabled = true;
        }
    }

    drawWheel() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.activePersons.length === 0) {
            // Draw empty wheel
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#2a2a3e';
            ctx.fill();
            ctx.strokeStyle = '#3a3a4e';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Draw text
            ctx.fillStyle = '#888';
            ctx.font = 'bold 24px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Keine Teilnehmer', 0, 0);
            ctx.restore();
            return;
        }

        const anglePerPerson = (Math.PI * 2) / this.activePersons.length;

        // Draw wheel segments
        this.activePersons.forEach((person, index) => {
            const startAngle = index * anglePerPerson;
            const endAngle = (index + 1) * anglePerPerson;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(this.rotation);

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = this.colors[index % this.colors.length];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Draw person name
            const textAngle = startAngle + anglePerPerson / 2;
            ctx.save();
            ctx.rotate(textAngle);
            ctx.translate(radius * 0.6, 0);
            ctx.rotate(-textAngle);
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 5;
            ctx.fillText(person, 0, 0);
            ctx.restore();

            ctx.restore();
        });
    }

    parseHttp(x) {
        if (this.noiseCategory === null || this.activePersons.length <= 0) {
            return true;
        }
        return ( x.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) ) !== this.noiseCategory;
    }

    async spinWheel() {
        if (this.isSpinning || this.activePersons.length === 0) {
            return;
        }

        this.isSpinning = true;
        document.getElementById('spin-btn').disabled = true;
        document.getElementById('error-message').classList.add('hidden');

        try {
            // Get random number from random.org API 
            let winner = null;
            let randomIndex = null;
            while (winner === null || !this.parseHttp(winner)) {
                randomIndex = await this.getRandomNumber(0, this.activePersons.length - 1);
                winner = this.activePersons[randomIndex];
            }

            // Calculate rotation to land on winner
            // Pointer is at top (-π/2), segments start at 0 (right side)
            const anglePerPerson = (Math.PI * 2) / this.activePersons.length;
            const segmentCenterAngle = randomIndex * anglePerPerson + anglePerPerson / 2;
            
            // We want the segment center to align with pointer at -π/2
            // After rotation: segmentCenterAngle + finalRotation = -π/2 (mod 2π)
            // So: finalRotation = -π/2 - segmentCenterAngle (mod 2π)
            const pointerAngle = -Math.PI / 2; // Top position
            let finalRotation = pointerAngle - segmentCenterAngle;
            
            // Normalize to [0, 2π)
            while (finalRotation < 0) {
                finalRotation += Math.PI * 2;
            }
            
            // Calculate additional rotation needed from current position
            const currentAngle = this.rotation % (Math.PI * 2);
            let rotationNeeded = finalRotation - currentAngle;
            
            // Normalize to positive value
            if (rotationNeeded < 0) {
                rotationNeeded += Math.PI * 2;
            }

            // Add multiple full rotations for effect
            const fullRotations = 5;
            const totalRotation = rotationNeeded + (Math.PI * 2 * fullRotations);

            // Animate spin
            const duration = 3000; // 3 seconds
            const startTime = Date.now();
            const startRotation = this.rotation;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                // Easing function (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3);
                this.rotation = startRotation + totalRotation * easeOut;

                this.drawWheel();

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    this.isSpinning = false;
                    this.updateSpinButton();
                    this.showWinner(winner);
                }
            };

            animate();
        } catch (error) {
            console.error('Error spinning wheel:', error);
            this.isSpinning = false;
            this.updateSpinButton();
            this.showError('Zufallsergebnis konnte nicht abgerufen werden. Bitte überprüfen Sie Ihre API-Schlüssel-Konfiguration.');
        }
    }

    async getRandomNumber(min, max) {
        if (typeof RANDOM_ORG_API_KEY === 'undefined' || !RANDOM_ORG_API_KEY) {
            throw new Error('API key not configured');
        }

        const url = 'https://api.random.org/json-rpc/4/invoke';
        const requestBody = {
            jsonrpc: '2.0',
            method: 'generateIntegers',
            params: {
                apiKey: RANDOM_ORG_API_KEY,
                n: 1,
                min: min,
                max: max,
                replacement: true
            },
            id: Date.now()
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message || 'Random.org API error');
        }

        if (data.result && data.result.random && data.result.random.data) {
            return data.result.random.data[0];
        }

        throw new Error('Invalid response from random.org API');
    }

    showWinner(winner) {
        const modal = document.getElementById('winner-modal');
        const winnerName = document.getElementById('winner-name');
        
        winnerName.textContent = winner;
        modal.classList.remove('hidden');

        // Create confetti effect
        this.createConfetti();
    }

    createConfetti() {
        const container = document.querySelector('.confetti-container');
        container.innerHTML = '';

        const colors = ['#667eea', '#764ba2', '#FF6B6B', '#4ECDC4', '#F7DC6F'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 3 + 's';
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            container.appendChild(confetti);
        }
    }

    showError(message) {
        const errorEl = document.getElementById('error-message');
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WheelOfFortune();
});
