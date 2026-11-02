// API endpoint
const API_URL = '/users';

// Grid of background colors for user avatars (Tailwind classes)
const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 
  'bg-red-500', 'bg-pink-500', 'bg-teal-500', 'bg-purple-500'
];

// App State
let users = [];
let editingUserId = null;
let activeDeleteCallback = null;

// DOM Elements
const userForm = document.getElementById('user-form');
const userIdInput = document.getElementById('user-id');
const userNameInput = document.getElementById('user-name');
const userEmailInput = document.getElementById('user-email');
const userUsernameInput = document.getElementById('user-username');
const userPhoneInput = document.getElementById('user-phone');
const userWebsiteInput = document.getElementById('user-website');

const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

const usersGrid = document.getElementById('users-grid');
const userCountBadge = document.getElementById('user-count');
const searchInput = document.getElementById('search-input');
const emptyState = document.getElementById('empty-state');
const toastContainer = document.getElementById('toast-container');
const formTitle = document.getElementById('form-title-h2');
const formSubtitle = document.getElementById('form-subtitle');

// Custom Modal Elements
const confirmModal = document.getElementById('confirm-modal');
const modalConfirmBtn = document.getElementById('modal-confirm-btn');
const modalCancelBtn = document.getElementById('modal-cancel-btn');

// Page load initialization
document.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  setupEventListeners();
});

// Setup application-wide event listeners
function setupEventListeners() {
  userForm.addEventListener('submit', handleFormSubmit);
  cancelBtn.addEventListener('click', resetForm);
  searchInput.addEventListener('input', handleSearch);
  
  // Real-time validation helper (clears error states when typing)
  [userNameInput, userEmailInput, userUsernameInput].forEach(input => {
    input.addEventListener('input', () => {
      const errorEl = document.getElementById(`${input.id.replace('user-', '')}-error`);
      if (errorEl) errorEl.classList.add('hidden');
      input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
      input.classList.add('border-slate-300', 'focus:ring-indigo-500', 'focus:border-indigo-500');
    });
  });

  // Modal Confirm & Cancel buttons hookup
  modalConfirmBtn.addEventListener('click', () => {
    if (activeDeleteCallback) activeDeleteCallback();
    hideConfirmModal();
  });
  modalCancelBtn.addEventListener('click', hideConfirmModal);
  confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) hideConfirmModal();
  });
}

// Fetch all users from server
async function fetchUsers() {
  renderLoadingSkeletons();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Could not fetch users from server.');
    users = await response.json();
    
    // Sort users by ID descending to show the newest users first
    users.sort((a, b) => b.id - a.id);
    
    renderUsers(users);
    updateServerStatus(true);
  } catch (error) {
    showToast(error.message, 'error');
    usersGrid.innerHTML = '';
    updateServerStatus(false);
    showEmptyState(true);
  }
}

