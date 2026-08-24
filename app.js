/**
 * Louvores IBRR – Application Logic
 * Igreja Batista Reformada em Russas
 */
(function () {
  'use strict';

  // ── DOM References ──────────────────────────────────────────
  const sidebar        = document.getElementById('sidebar');
  const sidebarToggle  = document.getElementById('sidebarToggle');
  const overlay        = document.getElementById('overlay');
  const mainContent    = document.getElementById('mainContent');
  const searchInput    = document.getElementById('searchInput');
  const hymnList       = document.getElementById('hymnList');
  const hymnCount      = document.getElementById('hymnCount');
  const noResults      = document.getElementById('noResults');
  const welcomeScreen  = document.getElementById('welcomeScreen');
  const lyricsArea     = document.getElementById('lyricsArea');
  const lyricsTitle    = document.getElementById('lyricsTitle');
  const lyricsBody     = document.getElementById('lyricsBody');
  const fontIncrease   = document.getElementById('fontIncrease');
  const fontDecrease   = document.getElementById('fontDecrease');
  const fontReset      = document.getElementById('fontReset');
  const header         = document.getElementById('header');
  const logoLink       = document.getElementById('logoLink');

  // ── State ───────────────────────────────────────────────────
  const MOBILE_BREAKPOINT = 768;
  const DEFAULT_FONT_SIZE = 1.125;   // rem
  const FONT_STEP         = 0.125;   // rem
  const MIN_FONT_SIZE     = 0.75;
  const MAX_FONT_SIZE     = 2.5;

  let currentFontSize   = DEFAULT_FONT_SIZE;
  let currentHymnIndex  = -1;
  let isMobile          = window.innerWidth <= MOBILE_BREAKPOINT;

  // ── Initialise ──────────────────────────────────────────────
  function init() {
    buildHymnList();
    bindEvents();
    updateSidebarState();
    applyFontSize();
  }

  // ── Build the sidebar hymn list ─────────────────────────────
  function buildHymnList() {
    if (typeof LOUVORES_DATA === 'undefined' || !LOUVORES_DATA.length) {
      hymnCount.textContent = 'Nenhum louvor disponível';
      return;
    }

    hymnCount.textContent = `${LOUVORES_DATA.length} louvores`;
    let currentLetter = '';
    const fragment = document.createDocumentFragment();

    LOUVORES_DATA.forEach(function (hymn, index) {
      // Get first meaningful letter (skip numbers, special chars)
      const firstChar = getFirstLetter(hymn.title);

      // Insert letter divider
      if (firstChar !== currentLetter) {
        currentLetter = firstChar;
        const divider = document.createElement('div');
        divider.className = 'sidebar__letter';
        divider.textContent = currentLetter;
        divider.setAttribute('data-letter', currentLetter);
        fragment.appendChild(divider);
      }

      // Hymn button
      const btn = document.createElement('button');
      btn.className = 'sidebar__item';
      btn.textContent = hymn.title;
      btn.setAttribute('role', 'listitem');
      btn.setAttribute('data-index', index);
      btn.addEventListener('click', function () {
        selectHymn(index);
      });
      fragment.appendChild(btn);
    });

    hymnList.appendChild(fragment);
  }

  /**
   * Return the first alphabetic letter of a title (uppercase).
   * Groups numbers under '#' and accented chars with their base.
   */
  function getFirstLetter(title) {
    const cleaned = title.trim().toUpperCase();
    for (let i = 0; i < cleaned.length; i++) {
      const ch = cleaned[i];
      if (/[A-ZÁÀÂÃÉÊÍÓÔÕÚÜ]/.test(ch)) {
        // Normalise accented characters → base letter
        return ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      }
      if (/[0-9]/.test(ch)) return '#';
    }
    return '#';
  }

  // ── Select & display a hymn ─────────────────────────────────
  function selectHymn(index) {
    if (index < 0 || index >= LOUVORES_DATA.length) return;

    currentHymnIndex = index;
    const hymn = LOUVORES_DATA[index];

    // Update sidebar active state
    const items = hymnList.querySelectorAll('.sidebar__item');
    items.forEach(function (item) {
      item.classList.toggle('active', parseInt(item.dataset.index) === index);
    });

    // Find the refrão content (first section that is marked as refrão)
    let refraoContent = null;
    for (let i = 0; i < hymn.sections.length; i++) {
      if (hymn.sections[i].isRefrao && !hymn.sections[i].isRef) {
        refraoContent = hymn.sections[i];
        break;
      }
    }

    // Build lyrics HTML
    lyricsTitle.textContent = hymn.title;
    lyricsBody.innerHTML = '';

    hymn.sections.forEach(function (section) {
      const div = document.createElement('div');
      div.className = 'lyrics__section';

      if (section.isRef) {
        // "[REFRÃO]" reference – show the actual refrão text if available
        div.classList.add('lyrics__section--refrao');
        if (refraoContent) {
          div.innerHTML = formatLyricText(refraoContent.text);
        } else {
          div.classList.remove('lyrics__section--refrao');
          div.classList.add('lyrics__section--ref');
          div.textContent = section.text;
        }
      } else if (section.isInstruction) {
        div.classList.add('lyrics__section--instruction');
        div.textContent = section.text;
      } else if (section.isRefrao) {
        div.classList.add('lyrics__section--refrao');
        div.innerHTML = formatLyricText(section.text);
      } else {
        div.innerHTML = formatLyricText(section.text);
      }

      lyricsBody.appendChild(div);
    });

    // Show lyrics, hide welcome
    welcomeScreen.style.display = 'none';
    lyricsArea.classList.add('visible');

    // Re-trigger animation
    lyricsArea.style.animation = 'none';
    void lyricsArea.offsetHeight; // reflow
    lyricsArea.style.animation = '';

    // On mobile, close sidebar after selection
    if (isMobile) {
      closeSidebar();
    }

    // Scroll to top of lyrics
    mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Format lyric text: replace \n with <br> line breaks
   */
  function formatLyricText(text) {
    return text
      .split('\n')
      .map(function (line) {
        return '<span class="lyrics__line">' + escapeHtml(line) + '</span>';
      })
      .join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ── Sidebar toggle ─────────────────────────────────────────
  function toggleSidebar() {
    if (isMobile) {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('visible', sidebar.classList.contains('open'));
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    } else {
      sidebar.classList.toggle('collapsed');
      mainContent.classList.toggle('expanded', sidebar.classList.contains('collapsed'));
    }
  }

  function closeSidebar() {
    if (isMobile) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    }
  }

  function updateSidebarState() {
    isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
    if (isMobile) {
      sidebar.classList.remove('collapsed');
      sidebar.classList.remove('open');
      mainContent.classList.remove('expanded');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
    } else {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
      document.body.style.overflow = '';
      // Keep collapsed state if it was set
    }
  }

  // ── Search / Filter ────────────────────────────────────────
  function handleSearch() {
    const query = normalizeText(searchInput.value.trim());
    const items = hymnList.querySelectorAll('.sidebar__item');
    const letters = hymnList.querySelectorAll('.sidebar__letter');
    let visibleCount = 0;
    const visibleLetters = new Set();

    items.forEach(function (item) {
      const title = normalizeText(item.textContent);
      const match = !query || title.includes(query);
      item.classList.toggle('sidebar__item--hidden', !match);
      if (match) {
        visibleCount++;
        visibleLetters.add(getFirstLetter(item.textContent));
      }
    });

    // Show/hide letter dividers based on visible items
    letters.forEach(function (letter) {
      const l = letter.getAttribute('data-letter');
      letter.style.display = visibleLetters.has(l) ? '' : 'none';
    });

    // Update count & no-results message
    if (query) {
      hymnCount.textContent = visibleCount + ' resultado' + (visibleCount !== 1 ? 's' : '');
    } else {
      hymnCount.textContent = LOUVORES_DATA.length + ' louvores';
    }

    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
  }

  function normalizeText(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '');
  }

  // ── Font size controls ─────────────────────────────────────
  function changeFontSize(delta) {
    currentFontSize = Math.min(MAX_FONT_SIZE, Math.max(MIN_FONT_SIZE, currentFontSize + delta));
    applyFontSize();
  }

  function resetFontSize() {
    currentFontSize = DEFAULT_FONT_SIZE;
    applyFontSize();
  }

  function applyFontSize() {
    document.documentElement.style.setProperty('--lyrics-font-size', currentFontSize + 'rem');
  }

  // ── Event bindings ─────────────────────────────────────────
  function bindEvents() {
    // Sidebar toggle
    sidebarToggle.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', closeSidebar);

    // Logo click → go home
    logoLink.addEventListener('click', function (e) {
      e.preventDefault();
      currentHymnIndex = -1;
      welcomeScreen.style.display = '';
      lyricsArea.classList.remove('visible');
      // Remove active state from sidebar items
      hymnList.querySelectorAll('.sidebar__item.active').forEach(function (item) {
        item.classList.remove('active');
      });
    });

    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 150));

    // Keyboard shortcut: Ctrl+K or / to focus search
    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT')) {
        e.preventDefault();
        searchInput.focus();
        if (isMobile && !sidebar.classList.contains('open')) {
          toggleSidebar();
        }
      }
      // Escape to close search/sidebar
      if (e.key === 'Escape') {
        if (isMobile && sidebar.classList.contains('open')) {
          closeSidebar();
        }
        if (document.activeElement === searchInput) {
          searchInput.blur();
        }
      }
    });

    // Font controls
    fontIncrease.addEventListener('click', function () { changeFontSize(FONT_STEP); });
    fontDecrease.addEventListener('click', function () { changeFontSize(-FONT_STEP); });
    fontReset.addEventListener('click', resetFontSize);

    // Window resize
    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSidebarState, 150);
    });

    // Header scroll shadow
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // ── Utilities ──────────────────────────────────────────────
  function debounce(fn, delay) {
    let timer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(context, args);
      }, delay);
    };
  }

  // ── Boot ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
