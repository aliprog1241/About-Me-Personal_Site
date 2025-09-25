let currentPage = 'home';

        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
                    link.classList.add('active');
                }
            });
            
            currentPage = pageId;
            
            // Move footer to the active page
            const footer = document.getElementById('footer');
            const activePage = document.getElementById(pageId);
            activePage.appendChild(footer);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Initialize footer position
        window.addEventListener('DOMContentLoaded', () => {
            const footer = document.getElementById('footer');
            const homePage = document.getElementById('home');
            homePage.appendChild(footer);
        });

        // Add interactive parallax effect to background shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xPos = (x - 0.5) * speed * 20;
                const yPos = (y - 0.5) * speed * 20;
                shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });

        // Add scroll-based animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.bg-shapes');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        // Add click ripple effect to glass elements
        document.querySelectorAll('.glass').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Form submission handling
// Form submission handling (AJAX with fallback)
(function () {
  const form = document.querySelector('#contact-form'); // فقط همین فرم
  if (!form) return;

  function showToast(msg, ok = true, t = 3000) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
      background: ${ok ? 'rgba(40,167,69,0.9)' : 'rgba(192,57,43,0.9)'};
      color: #fff; padding: 12px 18px; border-radius: 10px; z-index: 10000;
      font-family: inherit;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), t);
  }

  // گرفتن CSRF
  function getCsrf() {
    const cookie = document.cookie.split('; ').find(r => r.startsWith('csrftoken='))?.split('=')[1];
    if (cookie) return cookie;
    return form.querySelector('input[name=csrfmiddlewaretoken]')?.value || '';
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault(); // ارسال پیش‌فرض رو می‌گیریم، چون AJAX می‌فرستیم

    const csrf = getCsrf();
    if (!csrf) {
      // اگر CSRF پیدا نشد، برگرد به ارسال عادی
      form.submit();
      return;
    }

    showToast('Sending...', true, 1500);

    try {
      const res = await fetch(form.getAttribute('action') || '/contact/', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'X-CSRFToken': csrf,
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new FormData(form),
      });

      const ct = res.headers.get('content-type') || '';
      const isJson = ct.includes('application/json');
      const data = isJson ? await res.json().catch(() => null) : null;

      if (!res.ok || (isJson && data && data.ok === false)) {
        const errMsg = data?.errors ? JSON.stringify(data.errors) : `HTTP ${res.status}`;
        showToast('Submit error: ' + errMsg, false, 4000);
        // برگرد به ارسال عادی برای نمایش خطا
        form.submit();
        return;
      }

      // موفقیت
      showToast("Message sent successfully! We'll get back to you soon.");
      form.reset();
    } catch (err) {
      showToast('Network error, submitting normally...', false, 2500);
      form.submit();
    }
  });
})();


        // Add fade in animation
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(fadeStyle);