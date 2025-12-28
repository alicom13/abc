/*!
 * Atlantis.js v2.0 - Bootstrap 4 Dashboard (Vanilla JS)
 * Replacement for jQuery-based atlantis.min.js
 * Bootstrap 4 CSS only - No jQuery required
 * (c) 2025 - License: MIT
 */

class Atlantis {
    constructor(options = {}) {
        this.config = {
            sidebarBg: 'dark',
            animationSpeed: 300,
            ...options
        };
        
        this.state = {
            sidebarMinimized: localStorage.getItem('atlantis_sidebar') === 'minimized',
            dropdowns: new Set()
        };
        
        this.init();
    }
    
    init() {
        this.initLayout();
        this.initSidebar();
        this.initNavigation();
        this.initComponents();
        this.initForms();
        this.restoreState();
    }
    
    // ==================== LAYOUT ====================
    
    initLayout() {
        const sidebar = document.querySelector('.sidebar');
        const body = document.body;
        
        // Sidebar background color
        if (sidebar?.dataset.backgroundColor) {
            document.documentElement.classList.add('sidebar-color');
        }
        
        // Body background image
        if (body.dataset.image) {
            body.style.backgroundImage = `url("${body.dataset.image}")`;
        }
    }
    
    restoreState() {
        if (this.state.sidebarMinimized) {
            document.querySelector('.wrapper')?.classList.add('sidebar_minimize');
        }
    }
    
    // ==================== SIDEBAR ====================
    
    initSidebar() {
        // Toggle sidebar
        const toggleBtn = document.querySelector('.toggle-sidebar');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                const wrapper = document.querySelector('.wrapper');
                const minimized = wrapper.classList.toggle('sidebar_minimize');
                
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.className = minimized ? 'fas fa-ellipsis-v' : 'fas fa-bars';
                }
                