// Handle form submission (Both CREATE and UPDATE)
async function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  const userData = {
    name: userNameInput.value.trim(),
    email: userEmailInput.value.trim(),
    username: userUsernameInput.value.trim(),
    phone: userPhoneInput.value.trim(),
    website: userWebsiteInput.value.trim()
  };

  setSubmitLoading(true);

  try {
    let response;
    if (editingUserId) {
      // Send PUT request to update the user
      response = await fetch(`${API_URL}/${editingUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Failed to update user.');
      const updatedUser = await response.json();
      
      users = users.map(u => u.id === editingUserId ? updatedUser : u);
      showToast(`User "${updatedUser.name}" updated successfully!`, 'success');
      resetForm();
    } else {
      // Send POST request to create the user
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) throw new Error('Failed to create user.');
      const newUser = await response.json();
      
      users.unshift(newUser); // Place new user at the top
      showToast(`User "${newUser.name}" created successfully!`, 'success');
      resetForm();
    }
    
    renderUsers(users);
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    setSubmitLoading(false);
  }
}

// Delete user execution
function deleteUser(id, name) {
  showConfirmModal(`Are you sure you want to permanently delete user "${name}"?`, async () => {
    const card = document.querySelector(`[data-user-id="${id}"]`);
    if (card) {
      card.style.opacity = '0.5';
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete user.');
      
      // Animate out card smoothly before updating DOM state
      if (card) {
        card.classList.add('scale-95', 'opacity-0');
        await new Promise(r => setTimeout(r, 150));
      }
      
      users = users.filter(u => u.id !== id);
      renderUsers(users);
      showToast(`User "${name}" deleted successfully.`, 'info');
      
      if (editingUserId === id) {
        resetForm();
      }
    } catch (error) {
      showToast(error.message, 'error');
      if (card) {
        card.style.opacity = '1';
      }
    }
  });
}

// Custom Modal show/hide helpers
function showConfirmModal(message, onConfirm) {
  document.getElementById('modal-message').textContent = message;
  confirmModal.classList.remove('hidden');
  activeDeleteCallback = onConfirm;
}

function hideConfirmModal() {
  confirmModal.classList.add('hidden');
  activeDeleteCallback = null;
}

// Edit Mode setup (populates the input fields with current user data)
function editUser(user) {
  editingUserId = user.id;
  userIdInput.value = user.id;
  userNameInput.value = user.name || '';
  userEmailInput.value = user.email || '';
  userUsernameInput.value = user.username || '';
  userPhoneInput.value = user.phone || '';
  userWebsiteInput.value = user.website || '';
  
  // Clear any existing validation red alerts
  clearValidationAlerts();

  formTitle.textContent = 'Edit User';
  formSubtitle.textContent = `Modifying details for ID: ${user.id}`;
  document.getElementById('submit-btn-text').textContent = 'Save Changes';
  cancelBtn.classList.remove('hidden');
  
  // Smooth scroll up to form panel on mobile viewports
  userForm.closest('section').scrollIntoView({ behavior: 'smooth' });
  userNameInput.focus();
}

// Reset form fields back to empty/create mode state
function resetForm() {
  editingUserId = null;
  userForm.reset();
  userIdInput.value = '';
  
  formTitle.textContent = 'Create New User';
  formSubtitle.textContent = 'Enter details to add a member';
  document.getElementById('submit-btn-text').textContent = 'Add User';
  cancelBtn.classList.add('hidden');
  
  clearValidationAlerts();
}

// Form validation checker
function validateForm() {
  let isValid = true;
  
  // Marks specific fields as invalid and shows warnings
  const markInvalid = (input, errorId) => {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.classList.remove('hidden');
    input.classList.remove('border-slate-300', 'focus:ring-indigo-500', 'focus:border-indigo-500');
    input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    isValid = false;
  };

  // Name check
  if (!userNameInput.value.trim()) {
    markInvalid(userNameInput, 'name-error');
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!userEmailInput.value.trim() || !emailRegex.test(userEmailInput.value.trim())) {
    markInvalid(userEmailInput, 'email-error');
  }

  // Username check
  if (!userUsernameInput.value.trim()) {
    markInvalid(userUsernameInput, 'username-error');
  }

  return isValid;
}

// Helper to remove red alerts on all fields
function clearValidationAlerts() {
  [userNameInput, userEmailInput, userUsernameInput].forEach(input => {
    const errorEl = document.getElementById(`${input.id.replace('user-', '')}-error`);
    if (errorEl) errorEl.classList.add('hidden');
    input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');
    input.classList.add('border-slate-300', 'focus:ring-indigo-500', 'focus:border-indigo-500');
  });
}

// Search field query callback (filters local users state)
function handleSearch() {
  const query = searchInput.value.toLowerCase().trim();
  if (!query) {
    renderUsers(users);
    return;
  }
  
  const filteredUsers = users.filter(user => {
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const username = (user.username || '').toLowerCase();
    return name.includes(query) || email.includes(query) || username.includes(query);
  });
  
  renderUsers(filteredUsers);
}

// Render the user list DOM cards
function renderUsers(usersList) {
  usersGrid.innerHTML = '';
  
  // Render badge count
  userCountBadge.textContent = `${usersList.length} User${usersList.length === 1 ? '' : 's'}`;
  
  if (usersList.length === 0) {
    showEmptyState(true);
    return;
  }
  
  showEmptyState(false);
  
  usersList.forEach(user => {
    const initials = getInitials(user.name);
    const bgClass = getAvatarBgClass(user.name || user.email || 'User');
    
    const card = document.createElement('article');
    // Base layout & animation classes
    card.className = 'bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between';
    card.setAttribute('data-user-id', user.id);
    
    card.innerHTML = `
      <div>
        <div class="flex items-center gap-3 mb-4">
          <div class="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm select-none ${bgClass}">${initials}</div>
          <div class="min-w-0">
            <h3 class="text-sm font-bold text-slate-900 truncate" title="${escapeHTML(user.name)}">${escapeHTML(user.name)}</h3>
            <p class="text-xs text-slate-500 truncate">@${escapeHTML(user.username || 'user')}</p>
          </div>
        </div>
        <div class="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="truncate" title="${escapeHTML(user.email)}">${escapeHTML(user.email)}</span>
          </div>
          ${user.phone ? `
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="truncate" title="${escapeHTML(user.phone)}">${escapeHTML(user.phone)}</span>
          </div>` : ''}
          ${user.website ? `
          <div class="flex items-center gap-2">
            <svg class="h-4 w-4 text-slate-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span class="truncate" title="${escapeHTML(user.website)}">${escapeHTML(user.website)}</span>
          </div>` : ''}
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 border-t border-slate-100 mt-4 pt-3">
        <button class="card-btn-edit px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition duration-150 flex items-center gap-1.5" type="button">
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
        <button class="card-btn-delete px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition duration-150 flex items-center gap-1.5" type="button">
          <svg class="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    `;
    
    // Attach clean button event listeners directly
    card.querySelector('.card-btn-edit').addEventListener('click', () => editUser(user));
    card.querySelector('.card-btn-delete').addEventListener('click', () => deleteUser(user.id, user.name));
    
    usersGrid.appendChild(card);
  });
}

