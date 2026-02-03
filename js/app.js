/**
 * Vimtra Custom Tools - Core Application Logic
 */

// Company configuration
const COMPANIES = {
    vimtra: {
        name: 'Vimtra Ventures',
        logo: 'logos/Vimtra Ventures.png',
        theme: 'theme-vimtra'
    },
    urpan: {
        name: 'Urpan Technologies',
        logo: 'logos/Urpan Technologies.png',
        theme: 'theme-urpan'
    },
    tekcog: {
        name: 'Tekcog',
        logo: 'logos/tekcog.png',
        theme: 'theme-tekcog'
    }
};

// Get base path for logos (handles subfolders)
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/tools/')) {
        return '../';
    }
    return '';
}

// Initialize theme from localStorage
function initTheme() {
    const savedCompany = localStorage.getItem('selectedCompany') || 'vimtra';
    setCompany(savedCompany);
    
    // Set dropdown value
    const select = document.getElementById('companySelect');
    if (select) {
        select.value = savedCompany;
    }
}

// Set company theme and logo
function setCompany(companyKey) {
    const company = COMPANIES[companyKey];
    if (!company) return;
    
    const basePath = getBasePath();
    
    // Update body theme class
    document.body.className = company.theme;
    
    // Update header logo
    const headerLogo = document.getElementById('headerLogo');
    if (headerLogo) {
        headerLogo.src = basePath + company.logo;
        headerLogo.alt = company.name + ' Logo';
    }
    
    // Update email preview logo if exists
    const emailLogo = document.getElementById('emailLogo');
    if (emailLogo) {
        emailLogo.src = basePath + company.logo;
    }
    
    // Update company name displays
    const companyNameElements = document.querySelectorAll('.company-name-display');
    companyNameElements.forEach(el => {
        el.textContent = company.name;
    });
    
    // Save to localStorage
    localStorage.setItem('selectedCompany', companyKey);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('companyChanged', { 
        detail: { company: companyKey, data: company } 
    }));
}

// Get current company
function getCurrentCompany() {
    const key = localStorage.getItem('selectedCompany') || 'vimtra';
    return { key, ...COMPANIES[key] };
}

// Company selector change handler
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    
    const select = document.getElementById('companySelect');
    if (select) {
        select.addEventListener('change', (e) => {
            setCompany(e.target.value);
        });
    }
    
    // Add fade-in animation delays
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// Utility: Copy text to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        return true;
    }
}

// Utility: Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
    `;
    toast.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            ${type === 'success' 
                ? '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
                : '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'}
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Export for use in other scripts
window.VimtraTools = {
    COMPANIES,
    setCompany,
    getCurrentCompany,
    copyToClipboard,
    showToast,
    getBasePath
};
