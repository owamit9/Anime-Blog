    // News Sidebar Toggle Function
    function toggleNewsSidebar() {
        const sidebar = document.getElementById('newsSidebar');
        const overlay = document.querySelector('.news-overlay');
        
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            if (overlay) {
                overlay.classList.remove('active');
            }
        } else {
            sidebar.classList.add('active');
            if (overlay) {
                overlay.classList.add('active');
            }
        }
    }

    // Close news sidebar when clicking outside
    document.addEventListener('click', function(event) {
        const sidebar = document.getElementById('newsSidebar');
        const toggle = document.querySelector('.news-toggle');
        
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(event.target) && !toggle.contains(event.target)) {
                sidebar.classList.remove('active');
                const overlay = document.querySelector('.news-overlay');
                if (overlay) {
                    overlay.classList.remove('active');
                }
            }
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Fade in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Navbar background on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.98)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
        }
    });

    // Add hover effects to anime cards
    document.querySelectorAll('.anime-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Counter animation for stats
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            if (target >= 1000000) {
                element.textContent = (current / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = (current / 1000).toFixed(0) + 'K+';
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 50);
    }

    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numbers = entry.target.querySelectorAll('.stat-number');
                numbers.forEach(num => {
                    const text = num.textContent;
                    let target;
                    
                    if (text.includes('M+')) {
                        target = parseFloat(text) * 1000000;
                    } else if (text.includes('K+')) {
                        target = parseFloat(text) * 1000;
                    } else {
                        target = parseInt(text);
                    }
                    
                    if (!isNaN(target)) {
                        animateCounter(num, target);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Community Recommendations System
    class RecommendationSystem {
        constructor() {
            this.recommendations = JSON.parse(localStorage.getItem('animeRecommendations')) || [];
            this.form = document.getElementById('recommendationForm');
            this.grid = document.getElementById('recommendationsGrid');
            
            this.init();
        }
        
        init() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
            
            this.displayRecommendations();
            this.addSampleRecommendations();
        }
        
        handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const recommendation = {
                id: Date.now(),
                animeName: formData.get('animeName'),
                genre: formData.get('genre'),
                rating: formData.get('rating'),
                recommendation: formData.get('recommendation'),
                username: formData.get('username') || 'Anonymous',
                date: new Date().toLocaleDateString(),
                timestamp: Date.now()
            };
            
            // Validation
            if (recommendation.recommendation.length < 50) {
                this.showMessage('Please write at least 50 characters for your recommendation.', 'error');
                return;
            }
            
            this.recommendations.unshift(recommendation);
            this.saveToStorage();
            this.displayRecommendations();
            this.form.reset();
            
            this.showMessage('Thank you for your recommendation! It has been added to the community.', 'success');
        }
        
        displayRecommendations() {
            if (!this.grid) return;
            
            if (this.recommendations.length === 0) {
                this.grid.innerHTML = '<div class="no-recommendations">No recommendations yet. Be the first to share!</div>';
                return;
            }
            
            this.grid.innerHTML = this.recommendations
                .slice(0, 6) // Show only the 6 most recent
                .map(rec => this.createRecommendationCard(rec))
                .join('');
        }
        
        createRecommendationCard(rec) {
            const stars = '⭐'.repeat(parseInt(rec.rating) || 0);
            const genreBadge = rec.genre ? `<span class="recommendation-genre">${rec.genre}</span>` : '';
            const ratingBadge = rec.rating ? `<span class="recommendation-rating">${stars} ${rec.rating}/10</span>` : '';
            
            return `
                <div class="recommendation-card fade-in">
                    <div class="recommendation-header">
                        <div>
                            <div class="recommendation-title">${rec.animeName}</div>
                            <div class="recommendation-meta">
                                ${genreBadge}
                                ${ratingBadge}
                            </div>
                        </div>
                    </div>
                    <div class="recommendation-content">${rec.recommendation}</div>
                    <div class="recommendation-author">— ${rec.username}</div>
                    <div class="recommendation-date">${rec.date}</div>
                </div>
            `;
        }
        
        addSampleRecommendations() {
            if (this.recommendations.length === 0) {
                const sampleRecommendations = [
                    {
                        id: 1,
                        animeName: "Attack on Titan",
                        genre: "Action",
                        rating: "9",
                        recommendation: "A masterpiece of storytelling with incredible character development and plot twists that will keep you on the edge of your seat. The animation is breathtaking and the themes are thought-provoking.",
                        username: "AnimeFan2024",
                        date: "2024-01-15",
                        timestamp: 1705276800000
                    },
                    {
                        id: 2,
                        animeName: "Your Name",
                        genre: "Romance",
                        rating: "10",
                        recommendation: "One of the most beautiful anime films ever made. The animation is stunning, the story is emotional and touching, and the soundtrack is absolutely perfect. A must-watch for any anime fan.",
                        username: "RomanceLover",
                        date: "2024-01-10",
                        timestamp: 1704844800000
                    },
                    {
                        id: 3,
                        animeName: "One Punch Man",
                        genre: "Comedy",
                        rating: "8",
                        recommendation: "Hilarious take on the superhero genre with amazing animation and a unique protagonist. Saitama's journey from being the strongest to finding meaning in his strength is both funny and surprisingly deep.",
                        username: "ComedyKing",
                        date: "2024-01-05",
                        timestamp: 1704412800000
                    }
                ];
                
                this.recommendations = sampleRecommendations;
                this.saveToStorage();
                this.displayRecommendations();
            }
        }
        
        saveToStorage() {
            localStorage.setItem('animeRecommendations', JSON.stringify(this.recommendations));
        }
        
        showMessage(message, type) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}`;
            messageDiv.textContent = message;
            messageDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 2rem;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                animation: slideIn 0.3s ease;
                background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            `;
            
            document.body.appendChild(messageDiv);
            
            setTimeout(() => {
                messageDiv.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(messageDiv);
                }, 300);
            }, 3000);
        }
    }
    
    // Initialize recommendation system when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        new RecommendationSystem();
    });
    
    // Add CSS animations for messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);