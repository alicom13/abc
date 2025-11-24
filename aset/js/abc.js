
/**
 * Custom Sidebar Functionality for Blesta + Atlantis Integration
 */

$(document).ready(function() {
    
    // Auto expand active submenus
    function initSidebarMenus() {
        // Expand sidebar menus that have active children
        $('.nav-item.active').each(function() {
            var $this = $(this);
            
            // If this is a submenu item, expand its parent
            var $parentCollapse = $this.closest('.nav-collapse');
            if ($parentCollapse.length) {
                var $parentLink = $parentCollapse.prev('a[data-toggle="collapse"]');
                if ($parentLink.length) {
                    var collapseId = $parentLink.attr('href');
                    $(collapseId).addClass('show');
                    $parentLink.removeClass('collapsed').attr('aria-expanded', 'true');
                    
                    // Also mark the parent as active
                    $parentLink.closest('.nav-item').addClass('active');
                }
            }
        });
        
        // Expand user collapse if any user menu item is active
        if ($('#userCollapse .nav li a.active').length) {
            $('#userCollapse').addClass('show');
        }
    }
    
    // Language switcher functionality
    function initLanguageSwitcher() {
        // Topbar language switcher
        $('.language_code').click(function(e) {
            e.preventDefault();
            var languageCode = $(this).attr('language_code');
            $('#language_code').val(languageCode);
            $('#language_selector').submit();
        });
        
        // Sidebar language selector (if exists)
        $('#sidebar_language_switcher').change(function() {
            $('#language_code').val($(this).val());
            $('#language_selector').submit();
        });
    }
    
    // Mobile sidebar toggle
    function initMobileSidebar() {
        $('.toggle-sidebar').click(function() {
            $('.sidebar').toggleClass('sidebar-mini');
            $('.main-panel').toggleClass('mini-sidebar');
        });
        
        // Close sidebar when clicking on mobile
        $(document).on('click', function(e) {
            if ($(window).width() < 992) {
                if (!$(e.target).closest('.sidebar').length && !$(e.target).closest('.toggle-sidebar').length) {
                    $('.sidebar').removeClass('sidebar-mini');
                    $('.main-panel').removeClass('mini-sidebar');
                }
            }
        });
    }
    
    // Active state management for navigation
    function initActiveStates() {
        // Add active class to clicked nav items
        $('.nav-primary .nav-item:not(.submenu) > a').click(function() {
            $('.nav-primary .nav-item').removeClass('active');
            $(this).closest('.nav-item').addClass('active');
        });
        
        // Handle submenu clicks without closing the collapse
        $('.nav-collapse a').click(function(e) {
            $('.nav-collapse li').removeClass('active');
            $(this).closest('li').addClass('active');
            // Don't stop propagation to allow normal navigation
        });
    }
    
    // Quick actions enhancement
    function initQuickActions() {
        // Add hover effects to quick actions
        $('.quick-actions-item').hover(
            function() {
                $(this).css('transform', 'translateY(-2px)');
            },
            function() {
                $(this).css('transform', 'translateY(0)');
            }
        );
    }
    
    // Responsive adjustments
    function initResponsive() {
        function handleResize() {
            if ($(window).width() > 991) {
                $('.sidebar').removeClass('sidebar-mini');
                $('.main-panel').removeClass('mini-sidebar');
            }
        }
        
        $(window).resize(handleResize);
        handleResize(); // Initial call
    }
    
    // Global modal enhancements
    function initGlobalModal() {
        // Ensure modal backdrop issues are handled
        $('#global_modal').on('show.bs.modal', function() {
            $('body').addClass('modal-open');
        });
        
        $('#global_modal').on('hidden.bs.modal', function() {
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        });
    }
    
    // Initialize all functionality
    function init() {
        initSidebarMenus();
        initLanguageSwitcher();
        initMobileSidebar();
        initActiveStates();
        initQuickActions();
        initResponsive();
        initGlobalModal();
        
        console.log('Blesta Atlantis Sidebar initialized');
    }
    
    // Wait for Atlantis to load
    if (typeof $.fn.atlantis !== 'undefined') {
        init();
    } else {
        // Fallback if Atlantis takes time to load
        setTimeout(init, 100);
    }
    
    // Re-initialize when AJAX content loads (for Blesta compatibility)
    $(document).ajaxComplete(function() {
        setTimeout(init, 50);
    });
});

// Blesta specific compatibility
if (typeof History !== 'undefined') {
    History.Adapter.bind(window, 'statechange', function() {
        setTimeout(function() {
            $('.nav-primary .nav-item').removeClass('active');
            $('.nav-item.active').each(function() {
                var $this = $(this);
                var $parentCollapse = $this.closest('.nav-collapse');
                if ($parentCollapse.length) {
                    var $parentLink = $parentCollapse.prev('a[data-toggle="collapse"]');
                    if ($parentLink.length) {
                        var collapseId = $parentLink.attr('href');
                        $(collapseId).addClass('show');
                        $parentLink.removeClass('collapsed').attr('aria-expanded', 'true');
                    }
                }
            });
        }, 100);
    });
}