// Get first letter of first name and last name
function getInitials(name = '') {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Generate consistent background color based on name string
function getAvatarBgClass(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

// Basic HTML sanitizer to avoid XSS
function escapeHTML(str = '') {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Show or hide empty list template container
function showEmptyState(show) {
  if (show) {
    emptyState.classList.remove('hidden');
    usersGrid.classList.add('hidden');
  } else {
    emptyState.classList.add('hidden');
    usersGrid.classList.remove('hidden');
  }
}

// Show skeleton animated block loaders
function renderLoadingSkeletons() {
  usersGrid.innerHTML = `
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div class="flex items-center gap-3">
        <div class="rounded-full bg-slate-200 h-10 w-10"></div>
        <div class="flex-grow space-y-2">
          <div class="h-4 bg-slate-200 rounded-md w-1/2"></div>
          <div class="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
      </div>
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="h-3 bg-slate-200 rounded-md w-4/5"></div>
        <div class="h-3 bg-slate-200 rounded-md w-3/4"></div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div class="flex items-center gap-3">
        <div class="rounded-full bg-slate-200 h-10 w-10"></div>
        <div class="flex-grow space-y-2">
          <div class="h-4 bg-slate-200 rounded-md w-1/2"></div>
          <div class="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
      </div>
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="h-3 bg-slate-200 rounded-md w-4/5"></div>
        <div class="h-3 bg-slate-200 rounded-md w-3/4"></div>
      </div>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm animate-pulse space-y-4">
      <div class="flex items-center gap-3">
        <div class="rounded-full bg-slate-200 h-10 w-10"></div>
        <div class="flex-grow space-y-2">
          <div class="h-4 bg-slate-200 rounded-md w-1/2"></div>
          <div class="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
      </div>
      <div class="space-y-2 pt-2 border-t border-slate-100">
        <div class="h-3 bg-slate-200 rounded-md w-4/5"></div>
        <div class="h-3 bg-slate-200 rounded-md w-3/4"></div>
      </div>
    </div>
  `;
  showEmptyState(false);
}

// Toggle form submission status and animate loading state
function setSubmitLoading(loading) {
  const spinner = document.getElementById('submit-spinner');
  const btnText = document.getElementById('submit-btn-text');
  submitBtn.disabled = loading;
  if (loading) {
    spinner.classList.remove('hidden');
    btnText.textContent = editingUserId ? 'Saving...' : 'Adding...';
  } else {
    spinner.classList.add('hidden');
    btnText.textContent = editingUserId ? 'Save Changes' : 'Add User';
  }
}

// Update Server connection indicators (dot & text)
function updateServerStatus(online) {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const wrapper = dot.closest('div');
  
  if (online) {
    dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-emerald-500';
    text.textContent = 'Server Online';
    wrapper.className = 'flex items-center gap-2 px-3 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold';
  } else {
    dot.className = 'relative inline-flex rounded-full h-2 w-2 bg-red-500';
    text.textContent = 'Server Offline';
    wrapper.className = 'flex items-center gap-2 px-3 h-8 rounded-full bg-red-50 border border-red-100 text-red-700 text-xs font-semibold';
  }
}

// Toast Notifications System (Using Tailwind CSS transitions)
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  
  // Set up container properties
  toast.className = `flex items-center gap-3 p-4 rounded-xl border bg-white shadow-lg pointer-events-auto transform translate-y-2 transition-all duration-300 opacity-0`;
  
  // Add design parameters per message type
  let typeClasses = '';
  let iconSVG = '';
  if (type === 'success') {
    typeClasses = 'border-emerald-100 text-slate-800';
    iconSVG = `<div class="text-emerald-500 flex-shrink-0">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>`;
  } else if (type === 'error') {
    typeClasses = 'border-red-100 text-slate-800';
    iconSVG = `<div class="text-red-500 flex-shrink-0">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>`;
  } else { // info / delete
    typeClasses = 'border-blue-100 text-slate-800';
    iconSVG = `<div class="text-blue-500 flex-shrink-0">
      <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>`;
  }

  toast.className += ` ${typeClasses}`;
  toast.innerHTML = `
    ${iconSVG}
    <div class="text-sm font-medium flex-grow">${escapeHTML(message)}</div>
    <button class="text-slate-400 hover:text-slate-600 transition text-lg leading-none" type="button" aria-label="Close message">&times;</button>
  `;
  
  // Slide down & fade out dismiss method
  const dismiss = () => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-2', 'opacity-0');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  };
  
  toast.querySelector('button').addEventListener('click', dismiss);
  
  toastContainer.appendChild(toast);
  
  // Trigger DOM paint reflow to start transition smoothly
  toast.offsetHeight;
  
  // Slide up & fade in
  toast.classList.remove('translate-y-2', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');
  
  // Self-destruct after 4 seconds
  setTimeout(dismiss, 4000);
}
