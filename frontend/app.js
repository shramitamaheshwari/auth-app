const API_BASE = 'https://auth-app-y8l2.onrender.com/api';

/* ─── Utilities ─────────────────────────────────────────────── */
function getToken() { return localStorage.getItem('vault_token'); }
function getUser() {
  const u = localStorage.getItem('vault_user');
  return u ? JSON.parse(u) : null;
}
function setAuth(token, user) {
  localStorage.setItem('vault_token', token);
  localStorage.setItem('vault_user', JSON.stringify(user));
}
function clearAuth() {
  localStorage.removeItem('vault_token');
  localStorage.removeItem('vault_user');
}

function showAlert(id, message, type = 'error') {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.className = `alert ${type}`;
}

function hideAlert(id) {
  const el = document.getElementById(id);
  if (el) el.className = 'alert hidden';
}

function setLoading(btnId, loading) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const text = btn.querySelector('.btn-text');
  const loader = btn.querySelector('.btn-loader');
  btn.disabled = loading;
  if (loading) {
    text.classList.add('hidden');
    loader.classList.remove('hidden');
  } else {
    text.classList.remove('hidden');
    loader.classList.add('hidden');
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

/* ─── Tab Switching ─────────────────────────────────────────── */
function switchTab(tab) {
  const loginForm = document.getElementById('form-login');
  const signupForm = document.getElementById('form-signup');
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const indicator = document.getElementById('tab-indicator');

  hideAlert('login-alert');
  hideAlert('signup-alert');

  if (tab === 'login') {
    loginForm.classList.add('active');
    signupForm.classList.remove('active');
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    indicator.classList.remove('right');
  } else {
    signupForm.classList.add('active');
    loginForm.classList.remove('active');
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    indicator.classList.add('right');
  }
}

/* ─── Password toggle ───────────────────────────────────────── */
function togglePassword(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    btn.textContent = 'hide';
  } else {
    input.type = 'password';
    btn.textContent = 'show';
  }
}

/* ─── Password strength ─────────────────────────────────────── */
const pwInput = document.getElementById('signup-password');
if (pwInput) {
  pwInput.addEventListener('input', function () {
    const val = this.value;
    const fill = document.getElementById('strength-fill');
    if (!fill) return;
    let strength = 0;
    if (val.length >= 6) strength++;
    if (val.length >= 10) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    const widths = ['0%', '20%', '45%', '65%', '85%', '100%'];
    const colors = ['', '#ff4d6a', '#ff9a3c', '#f5c842', '#8fdd64', '#4dffb0'];
    fill.style.width = widths[strength];
    fill.style.background = colors[strength];
  });
}

/* ─── Login ─────────────────────────────────────────────────── */
async function handleLogin() {
  hideAlert('login-alert');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    showAlert('login-alert', 'Please fill in all fields.');
    return;
  }

  setLoading('login-btn', true);

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert('login-alert', data.message || 'Login failed.');
      return;
    }

    setAuth(data.token, data.user);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('login-alert', 'Unable to connect. Is the server running?');
  } finally {
    setLoading('login-btn', false);
  }
}

/* ─── Signup ────────────────────────────────────────────────── */
async function handleSignup() {
  hideAlert('signup-alert');
  const name = document.getElementById('signup-name').value.trim();
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;

  if (!name || !email || !password) {
    showAlert('signup-alert', 'Please fill in all fields.');
    return;
  }

  if (password.length < 6) {
    showAlert('signup-alert', 'Password must be at least 6 characters.');
    return;
  }

  setLoading('signup-btn', true);

  try {
    const res = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      showAlert('signup-alert', data.message || 'Signup failed.');
      return;
    }

    setAuth(data.token, data.user);
    window.location.href = 'dashboard.html';
  } catch (err) {
    showAlert('signup-alert', 'Unable to connect. Is the server running?');
  } finally {
    setLoading('signup-btn', false);
  }
}

/* ─── Enter key support ─────────────────────────────────────── */
document.addEventListener('keydown', function (e) {
  if (e.key !== 'Enter') return;
  const loginActive = document.getElementById('form-login')?.classList.contains('active');
  if (loginActive) handleLogin();
  else handleSignup();
});

/* ─── Dashboard ─────────────────────────────────────────────── */
async function loadDashboard() {
  const token = getToken();
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  const cachedUser = getUser();
  if (cachedUser) renderProfile(cachedUser);

  try {
    const res = await fetch(`${API_BASE}/user/dashboard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.status === 401) {
      clearAuth();
      window.location.href = 'index.html';
      return;
    }

    const data = await res.json();

    const meRes = await fetch(`${API_BASE}/user/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    const user = meData.user;

    renderProfile(user);

    const activeEl = document.getElementById('stat-active');
    if (activeEl) activeEl.textContent = new Date().toLocaleTimeString();
  } catch (err) {
    console.error('Dashboard load error:', err);
  }

  const tokenEl = document.getElementById('token-display');
  if (tokenEl) tokenEl.textContent = token;
}

function renderProfile(user) {
  const greet = document.getElementById('user-greeting');
  const title = document.getElementById('dash-title');
  const avatar = document.getElementById('profile-avatar');
  const name = document.getElementById('profile-name');
  const email = document.getElementById('profile-email');
  const uid = document.getElementById('profile-id');
  const since = document.getElementById('stat-since');

  if (greet) greet.textContent = `hi, ${user.name.split(' ')[0].toLowerCase()}`;
  if (title) title.textContent = `Hello, ${user.name.split(' ')[0]}.`;
  if (avatar) avatar.textContent = user.name.charAt(0).toUpperCase();
  if (name) name.textContent = user.name;
  if (email) email.textContent = user.email;
  if (uid) { uid.textContent = user.id; uid.className = 'profile-val mono small'; }
  if (since) since.textContent = formatDate(user.createdAt);
}

function handleLogout() {
  clearAuth();
  window.location.href = 'index.html';
}

function copyToken() {
  const token = getToken();
  if (!token) return;
  navigator.clipboard.writeText(token).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) {
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy Token', 2000);
    }
  });
}

/* ─── Init ──────────────────────────────────────────────────── */
if (window.location.pathname.includes('dashboard')) {
  loadDashboard();
} else {
  if (getToken()) window.location.href = 'dashboard.html';
}