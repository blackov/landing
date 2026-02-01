function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('hidden');
}
 
document.querySelectorAll('#mobileMenu a').forEach(link => {
    link.addEventListener('click', () => {
        document.getElementById('mobileMenu').classList.add('hidden');
    });
});

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 30);
}

function startCountersAnimation() {
    const statsSection = document.getElementById('stats');
    const counters = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                counters.forEach(counter => {
                    const value = parseInt(counter.dataset.count);
                    animateCounter(counter, value);
                });
                entry.target.classList.add('animated');
            }
        });
    });
    
    observer.observe(statsSection);
}


document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = this.querySelector('input[placeholder="ФИО контактного лица"]').value;
    const email = this.querySelector('input[placeholder="Email компании"]').value;
    const phone = this.querySelector('input[placeholder="Номер телефона"]').value;
    const route = this.querySelectorAll('select')[0].value;
    const guests = this.querySelectorAll('select')[1].value;
    const date = this.querySelector('input[type="date"]').value;

    if (name && email && phone && route && guests && date) {

        fetch('api/send-form.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                route: getRouteName(route),
                guests: guests,
                date: formatDate(date)
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showSuccessModal(`Спасибо за заявку, ${name}! Менеджер свяжется с вами в ближайшее время.`);
                document.getElementById('bookingForm').reset();
            } else {
                alert('Ошибка при отправке. Пожалуйста, свяжитесь с нами напрямую.');
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Ошибка при отправке. Пожалуйста, попробуйте еще раз.');
        });
    } else {
        alert('Пожалуйста, заполните все поля формы');
    }
});


function getRouteName(value) {
    const routes = {
        'field1': 'Месторождение №1 (180 км)',
        'field2': 'Месторождение №2 (220 км)',
        'field3': 'Месторождение №3 (150 км)',
        'other': 'Другое направление'
    };
    return routes[value] || value;
}


function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString('ru-RU', options);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('nav a[href^="#"]').forEach(link => {
        link.classList.remove('text-blue-600', 'font-semibold');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('text-blue-600', 'font-semibold');
        }
    });
});


document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
        console.log('Клик по галерее');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    startCountersAnimation();
    
    const routeCards = document.querySelectorAll('.route-card');
    routeCards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
});


const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

function openGalleryImage(title) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-2xl max-h-96 overflow-hidden relative">
            <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl">
                ×
            </button>
            <h3 class="text-2xl font-bold mb-4">${title}</h3>
            <div class="bg-gray-300 h-80 flex items-center justify-center rounded">
                <i class="fas fa-image text-gray-500 text-6xl"></i>
            </div>
        </div>
    `;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
}

document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const title = item.querySelector('.text-white h5')?.textContent || 'Фото из поездки';
        openGalleryImage(title);
    });
});

function showSuccessModal(message) {
    const modal = document.getElementById('successModal');
    const messageEl = document.getElementById('successMessage');
    messageEl.textContent = message;
    modal.classList.add('show');
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.classList.remove('show');
}


document.getElementById('successModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'successModal') {
        closeSuccessModal();
    }
});

function toggleFaq(button) {
    const answer = button.nextElementSibling;
    const isOpen = answer.classList.contains('show');
    
    document.querySelectorAll('.faq-answer.show').forEach(item => {
        if (item !== answer) {
            item.classList.remove('show');
            item.previousElementSibling.classList.remove('active');
        }
    });
    
    if (isOpen) {
        answer.classList.remove('show');
        button.classList.remove('active');
    } else {
        answer.classList.add('show');
        button.classList.add('active');
    }
}

function initializeScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-animate]');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                const animation = element.getAttribute('data-animate');
                if (!element.classList.contains('animated')) {
                    element.classList.add(animation, 'animated');
                }
            }
        });
    };
    
    animateOnScroll();
    
    window.addEventListener('scroll', animateOnScroll);
}
