/*!
 * Atlantis.js v1.0 - Bootstrap 4 Dashboard (Vanilla JS) - Core Layout & Navigation
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
        this.initScrollbars();
        this.initMenuCollapse();
        this.restoreState();
    }

    initLayout() {
        const sidebar = document.querySelector('.sidebar');
        const body = document.body;
        if (sidebar?.dataset.backgroundColor) {
            document.documentElement.classList.add('sidebar-color');
        }
        if (body.dataset.image) {
            body.style.backgroundImage = `url("${body.dataset.image}")`;
        }
    }

    restoreState() {
        if (this.state.sidebarMinimized) {
            document.querySelector('.wrapper')?.classList.add('sidebar_minimize');
        }
    }

    initSidebar() {
        const toggleBtn = document.querySelector('.toggle-sidebar');
        if (toggleBtn) {
            toggleBtn.onclick = () => {
                const wrapper = document.querySelector('.wrapper');
                const minimized = wrapper.classList.toggle('sidebar_minimize');
                const icon = toggleBtn.querySelector('i');
                if (icon) icon.className = minimized ? 'fas fa-ellipsis-v' : 'fas fa-bars';
                this.state.sidebarMinimized = minimized;
                localStorage.setItem('atlantis_sidebar', minimized ? 'minimized' : 'expanded');
            };
        }

        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.onmouseenter = () => document.querySelector('.wrapper')?.classList.add('sidebar_minimize_hover');
            sidebar.onmouseleave = () => document.querySelector('.wrapper')?.classList.remove('sidebar_minimize_hover');
        }

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
                if (icon) icon.className = isShowing ? 'fas fa-ellipsis-v' : 'fas fa-bars';
            };
        }
    }

    initNavigation() {
        const sidenavToggler = document.querySelector('.sidenav-toggler');
        if (sidenavToggler) {
            sidenavToggler.onclick = () => {
                document.documentElement.classList.toggle('nav_open');
                sidenavToggler.classList.toggle('toggled');
            };
        }

        const topbarToggler = document.querySelector('.topbar-toggler');
        if (topbarToggler) {
            topbarToggler.onclick = () => {
                document.documentElement.classList.toggle('topbar_open');
                topbarToggler.classList.toggle('toggled');
            };
        }

        this.initQuickSidebar();
        this.initPageSidebar();
        this.initDropdowns();
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
        document.querySelector('.close-quick-sidebar')?.addEventListener('click', () => this.closeQuickSidebar());
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
        document.addEventListener('click', (e) => {
            const toggle = e.target.closest('.dropdown-toggle');
            if (toggle) {
                e.preventDefault();
                e.stopPropagation();
                const dropdown = toggle.closest('.dropdown');
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    const isShowing = menu.classList.contains('show');
                    this.closeAllDropdowns();
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
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
        this.state.dropdowns.clear();
    }

    initMenuCollapse() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-toggle="menu-collapse"]');
            if (!trigger) return;
            e.preventDefault();
            const target = trigger.dataset.target || trigger.getAttribute('href');
            const element = document.querySelector(target);
            if (element) {
                const isShown = element.classList.contains('show');
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

    initScrollbars() {
        const selectors = [
            '.sidebar .scrollbar',
            '.main-panel .content-scroll',
            '.messages-scroll',
            '.tasks-scroll',
            '.quick-scroll',
            '.message-notif-scroll',
            '.notif-scroll',
            '.dropdown-user-scroll'
        ];
        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.overflowY = 'auto';
                el.style.scrollbarWidth = 'thin';
            });
        });
    }

    toggleSidebar() {
        document.querySelector('.toggle-sidebar')?.click();
    }

    destroy() {
        this.closeAllDropdowns();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.atlantis = new Atlantis();
    });
} else {
    window.atlantis = new Atlantis();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Atlantis;
}
