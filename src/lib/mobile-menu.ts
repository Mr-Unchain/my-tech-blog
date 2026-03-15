/**
 * Mobile Menu - モバイルメニュー制御モジュール
 * Header.astro のハンバーガーメニューの開閉・アニメーションを管理する
 */

function openMobileMenu(): void {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (mobileMenu && overlay) {
    document.body.classList.add('mobile-menu-open');

    overlay.classList.remove('opacity-0', 'pointer-events-none');
    overlay.classList.add('opacity-100');

    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');

    document.body.style.overflow = 'hidden';

    const menuItems = mobileMenu.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    menuItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(30px) scale(0.95)';
    });

    setTimeout(() => {
      menuItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.transition = 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
          item.style.opacity = '1';
          item.style.transform = 'translateX(0) scale(1)';
        }, index * 100);
      });
    }, 100);
  }
}

function closeMobileMenu(): void {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (mobileMenu && overlay) {
    document.body.classList.remove('mobile-menu-open');

    const menuItems = mobileMenu.querySelectorAll('.menu-item') as NodeListOf<HTMLElement>;
    menuItems.forEach((item) => {
      item.style.transition = '';
      item.style.opacity = '';
      item.style.transform = '';
    });

    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0', 'pointer-events-none');

    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');

    document.body.style.overflow = '';
  }
}

export function initializeMobileMenu(): void {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');

  if (mobileMenuButton) {
    mobileMenuButton.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openMobileMenu();
    };
  }

  if (mobileMenuClose) {
    mobileMenuClose.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeMobileMenu();
    };
  }

  if (overlay) {
    overlay.onclick = () => closeMobileMenu();
  }

  if (mobileMenu) {
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach((link) => {
      link.onclick = () => closeMobileMenu();
    });
  }
}

export function setupMobileMenuGlobalHandlers(): void {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
  });

  let resizeTimeout: ReturnType<typeof setTimeout>;
  function handleOrientationAndResize(): void {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
    const vh = (window.visualViewport?.height ?? window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  function debouncedResize(): void {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(handleOrientationAndResize, 150);
  }

  window.addEventListener('resize', debouncedResize);
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      handleOrientationAndResize();
      window.scrollTo(0, window.scrollY);
    }, 300);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', debouncedResize);
  }

  handleOrientationAndResize();
}