                this.state.sidebarMinimized = minimized;
                localStorage.setItem('atlantis_sidebar', minimized ? 'minimized' : 'expanded');
            };
        }
        
        // Hover effect
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.onmouseenter = () => {
                document.querySelector('.wrapper')?.classList.add('sidebar_minimize_hover');
            };
            sidebar.onmouseleave = () => {
                document.querySelector('.wrapper')?.classList.remove('sidebar_minimize_hover');
            };
        }
        
        // Overlay sidebar (mobile)
        const overlayToggler = document.querySelector('.sidenav-overlay-toggler');
        if (overlayToggler) {
            const wrapper = document.querySelector('.wrapper');
            
            if (wrapper.classList.contains('is-show')) {
                overlayToggler.classList.add('toggled');
                const icon = overlayToggler.querySelector('i');
                if (icon) icon.className = 'fas fa-ellipsis-v';
            }
            
            overlayToggler.onclick = () => {
                const isShowing = wrapper.classList.toggle('is-show');
                overlayToggler.classList.toggle('toggled');
                
                const icon = overlayToggler.querySelector('i');
                if (icon) {
                    icon.className = isShowing ? 'fas fa-ellipsis-v' : 'fas fa-bars';
                }
            };
        }
    }
    
    // ==================== NAVIGATION ====================
    
    initNavigation() {
        // Mobile menu
        const sidenavToggler = document.querySelector('.sidenav-toggler');
        if (sidenavToggler) {
            sidenavToggler.onclick = () => {
                document.documentElement.classList.toggle('nav_open');
                sidenavToggler.classList.toggle('toggled');
            };
        }
        
        // Topbar
        const topbarToggler = document.querySelector('.topbar-toggler');
        if (topbarToggler) {
            topbarToggler.onclick = () => {
                document.documentElement.classList.toggle('topbar_open');
                topbarToggler.classList.toggle('toggled');
            };
        }
        
        // Quick sidebar
        this.initQuickSidebar();
        
        // Page sidebar
        this.initPageSidebar();
        
        // Submenu collapse
        document.querySelectorAll('.nav-item > a').forEach(link => {
            link.onclick = function(e) {
                const parent = this.closest('.nav-item');
                const collapse = parent.querySelector('.collapse');
                
                if (collapse) {
                    parent.classList.toggle('submenu', !collapse.classList.contains('show'));
                }
            };
        });
        
        // Dropdowns
        this.initDropdowns();
        
        // Chat
        this.initChat();
    }
    
    initQuickSidebar() {
        const toggler = document.querySelector('.quick-sidebar-toggler');
        if (!toggler) return;
        
        toggler.onclick = () => {
            const isOpen = document.documentElement.classList.toggle('quick_sidebar_open');
            toggler.classList.toggle('toggled');
            
            if (isOpen) {
                const overlay = document.createElement('div');
                overlay.className = 'quick-sidebar-overlay';
                overlay.onclick = () => this.closeQuickSidebar();
                document.body.appendChild(overlay);
            } else {
                document.querySelector('.quick-sidebar-overlay')?.remove();
            }
        };
        
        document.querySelector('.close-quick-sidebar')?.addEventListener('click', () => {
            this.closeQuickSidebar();
        });
    }
    
    closeQuickSidebar() {
        document.documentElement.classList.remove('quick_sidebar_open');
        document.querySelector('.quick-sidebar-toggler')?.classList.remove('toggled');
        document.querySelector('.quick-sidebar-overlay')?.remove();
    }
    
    initPageSidebar() {
        const toggler = document.querySelector('.page-sidebar-toggler');
        if (!toggler) return;
        
        toggler.onclick = () => {
            document.documentElement.classList.toggle('pagesidebar_open');
            toggler.classList.toggle('toggled');
        };
        
        document.querySelector('.page-sidebar .back')?.addEventListener('click', () => {
            document.documentElement.classList.remove('pagesidebar_open');
            toggler.classList.remove('toggled');
        });
    }
    
    initDropdowns() {
        // Dropdown toggle
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.dropdown-toggle');
            
            if (toggle) {
                e.preventDefault();
                e.stopPropagation();
                
                const dropdown = toggle.closest('.dropdown');
                const menu = dropdown.querySelector('.dropdown-menu');
                
                if (menu) {
                    const isShowing = menu.classList.contains('show');
                    
                    // Close all dropdowns
                    this.closeAllDropdowns();
                    
                    // Toggle current
                    if (!isShowing) {
                        menu.classList.add('show');
                        this.state.dropdowns.add(menu);
                    }
                }
            } else if (!e.target.closest('.dropdown-menu')) {
                this.closeAllDropdowns();
            }
        });
    }
    
    closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
        this.state.dropdowns.clear();
    }
    
    initChat() {
        document.querySelectorAll('.messages-contact .user a').forEach(link => {
            link.onclick = () => {
                document.querySelector('.tab-chat')?.classList.add('show-chat');
            };
        });
        
        document.querySelectorAll('.messages-wrapper .return').forEach(btn => {
            btn.onclick = () => {
                document.querySelector('.tab-chat')?.classList.remove('show-chat');
            };
        });
    }
    
    // ==================== COMPONENTS ====================
    
    initComponents() {
        this.initModals();
        this.initTooltips();
        this.initCollapse();
        this.initTabs();
        this.initScrollbars();
        this.initCards();
    }
    
    initModals() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-toggle="modal"]');
            
            if (trigger) {
                e.preventDefault();
                const target = trigger.dataset.target || trigger.getAttribute('href');
                this.showModal(target);
            }
            
            const dismiss = e.target.closest('[data-dismiss="modal"]');
            if (dismiss) {
                const modal = dismiss.closest('.modal');
                if (modal) this.hideModal(modal);
            }
            
            if (e.target.classList.contains('modal')) {
                this.hideModal(e.target);
            }
        });
        
        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.modal.show').forEach(modal => {
                    this.hideModal(modal);
                });
            }
        });
    }
    
    showModal(selector) {
        const modal = document.querySelector(selector);
        if (!modal) return;
        
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        
        // Backdrop
        if (!document.querySelector('.modal-backdrop')) {
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            document.body.appendChild(backdrop);
        }
    }
    
    hideModal(modal) {
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();
    }
    
    initTooltips() {
        document.querySelectorAll('[data-toggle="tooltip"]').forEach(el => {
            el.addEventListener('mouseenter', () => {
                const text = el.dataset.originalTitle || el.title;
                if (!text) return;
                
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip bs-tooltip-top show';
                tooltip.innerHTML = `
                    <div class="arrow"></div>
                    <div class="tooltip-inner">${text}</div>
                `;
                tooltip.id = 'atlantis-tooltip';
                
                document.body.appendChild(tooltip);
                
                const rect = el.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
                tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
                tooltip.style.zIndex = '9999';
            });
            
            el.addEventListener('mouseleave', () => {
                document.getElementById('atlantis-tooltip')?.remove();
            });
        });
    }
    
    initCollapse() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-toggle="collapse"]');
            if (!trigger) return;
            
            e.preventDefault();
            const target = trigger.dataset.target || trigger.getAttribute('href');
            const element = document.querySelector(target);
            
            if (element) {
                const isShown = element.classList.contains('show');
                
                // Accordion behavior
                const parent = element.closest('.accordion');
                if (parent) {
                    parent.querySelectorAll('.collapse.show').forEach(open => {
                        if (open !== element) open.classList.remove('show');
                    });
                }
                
                element.classList.toggle('show', !isShown);
                trigger.setAttribute('aria-expanded', !isShown);
            }
        });
    }
    
    initTabs() {
        document.querySelectorAll('.nav-tabs .nav-link, .nav-pills .nav-link').forEach(tab => {
            tab.onclick = (e) => {
                e.preventDefault();
                
                const target = tab.getAttribute('href');
                const pane = document.querySelector(target);
                
                if (pane) {
                    // Deactivate all
                    tab.closest('.nav').querySelectorAll('.nav-link').forEach(t => {
                        t.classList.remove('active');
                    });
                    
                    const tabContent = pane.closest('.tab-content');
                    if (tabContent) {
                        tabContent.querySelectorAll('.tab-pane').forEach(p => {
                            p.classList.remove('show', 'active');
                        });
                    }
                    
                    // Activate current
                    tab.classList.add('active');
                    pane.classList.add('show', 'active');
                }
            };
        });
    }
    
    initScrollbars() {
        const selectors = [
            '.sidebar .scrollbar',
            '.main-panel .content-scroll',
            '.messages-scroll',
            '.tasks-scroll',
            '.quick-scroll',
            '.message-notif-scroll',
            '.notif-scroll',
            '.quick-actions-scroll',
            '.dropdown-user-scroll'
        ];
        
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.overflowY = 'auto';
                el.style.scrollbarWidth = 'thin';
            });
        });
    }
    
    initCards() {
        document.querySelectorAll('.btn-refresh-card').forEach(btn => {
            btn.onclick = () => {
                const card = btn.closest('.card');
                if (card) {
                    card.classList.add('is-loading');
                    setTimeout(() => card.classList.remove('is-loading'), 3000);
                }
            };
        });
    }
    
    // ==================== FORMS ====================
    
    initForms() {
        // Form focus effects
        document.querySelectorAll('.form-group-default .form-control').forEach(input => {
            input.onfocus = () => input.parentElement.classList.add('active');
            input.onblur = () => input.parentElement.classList.remove('active');
        });
        
        // Nav search focus
        document.querySelectorAll('.nav-search .input-group > input').forEach(input => {
            input.onfocus = () => input.parentElement.classList.add('focus');
            input.onblur = () => input.parentElement.classList.remove('focus');
        });
        
        // File preview
        document.querySelectorAll('.input-file-image input[type="file"]').forEach(input => {
            input.onchange = function() {
                if (this.files?.[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const preview = input.closest('.input-file-image').querySelector('.img-upload-preview');
                        if (preview) preview.src = e.target.result;
                    };
                    reader.readAsDataURL(this.files[0]);
                }
            };
        });
        
        // Password toggle
        document.querySelectorAll('.show-password').forEach(btn => {
            btn.onclick = function() {
                const input = this.closest('.input-group').querySelector('input');
                const icon = this.querySelector('i');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    if (icon) icon.className = 'fas fa-eye-slash';
                } else {
                    input.type = 'password';
                    if (icon) icon.className = 'fas fa-eye';
                }
            };
        });
        
        // Floating labels
        document.querySelectorAll('.form-floating-label .form-control').forEach(input => {
            input.onkeyup = function() {
                this.classList.toggle('filled', this.value !== '');
            };
            
            if (input.value) input.classList.add('filled');
        });
        
        // Select all checkbox
        document.querySelectorAll('[data-select="checkbox"]').forEach(checkbox => {
            checkbox.onchange = function() {
                const target = this.dataset.target;
                document.querySelectorAll(target).forEach(cb => {
                    cb.checked = this.checked;
                });
            };
        });
        
        // Login/Signup toggle
        this.initLoginToggle();
    }
    
    initLoginToggle() {
        const showSignup = document.getElementById('show-signup');
        const showSignin = document.getElementById('show-signin');
        
        if (!showSignup || !showSignin) return;
        
        const containerSignIn = document.querySelector('.container-login');
        const containerSignUp = document.querySelector('.container-signup');
        
        let showingSignIn = true;
        
        const toggle = () => {
            containerSignIn.style.display = showingSignIn ? 'block' : 'none';
            containerSignUp.style.display = showingSignIn ? 'none' : 'block';
        };
        
        showSignup.onclick = (e) => {
            e.preventDefault();
            showingSignIn = false;
            toggle();
        };
        
        showSignin.onclick = (e) => {
            e.preventDefault();
            showingSignIn = true;
            toggle();
        };
        
        toggle();
    }
    
    // ==================== PUBLIC API ====================
    
    toggleSidebar() {
        document.querySelector('.toggle-sidebar')?.click();
    }
    
    refreshCard(card) {
        if (typeof card === 'string') card = document.querySelector(card);
        if (!card) return;
        
        card.classList.add('is-loading');
        setTimeout(() => card.classList.remove('is-loading'), 3000);
    }
    
    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} atlantis-notification`;
        notification.textContent = message;
        notification.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;min-width:250px;animation:slideIn .3s';
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut .3s';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    destroy() {
        this.closeAllDropdowns();
        document.querySelectorAll('.modal.show').forEach(modal => this.hideModal(modal));
        document.getElementById('atlantis-tooltip')?.remove();
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.atlantis = new Atlantis();
    });
} else {
    window.atlantis = new Atlantis();
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Atlantis;
}
