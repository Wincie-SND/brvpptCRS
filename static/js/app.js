'use strict';

const loginForm = document.getElementById("loginForm");

if(loginForm){
    loginForm.addEventListener("submit", function(e){
        e.preventDefault();

        const tenantKey = document.getElementById("tenantKey").value.trim().toUpperCase();
        const email = document.getElementById("loginEmail").value.trim().toLowerCase();
        const password = document.getElementById("loginPassword").value.trim();

        console.log("Tenant:", tenantKey);
        console.log("Email:", email);
        console.log("Password:", password);

        if(email === "maria@email.com" && password === "test123"){
            window.location.replace("index.html");
            return;
        }

        if(email === "carlos@horizon.com" && password === "horizon123" && tenantKey === "HORIZON"){
            window.location.href = "tenant.html";
            return; 
        }

        if(email === "ryan@metroglide.com" && password === "metro123" && tenantKey === "METROGLIDE"){
            window.location.href = "tenant.html";
            return;
        }

        if(email === "admin@drivelink.io" && password === "superadmin999"){
            window.location.href = "admin.html";
            return;
        }

        alert("Invalid login credentials");
    });
}

const DB = {

  tenants: [
    {
      id: 'T_HORIZON',
      key: 'HORIZON',
      name: 'Horizon Car Rentals',
      tagline: 'Drive Beyond The Horizon',
      plan: 'Enterprise',
      subscriptionRevenue: 29900,
      color: '#6366f1',
      joinDate: '2023-03-15',
      status: 'active'
    },
    {
      id: 'T_METRO',
      key: 'METROGLIDE',
      name: 'MetroGlide Ph',
      tagline: 'Urban Mobility, Redefined',
      plan: 'Professional',
      subscriptionRevenue: 14900,
      color: '#10b981',
      joinDate: '2023-08-22',
      status: 'active'
    }
  ],

  users: [
    // Independent Renters
    {
      id: 'U001',
      name: 'Maria Santos',
      email: 'maria@email.com',
      password: 'test123',
      role: 'renter',
      tenant_id: null,
      avatar: 'MS',
      license_status: 'verified',
      joinDate: '2024-01-10',
      phone: '+63-912-345-6789'
    },
    {
      id: 'U002',
      name: 'Juan Reyes',
      email: 'juan@email.com',
      password: 'test123',
      role: 'renter',
      tenant_id: null,
      avatar: 'JR',
      license_status: 'pending',
      joinDate: '2024-03-05',
      phone: '+63-917-654-3210'
    },
    {
      id: 'U003',
      name: 'Ana Cruz',
      email: 'ana@email.com',
      password: 'test123',
      role: 'renter',
      tenant_id: null,
      avatar: 'AC',
      license_status: 'verified',
      joinDate: '2024-05-18',
      phone: '+63-920-111-2233'
    },
    // Horizon Staff
    {
      id: 'U004',
      name: 'Carlos Mendoza',
      email: 'carlos@horizon.com',
      password: 'horizon123',
      role: 'tenant_admin',
      tenant_id: 'T_HORIZON',
      avatar: 'CM',
      license_status: 'n/a',
      joinDate: '2023-03-15',
      phone: '+63-999-888-7766'
    },
    {
      id: 'U005',
      name: 'Lisa Tan',
      email: 'lisa@horizon.com',
      password: 'horizon123',
      role: 'tenant_staff',
      tenant_id: 'T_HORIZON',
      avatar: 'LT',
      license_status: 'n/a',
      joinDate: '2023-06-01',
      phone: '+63-999-111-2244'
    },
    // MetroGlide Staff
    {
      id: 'U006',
      name: 'Ryan Lim',
      email: 'ryan@metroglide.com',
      password: 'metro123',
      role: 'tenant_admin',
      tenant_id: 'T_METRO',
      avatar: 'RL',
      license_status: 'n/a',
      joinDate: '2023-08-22',
      phone: '+63-916-500-1234'
    },
    {
      id: 'U007',
      name: 'Sophie Go',
      email: 'sophie@metroglide.com',
      password: 'metro123',
      role: 'tenant_staff',
      tenant_id: 'T_METRO',
      avatar: 'SG',
      license_status: 'n/a',
      joinDate: '2023-09-10',
      phone: '+63-916-500-5678'
    },
    // Super Admin
    {
      id: 'U999',
      key: 'DX-ADMIN-9F2A',
      name: 'Admin Root',
      email: 'admin@drivelink.io',
      password: 'superadmin999',
      role: 'super_admin',
      tenant_id: null,
      avatar: 'AR',
      license_status: 'n/a',
      joinDate: '2023-01-01',
      phone: '+63-800-000-0000'
    }
  ],

  vehicles: [
    // Horizon Fleet
    {
      id: 'V001', tenant_id: 'T_HORIZON',
      brand: 'Toyota', model: 'Fortuner', year: 2023,
      category: 'SUV', transmission: 'Automatic', fuel: 'Diesel',
      pricePerDay: 4500, available: true, color: '#6366f1',
      image:'../static/images/tfortuner.png', plate: 'HRZ-001', seats: 7, mileage: 12000
    },
    {
      id: 'V002', tenant_id: 'T_HORIZON',
      brand: 'Honda', model: 'Civic', year: 2024,
      category: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline',
      pricePerDay: 2800, available: true, color: '#8b5cf6',
      image:'../static/images/hcivic.png', plate: 'HRZ-002', seats: 5, mileage: 5200
    },
    {
      id: 'V003', tenant_id: 'T_HORIZON',
      brand: 'Mitsubishi', model: 'Montero Sport', year: 2022,
      category: 'SUV', transmission: 'Manual', fuel: 'Diesel',
      pricePerDay: 3900, available: false, color: '#06b6d4',
      image:'../static/images/tmonterosport.png', plate: 'HRZ-003', seats: 7, mileage: 38000
    },
    {
      id: 'V004', tenant_id: 'T_HORIZON',
      brand: 'Ford', model: 'Ranger', year: 2023,
      category: 'Pickup', transmission: 'Automatic', fuel: 'Diesel',
      pricePerDay: 4200, available: true, color: '#f59e0b',
      image:'../static/images/franger.png', plate: 'HRZ-004', seats: 5, mileage: 18500
    },
    {
      id: 'V005', tenant_id: 'T_HORIZON',
      brand: 'Mazda', model: 'CX-5', year: 2024,
      category: 'SUV', transmission: 'Automatic', fuel: 'Gasoline',
      pricePerDay: 3600, available: true, color: '#ef4444',
      image:'../static/images/mcx-5.png  ', plate: 'HRZ-005', seats: 5, mileage: 3100
    },
    // MetroGlide Fleet
    {
      id: 'V006', tenant_id: 'T_METRO',
      brand: 'Toyota', model: 'Vios', year: 2023,
      category: 'Sedan', transmission: 'Automatic', fuel: 'Gasoline',
      pricePerDay: 2200, available: true, color: '#10b981',
      image:'../static/images/tvios.png', plate: 'MTG-001', seats: 5, mileage: 22000
    },
    {
      id: 'V007', tenant_id: 'T_METRO',
      brand: 'Honda', model: 'BR-V', year: 2022,
      category: 'SUV', transmission: 'CVT', fuel: 'Gasoline',
      pricePerDay: 2900, available: true, color: '#14b8a6',
      image:'../static/images/hbr-v.png', plate: 'MTG-002', seats: 7, mileage: 41000
    },
    {
      id: 'V008', tenant_id: 'T_METRO',
      brand: 'Suzuki', model: 'Ertiga', year: 2023,
      category: 'Van', transmission: 'Automatic', fuel: 'Gasoline',
      pricePerDay: 2600, available: false, color: '#0ea5e9',
      image:'../static/images/sertiga.png', plate: 'MTG-003', seats: 7, mileage: 15700
    },
    {
      id: 'V009', tenant_id: 'T_METRO',
      brand: 'Geely', model: 'Coolray', year: 2024,
      category: 'SUV', transmission: 'DCT', fuel: 'Gasoline',
      pricePerDay: 3100, available: true, color: '#6366f1',
      image:'../static/images/gcoolray.png', plate: 'MTG-004', seats: 5, mileage: 8900
    }
  ],

  bookings: [
    {
      id: 'BK001', vehicle_id: 'V001', user_id: 'U001', tenant_id: 'T_HORIZON',
      startDate: '2025-05-10', endDate: '2025-05-13',
      totalDays: 3, totalAmount: 13500, status: 'active',
      paymentStatus: 'paid', bookingDate: '2025-05-08'
    },
    {
      id: 'BK002', vehicle_id: 'V002', user_id: 'U003', tenant_id: 'T_HORIZON',
      startDate: '2025-04-20', endDate: '2025-04-22',
      totalDays: 2, totalAmount: 5600, status: 'completed',
      paymentStatus: 'paid', bookingDate: '2025-04-18'
    },
    {
      id: 'BK003', vehicle_id: 'V006', user_id: 'U002', tenant_id: 'T_METRO',
      startDate: '2025-05-05', endDate: '2025-05-08',
      totalDays: 3, totalAmount: 6600, status: 'completed',
      paymentStatus: 'paid', bookingDate: '2025-05-03'
    },
    {
      id: 'BK004', vehicle_id: 'V004', user_id: 'U001', tenant_id: 'T_HORIZON',
      startDate: '2025-03-14', endDate: '2025-03-16',
      totalDays: 2, totalAmount: 8400, status: 'completed',
      paymentStatus: 'paid', bookingDate: '2025-03-12'
    },
    {
      id: 'BK005', vehicle_id: 'V007', user_id: 'U003', tenant_id: 'T_METRO',
      startDate: '2025-05-15', endDate: '2025-05-18',
      totalDays: 3, totalAmount: 8700, status: 'active',
      paymentStatus: 'paid', bookingDate: '2025-05-13'
    },
    {
      id: 'BK006', vehicle_id: 'V005', user_id: 'U002', tenant_id: 'T_HORIZON',
      startDate: '2025-06-01', endDate: '2025-06-04',
      totalDays: 3, totalAmount: 10800, status: 'upcoming',
      paymentStatus: 'pending', bookingDate: '2025-05-16'
    }
  ],

  chats: [
    {
      id: 'CH001',
      tenant_id: 'T_HORIZON',
      user_id: 'U001',
      booking_id: 'BK001',
      unread: 2,
      messages: [
        { from: 'user', text: 'Hi! I just wanted to confirm my booking for the Fortuner.', time: '09:15 AM' },
        { from: 'agent', text: 'Hello Maria! Yes, your booking BK001 is confirmed. The Toyota Fortuner will be ready at our Makati branch on May 10.', time: '09:18 AM' },
        { from: 'user', text: 'Great! Do I need to bring anything aside from my driver\'s license?', time: '09:20 AM' },
        { from: 'agent', text: 'Please also bring one valid government ID and a credit card for the security deposit. We\'ll handle everything else!', time: '09:23 AM' },
        { from: 'user', text: 'Can I get an early pickup at 7am?', time: '10:45 AM' },
        { from: 'user', text: 'Our usual schedule starts at 8am, sorry. But if you arrive at 7:30, we can check you in early.', time: '10:47 AM' }
      ]
    },
    {
      id: 'CH002',
      tenant_id: 'T_HORIZON',
      user_id: 'U003',
      booking_id: 'BK002',
      unread: 0,
      messages: [
        { from: 'user', text: 'The Civic was in perfect condition. Thank you so much!', time: '02:10 PM' },
        { from: 'agent', text: 'Thank you for the kind words, Ana! We look forward to having you rent with us again. 😊', time: '02:15 PM' },
        { from: 'user', text: 'Definitely will! Do you have any promo for returning customers?', time: '02:18 PM' },
        { from: 'agent', text: 'Yes! Returning customers get a 10% discount on their next booking. I\'ll apply it automatically when you book again.', time: '02:22 PM' }
      ]
    },
    {
      id: 'CH003',
      tenant_id: 'T_METRO',
      user_id: 'U002',
      booking_id: 'BK003',
      unread: 1,
      messages: [
        { from: 'user', text: 'Hi, I had an issue with the car AC during my rental.', time: '11:00 AM' },
        { from: 'agent', text: 'We apologize for the inconvenience, Juan. Can you describe the issue in detail?', time: '11:05 AM' },
        { from: 'user', text: 'The aircon was blowing warm air after the first hour of driving.', time: '11:07 AM' },
        { from: 'agent', text: 'Thank you for letting us know. We\'ll inspect the unit and process a partial refund for the inconvenience.', time: '11:12 AM' },
        { from: 'user', text: 'How much of a refund will I get?', time: '03:45 PM' }
      ]
    },
    {
      id: 'CH004',
      tenant_id: 'T_METRO',
      user_id: 'U003',
      booking_id: 'BK005',
      unread: 3,
      messages: [
        { from: 'user', text: 'Hello! Excited for my BR-V rental next week!', time: '04:00 PM' },
        { from: 'agent', text: 'Hi Ana! We\'re excited to have you. The BR-V is freshly serviced and ready!', time: '04:05 PM' },
        { from: 'user', text: 'Perfect. Will there be a driver or is it self-drive?', time: '04:08 PM' },
        { from: 'user', text: 'Also, is there GPS included?', time: '04:09 PM' },
        { from: 'user', text: 'And is fuel inclusive?', time: '04:10 PM' }
      ]
    }
  ]
};

// ─────────────────────────────────────────────
// § 2. SESSION MANAGEMENT
// ─────────────────────────────────────────────

const Session = {
  ADMIN_SECRET_KEY: 'DX-ADMIN-9F2A',

  set(data) {
    sessionStorage.setItem('drivelink_session', JSON.stringify(data));
  },

  get() {
    try {
      return JSON.parse(sessionStorage.getItem('drivelink_session')) || null;
    } catch { return null; }
  },

  clear() {
    sessionStorage.removeItem('drivelink_session');
    sessionStorage.removeItem('drivelink_admin_key');
  },

  setAdminKey(key) {
    sessionStorage.setItem('drivelink_admin_key', key);
  },

  getAdminKey() {
    return sessionStorage.getItem('drivelink_admin_key');
  },

  isLoggedIn() { return this.get() !== null; },

  isTenant() {
    const s = this.get();
    return s && (s.role === 'tenant_admin' || s.role === 'tenant_staff');
  },

  isAdmin() {
    const s = this.get();
    return s && s.role === 'super_admin' && this.getAdminKey() === this.ADMIN_SECRET_KEY;
  },

  getTenantId() {
    const s = this.get();
    return s ? s.tenant_id : null;
  }
};

// ─────────────────────────────────────────────
// § 3. AUTH ENGINE
// ─────────────────────────────────────────────

const Auth = {
  login(email, password, tenantKey) {
    const user = DB.users.find(u => u.email === email && u.password === password);
    if (!user) return { success: false, error: 'Invalid email or password.' };

    if (user.role === 'renter') {
      Session.set({ ...user, password: undefined });
      return { success: true, redirect: 'index.html' };
    }

    if (user.role === 'tenant_admin' || user.role === 'tenant_staff') {
      const tenant = DB.tenants.find(t => t.key === tenantKey.toUpperCase());
      if (!tenant) return { success: false, error: 'Invalid Tenant Account Key.' };
      if (tenant.id !== user.tenant_id) return { success: false, error: 'Account key does not match your registered tenant.' };
      Session.set({ ...user, password: undefined, tenantName: tenant.name });
      return { success: true, redirect: 'portal.html' };
    }

    if (user.role === 'super_admin') {
      // Store partial session; require secondary ADMIN_KEY challenge
      Session.set({ ...user, password: undefined, pendingAdminChallenge: true });
      return { success: true, requiresChallenge: true };
    }

    return { success: false, error: 'Unknown account type.' };
  },

  verifyAdminKey(key) {
    if (key === Session.ADMIN_SECRET_KEY) {
      Session.setAdminKey(key);
      const s = Session.get();
      if (s) {
        delete s.pendingAdminChallenge;
        Session.set(s);
      }
      return true;
    }
    return false;
  },

  logout() {
    Session.clear();
    window.location.href = 'login.html';
  }
};

// ─────────────────────────────────────────────
// § 4. DATA ACCESS LAYER (Tenant-Isolated)
// ─────────────────────────────────────────────

const DataStore = {
  getVehicles(tenantId = null, filters = {}) {
    let vehicles = tenantId
      ? DB.vehicles.filter(v => v.tenant_id === tenantId)
      : DB.vehicles;

    // Apply filters
    if (filters.available !== undefined) {
      vehicles = vehicles.filter(v => v.available === filters.available);
    }
    if (filters.category) {
      vehicles = vehicles.filter(v => v.category === filters.category);
    }
    if (filters.transmission) {
      vehicles = vehicles.filter(v => v.transmission === filters.transmission);
    }
    if (filters.brand) {
      vehicles = vehicles.filter(v => v.brand.toLowerCase() === filters.brand.toLowerCase());
    }
    if (filters.maxPrice) {
      vehicles = vehicles.filter(v => v.pricePerDay <= filters.maxPrice);
    }
    if (filters.minPrice !== undefined) {
      vehicles = vehicles.filter(v => v.pricePerDay >= filters.minPrice);
    }
    return vehicles;
  },

  getBookings(tenantId = null, userId = null) {
    let bookings = DB.bookings;
    if (tenantId) bookings = bookings.filter(b => b.tenant_id === tenantId);
    if (userId) bookings = bookings.filter(b => b.user_id === userId);
    return bookings;
  },

  getChats(tenantId = null, userId = null) {
    let chats = DB.chats;
    if (tenantId) chats = chats.filter(c => c.tenant_id === tenantId);
    if (userId) chats = chats.filter(c => c.user_id === userId);
    return chats;
  },

  getChatById(chatId) {
    return DB.chats.find(c => c.id === chatId) || null;
  },

  getVehicleById(id) { return DB.vehicles.find(v => v.id === id) || null; },
  getBookingById(id) { return DB.bookings.find(b => b.id === id) || null; },
  getUserById(id) { return DB.users.find(u => u.id === id) || null; },
  getTenantById(id) { return DB.tenants.find(t => t.id === id) || null; },
  getTenantByKey(key) { return DB.tenants.find(t => t.key === key.toUpperCase()) || null; },

  sendMessage(chatId, text, from = 'user') {
    const chat = DB.chats.find(c => c.id === chatId);
    if (!chat) return null;
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const msg = { from, text, time };
    chat.messages.push(msg);
    if (from === 'user') {
      chat.unread = (chat.unread || 0) + 1;
    }
    return msg;
  },

  markChatRead(chatId) {
    const chat = DB.chats.find(c => c.id === chatId);
    if (chat) chat.unread = 0;
  },

  // Tenant metrics
  getTenantMetrics(tenantId) {
    const bookings = this.getBookings(tenantId);
    const vehicles = this.getVehicles(tenantId);
    const active = bookings.filter(b => b.status === 'active');
    const revenue = bookings
      .filter(b => b.status !== 'upcoming')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const available = vehicles.filter(v => v.available).length;

    return {
      totalBookings: bookings.length,
      grossRevenue: revenue,
      activeRentals: active.length,
      availableVehicles: available,
      totalFleet: vehicles.length,
      occupancyRate: vehicles.length
        ? Math.round(((vehicles.length - available) / vehicles.length) * 100)
        : 0
    };
  },

  // Global metrics (super admin)
  getGlobalMetrics() {
    const totalRevenue = DB.bookings
      .filter(b => b.status !== 'upcoming')
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const subRevenue = DB.tenants.reduce((sum, t) => sum + t.subscriptionRevenue, 0);
    return {
      totalTenants: DB.tenants.length,
      totalUsers: DB.users.length,
      totalVehicles: DB.vehicles.length,
      totalBookings: DB.bookings.length,
      totalRevenue,
      subRevenue,
      saasRevenue: totalRevenue + subRevenue
    };
  }
};

// ─────────────────────────────────────────────
// § 5. UI UTILITIES
// ─────────────────────────────────────────────

const UI = {
  showToast(message, type = 'info', duration = 3500) {
    const icons = { info: 'ℹ️', success: '✅', error: '❌', warning: '⚠️' };
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icons[type] || icons.info}</span><span>${message}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  },

  formatCurrency(amount) {
    return '₱' + amount.toLocaleString('en-PH');
  },

  formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-PH', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  },

  getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  },

  statusBadge(status) {
    const map = {
      active:    ['badge-success', 'Active'],
      completed: ['badge-neutral', 'Completed'],
      upcoming:  ['badge-warning', 'Upcoming'],
      cancelled: ['badge-danger',  'Cancelled'],
      paid:      ['badge-success', 'Paid'],
      pending:   ['badge-warning', 'Pending'],
      verified:  ['badge-success', 'Verified'],
      'n/a':     ['badge-neutral', 'N/A']
    };
    const [cls, label] = map[status] || ['badge-neutral', status];
    return `<span class="badge ${cls}">${label}</span>`;
  },

  availabilityBadge(available) {
    return available
      ? `<span class="badge badge-success"><span class="status-dot online"></span> Available</span>`
      : `<span class="badge badge-danger">Rented Out</span>`;
  },

  tenantBadge(tenantId) {
    const t = DB.tenants.find(t => t.id === tenantId);
    return t ? `<span class="badge badge-primary">Tenant: ${t.name}</span>` : '';
  },

  roleBadge(role, tenantId) {
    const map = {
      renter: ['badge-neutral', '🙋 Independent Renter'],
      tenant_admin: ['badge-primary', '🏢 Tenant Admin'],
      tenant_staff: ['badge-primary', '👤 Tenant Staff'],
      super_admin: ['badge-danger', '⚡ Super Admin']
    };
    const [cls, label] = map[role] || ['badge-neutral', role];
    let html = `<span class="badge ${cls}">${label}</span>`;
    if (tenantId) {
      const t = DB.tenants.find(t => t.id === tenantId);
      if (t) html += ` <span class="badge badge-neutral" style="font-size:0.68rem">${t.name}</span>`;
    }
    return html;
  },

  showError(el, msg) {
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  },

  clearError(el) {
    if (el) { el.textContent = ''; el.style.display = 'none'; }
  }
};

// ─────────────────────────────────────────────
// § 6. LOGIN PAGE MODULE
// ─────────────────────────────────────────────

function initLoginPage() {

  const session = Session.get();

  if (session) {

    if (session.role === 'renter') {
      window.location.replace('index.html');
      return;
    }

    if (session.role === 'super_admin') {
      window.location.replace(
        'admin.html?key=' + Session.ADMIN_SECRET_KEY
      );
      return;
    }

    if (
      session.role === 'tenant_admin' ||
      session.role === 'tenant_staff'
    ) {

      window.location.replace('portal.html');
      return;
    }
  }

  const form = document.getElementById('loginForm');

  if (!form) return;

  form.addEventListener('submit', function(e){

    e.preventDefault();

    const tenantKey =
      document.getElementById('tenantKey')
      .value.trim()
      .toUpperCase();

    const email =
      document.getElementById('loginEmail')
      .value.trim()
      .toLowerCase();

    const password =
      document.getElementById('loginPassword')
      .value.trim();

    const result =
      Auth.login(email,password,tenantKey);

    if(!result.success){
      alert(result.error);
      return;
    }

    if(result.requiresChallenge){

      Session.setAdminKey(
        Session.ADMIN_SECRET_KEY
      );

      window.location.replace(
        'admin.html?key=' +
        Session.ADMIN_SECRET_KEY
      );

      return;
    }

    window.location.replace(
      result.redirect
    );

  });

}

// ─────────────────────────────────────────────
// § 7. INDEX PAGE MODULE (Marketplace + Renter)
// ─────────────────────────────────────────────

function initIndexPage() {
  const session = Session.get();
  const navLogin   = document.getElementById('navLogin');
  const navUser    = document.getElementById('navUser');
  const navName    = document.getElementById('navName');
  const logoutBtn  = document.getElementById('logoutBtn');
  const viewMarket = document.getElementById('viewMarket');
  const viewAccount= document.getElementById('viewAccount');

  // Update nav state
  if (session && session.role === 'renter') {
    navLogin && (navLogin.style.display = 'none');
    navUser  && (navUser.style.display = 'flex');
    navName  && (navName.textContent = session.name.split(' ')[0]);
  } else {
    navUser && (navUser.style.display = 'none');
  }

  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout.bind(Auth));

  // Nav tabs
  document.querySelectorAll('[data-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.view;
      document.querySelectorAll('[data-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (viewMarket) viewMarket.style.display = target === 'market' ? 'block' : 'none';
      if (viewAccount) viewAccount.style.display = target === 'account' ? 'block' : 'none';

      if (target === 'account') {
        if (!session) {
          window.location.href = 'login.html';
        } else {
          renderAccountView(session);
          loadProfile();
        }
      }
    });
  });

  // Render marketplace
  renderMarketplace();
  initFilters();
}

function renderMarketplace(filters = {}) {
  const grid = document.getElementById('vehicleGrid');
  if (!grid) return;

  const vehicles = DataStore.getVehicles(null, filters);

  grid.innerHTML='';

  if(!vehicles.length){
    grid.innerHTML=`
      <div style="
      grid-column:1/-1;
      text-align:center;
      padding:4rem;">
      No vehicles found
      </div>
    `;
    return;
  }

  vehicles.forEach((v,i)=>{

    const tenant=
      DataStore.getTenantById(v.tenant_id);

    const card=document.createElement('div');

    card.className=
      'vehicle-card animate-fade-in';

    card.style.animationDelay=
      `${i*0.07}s`;

card.innerHTML=`

<div class="vehicle-img">
  <img
    src="${v.image || '../static/images/default-car.jpg'}"
    class="vehicle-photo"
    alt="${v.brand} ${v.model}"
    onerror="this.src='../static/images/default-car.jpg'">
</div>

<div class="vehicle-body">

  <div class="flex items-center justify-between mb-2">
    <span class="badge badge-neutral">
      ${v.category}
    </span>

    ${UI.availabilityBadge(v.available)}
  </div>

  <div class="flex items-center justify-between mb-1">
    <h4 style="font-size:1rem">
      ${v.brand} ${v.model}
    </h4>

    <span class="text-xs text-muted font-mono">
      ${v.year}
    </span>
  </div>

  <p class="text-xs text-muted mb-3">
    ${tenant ? tenant.name : 'DriveLink Fleet'}
  </p>

  <div class="flex gap-2 mb-3" style="flex-wrap:wrap">
    <span class="badge badge-neutral">⚙️ ${v.transmission}</span>
    <span class="badge badge-neutral">⛽ ${v.fuel}</span>
    <span class="badge badge-neutral">💺 ${v.seats} seats</span>
  </div>

  <hr class="divider">

  <div class="flex items-center justify-between mt-3">
    <div class="vehicle-price">
      ${UI.formatCurrency(v.pricePerDay)}
      <sub>/day</sub>
    </div>

    <button
      class="btn btn-primary btn-sm"
      onclick="handleBooking('${v.id}')"
      ${!v.available ? 'disabled style="opacity:.4"' : ''}>
      ${v.available ? 'Book Now' : 'Unavailable'}
    </button>
  </div>

</div>
`;

    grid.appendChild(card);

  });

}

function initFilters() {
  const priceSlider   = document.getElementById('priceFilter');
  const priceVal      = document.getElementById('priceValue');
  const brandSelect   = document.getElementById('brandFilter');
  const transSelect   = document.getElementById('transFilter');
  const categorySelect= document.getElementById('categoryFilter');
  const resetBtn      = document.getElementById('resetFilters');

  function applyFilters() {
    const filters = {};
    if (priceSlider && priceSlider.value < priceSlider.max) filters.maxPrice = parseInt(priceSlider.value);
    if (brandSelect && brandSelect.value) filters.brand = brandSelect.value;
    if (transSelect && transSelect.value) filters.transmission = transSelect.value;
    if (categorySelect && categorySelect.value) filters.category = categorySelect.value;
    renderMarketplace(filters);
  }

  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      priceVal && (priceVal.textContent = UI.formatCurrency(parseInt(priceSlider.value)));
      applyFilters();
    });
  }

  [brandSelect, transSelect, categorySelect].forEach(el => {
    if (el) el.addEventListener('change', applyFilters);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (priceSlider) priceSlider.value = priceSlider.max;
      if (priceVal) priceVal.textContent = UI.formatCurrency(parseInt(priceSlider?.max || 10000));
      if (brandSelect) brandSelect.value = '';
      if (transSelect) transSelect.value = '';
      if (categorySelect) categorySelect.value = '';
      renderMarketplace();
    });
  }
}

function renderAccountView(session) {
  if (!session) return;

  const userBookings = DataStore.getBookings(null, session.id);
  const userChats    = DataStore.getChats(null, session.id);

  const bookingList = document.getElementById('myBookings');
  const chatList    = document.getElementById('myChatList');

  if (bookingList) {
    bookingList.innerHTML = userBookings.length ? userBookings.map(b => {
      const v = DataStore.getVehicleById(b.vehicle_id);
      const t = DataStore.getTenantById(b.tenant_id);
      return `
        <div class="glass-card p-4 mb-3 animate-fade-in">
          <div class="flex items-center gap-3">
            <div class="rental-img">
              <img
                src="${v?.image || '../static/images/default-car.jpg'}"
                  alt="${v ? v.brand + ' ' + v.model : 'Vehicle'}"
                      onerror="this.src='../static/images/default-car.jpg'">
              </div>            
              <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h4 style="font-size:0.95rem">${v ? v.brand + ' ' + v.model : 'Vehicle'}</h4>
                ${UI.statusBadge(b.status)}
              </div>
              <p class="text-xs text-muted">${t ? t.name : ''} · ${UI.formatDate(b.startDate)} → ${UI.formatDate(b.endDate)}</p>
            </div>
            <div class="text-right">
              <div style="font-family:var(--font-display);font-weight:700;color:var(--clr-text)">${UI.formatCurrency(b.totalAmount)}</div>
              <div class="text-xs text-muted">${b.totalDays} days · ${UI.statusBadge(b.paymentStatus)}</div>
            </div>
          </div>
        </div>
      `;
    }).join('') : '<p class="text-muted text-sm">No bookings yet.</p>';
  }

  if (chatList) {
    chatList.innerHTML = '';
    if (!userChats.length) {
      chatList.innerHTML = '<p class="text-muted text-sm">No support conversations yet.</p>';
      return;
    }

    // Show first chat by default
    renderUserChat(userChats[0].id);

    userChats.forEach(chat => {
      const tenant = DataStore.getTenantById(chat.tenant_id);
      const lastMsg = chat.messages[chat.messages.length - 1];
      const btn = document.createElement('div');
      btn.className = 'chat-thread-item';
      btn.dataset.chatId = chat.id;
      btn.innerHTML = `
        <div class="avatar avatar-sm" style="background:var(--clr-primary-muted);color:var(--clr-primary-light)">
          ${UI.getInitials(tenant ? tenant.name : 'CS')}
        </div>
        <div class="flex-1 min-h-0">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm font-medium truncate" style="color:var(--clr-text)">${tenant ? tenant.name : 'Support'}</span>
            <span class="text-xs text-muted">${lastMsg.time}</span>
          </div>
          <p class="text-xs text-muted truncate">${lastMsg.text.slice(0, 45)}…</p>
        </div>
        ${chat.unread ? `<span class="unread-badge">${chat.unread}</span>` : ''}
      `;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chat-thread-item').forEach(el => el.classList.remove('active'));
        btn.classList.add('active');
        renderUserChat(chat.id);
      });
      chatList.appendChild(btn);
    });
  }
}

function loadProfile(){

    const session = Session.get();

    if(!session) return;

    document.getElementById("profileName").value =
    session.name || "";

    document.getElementById("profileEmail").value =
    session.email || "";

    document.getElementById("profilePhone").value =
    session.phone || "";

    document.getElementById("profileAddress").value =
    session.address || "";
}

function renderUserChat(chatId) {
  DataStore.markChatRead(chatId);
  const chat = DataStore.getChatById(chatId);
  const window_ = document.getElementById('chatWindow');
  const inputArea= document.getElementById('chatInputArea');

  if (!chat || !window_) return;

  window_.innerHTML = chat.messages.map(m => `
    <div class="flex flex-col ${m.from === 'user' ? 'items-end' : 'items-start'} mb-3 animate-fade-in">
      <div class="chat-bubble ${m.from === 'user' ? 'outgoing' : 'incoming'}">${m.text}</div>
      <span class="chat-time">${m.time}</span>
    </div>
  `).join('');
  window_.scrollTop = window_.scrollHeight;

  if (inputArea) {
    inputArea.style.display = 'flex';
    inputArea.dataset.chatId = chatId;
  }
}

window.handleBooking = function(vehicleId) {
  const session = Session.get();
  if (!session || session.role !== 'renter') {
    UI.showToast('Please sign in to book a vehicle.', 'warning');
    setTimeout(() => window.location.href = 'login.html', 1200);
    return;
  }
  const v = DataStore.getVehicleById(vehicleId);
  UI.showToast(`Booking request for ${v.brand} ${v.model} sent! Our team will contact you.`, 'success');
};

// ─────────────────────────────────────────────
// § 8. PORTAL PAGE MODULE (Tenant Workspace)
// ─────────────────────────────────────────────

function initPortalPage() {
  const session = Session.get();
  if (!session || (!['tenant_admin', 'tenant_staff'].includes(session.role))) {
    window.location.href = 'login.html';
    return;
  }

  const tenantId = session.tenant_id;
  const tenant   = DataStore.getTenantById(tenantId);

  // Set tenant branding
  document.querySelectorAll('.tenant-name').forEach(el => el.textContent = tenant ? tenant.name : '');
  document.querySelectorAll('.portal-user-name').forEach(el => el.textContent = session.name);
  document.querySelectorAll('.portal-user-avatar').forEach(el => el.textContent = session.avatar);

  const logoutBtn = document.getElementById('portalLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout.bind(Auth));

  // Sidebar navigation
  document.querySelectorAll('[data-portal-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.portalView;
      document.querySelectorAll('[data-portal-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.portal-view').forEach(v => v.style.display = 'none');
      const el = document.getElementById('view_' + target);
      if (el) el.style.display = 'block';

      if (target === 'dashboard') renderPortalDashboard(tenantId);
      if (target === 'fleet')     renderPortalFleet(tenantId);
      if (target === 'bookings')  renderPortalBookings(tenantId);
      if (target === 'chat')      renderPortalChat(tenantId);
    });
  });

  // Default view
  renderPortalDashboard(tenantId);
}

function renderPortalDashboard(tenantId) {
  const metrics = DataStore.getTenantMetrics(tenantId);
  const m = {
    totalBookings: document.getElementById('m_totalBookings'),
    revenue:       document.getElementById('m_revenue'),
    active:        document.getElementById('m_active'),
    available:     document.getElementById('m_available'),
  };
  if (m.totalBookings) m.totalBookings.textContent = metrics.totalBookings;
  if (m.revenue)       m.revenue.textContent = UI.formatCurrency(metrics.grossRevenue);
  if (m.active)        m.active.textContent  = metrics.activeRentals;
  if (m.available)     m.available.textContent = `${metrics.availableVehicles}/${metrics.totalFleet}`;

  // Fleet chart
  const chartEl = document.getElementById('fleetChart');
  if (chartEl) {
    const vehicles = DataStore.getVehicles(tenantId);
    const avail = vehicles.filter(v => v.available).length;
    const rented = vehicles.length - avail;
    const pct = vehicles.length ? Math.round((avail / vehicles.length) * 100) : 0;
    chartEl.innerHTML = `
      <div style="display:flex;gap:2rem;align-items:center">
        <div style="position:relative;width:100px;height:100px">
          <svg viewBox="0 0 36 36" style="transform:rotate(-90deg);width:100%;height:100%">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--clr-bg-3)" stroke-width="3"/>
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--clr-primary)" stroke-width="3"
              stroke-dasharray="${pct} ${100 - pct}" stroke-linecap="round"/>
          </svg>
          <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-weight:800;font-size:1.1rem;color:var(--clr-text)">${pct}%</div>
        </div>
        <div style="flex:1">
          <div class="flex items-center gap-2 mb-2">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--clr-primary);flex-shrink:0"></span>
            <span class="text-sm">Available — <strong style="color:var(--clr-text)">${avail}</strong></span>
          </div>
          <div class="flex items-center gap-2">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--clr-bg-3);border:1px solid var(--clr-border);flex-shrink:0"></span>
            <span class="text-sm">On Rent — <strong style="color:var(--clr-text)">${rented}</strong></span>
          </div>
        </div>
      </div>
    `;
  }

  // Recent bookings table
  const recentEl = document.getElementById('recentBookings');
  if (recentEl) {
    const bookings = DataStore.getBookings(tenantId).slice(0, 5);
    recentEl.innerHTML = bookings.map(b => {
      const v = DataStore.getVehicleById(b.vehicle_id);
      const u = DataStore.getUserById(b.user_id);
      return `
        <tr>
          <td><span class="font-mono text-xs text-muted">${b.id}</span></td>
          <td>${v ? v.brand + ' ' + v.model : '—'}</td>
          <td>${u ? u.name : '—'}</td>
          <td>${UI.formatDate(b.startDate)} → ${UI.formatDate(b.endDate)}</td>
          <td>${UI.formatCurrency(b.totalAmount)}</td>
          <td>${UI.statusBadge(b.status)}</td>
        </tr>
      `;
    }).join('');
  }
}

function renderPortalFleet(tenantId) {
  const fleetEl = document.getElementById('fleetGrid');
  if (!fleetEl) return;
  const vehicles = DataStore.getVehicles(tenantId);
  fleetEl.innerHTML = vehicles.map(v => `
    <div class="vehicle-card animate-fade-in">
<div class="vehicle-img">

    <img
    src="${v.image || '../static/images/default-car.jpg'}"
    class="vehicle-photo"
    alt="${v.brand} ${v.model}"
    onerror="this.src='../static/images/default-car.jpg'">

    <div class="vehicle-labels">

        <span class="badge badge-neutral">
            ${v.category}
        </span>

        ${UI.availabilityBadge(v.available)}

    </div>

</div>

<div class="vehicle-body">

    <h4 class="mb-1">
        ${v.brand} ${v.model}

        <span class="text-xs text-muted font-mono">
        ${v.year}
        </span>

    </h4>

    <p class="text-xs text-muted mb-2">
    Plate:
    <span class="font-mono">
    ${v.plate}
    </span>

    · ${v.mileage.toLocaleString()} km
    </p>

    <div class="flex gap-2 mb-3"
    style="flex-wrap:wrap">

        <span class="badge badge-neutral">
        ⚙️ ${v.transmission}
        </span>

        <span class="badge badge-neutral">
        ⛽ ${v.fuel}
        </span>

        <span class="badge badge-neutral">
        💺 ${v.seats}
        </span>

    </div>
        <div class="vehicle-price">${UI.formatCurrency(v.pricePerDay)}<sub>/day</sub></div>
      </div>
    </div>
  `).join('');
}

function renderPortalBookings(tenantId) {
  const el = document.getElementById('bookingsTableBody');
  if (!el) return;
  const bookings = DataStore.getBookings(tenantId);
  el.innerHTML = bookings.map(b => {
    const v = DataStore.getVehicleById(b.vehicle_id);
    const u = DataStore.getUserById(b.user_id);
    return `
      <tr>
        <td><span class="font-mono text-xs">${b.id}</span></td>
        <td>${v ? v.emoji + ' ' + v.brand + ' ' + v.model : '—'}</td>
        <td>
          <div class="flex items-center gap-2">
            <div class="avatar avatar-sm">${u ? u.avatar : '?'}</div>
            <span>${u ? u.name : '—'}</span>
          </div>
        </td>
        <td class="text-sm">${UI.formatDate(b.startDate)}</td>
        <td class="text-sm">${UI.formatDate(b.endDate)}</td>
        <td>${UI.formatCurrency(b.totalAmount)}</td>
        <td>${UI.statusBadge(b.paymentStatus)}</td>
        <td>${UI.statusBadge(b.status)}</td>
      </tr>
    `;
  }).join('');
}

let _portalActiveChatId = null;

function renderPortalChat(tenantId) {
  const threadList = document.getElementById('chatThreadList');
  if (!threadList) return;

  const chats = DataStore.getChats(tenantId);
  threadList.innerHTML = '';

  if (!chats.length) {
    threadList.innerHTML = '<p class="p-4 text-sm text-muted">No active conversations.</p>';
    return;
  }

  chats.forEach((chat, idx) => {
    const user = DataStore.getUserById(chat.user_id);
    const lastMsg = chat.messages[chat.messages.length - 1];
    const item = document.createElement('div');
    item.className = 'chat-thread-item';
    item.dataset.chatId = chat.id;
    item.innerHTML = `
      <div class="avatar avatar-md">${user ? user.avatar : '?'}</div>
      <div class="flex-1 min-h-0">
        <div class="flex items-center justify-between mb-1">
          <span class="font-medium text-sm" style="color:var(--clr-text)">${user ? user.name : 'Unknown'}</span>
          <span class="text-xs text-muted">${lastMsg.time}</span>
        </div>
        <p class="text-xs text-muted truncate">${lastMsg.text.slice(0, 42)}…</p>
      </div>
      ${chat.unread ? `<span class="unread-badge">${chat.unread}</span>` : ''}
    `;
    item.addEventListener('click', () => {
      document.querySelectorAll('.chat-thread-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      // Remove unread badge
      const badge = item.querySelector('.unread-badge');
      if (badge) badge.remove();
      DataStore.markChatRead(chat.id);
      _portalActiveChatId = chat.id;
      renderPortalChatMessages(chat.id);
      renderPortalBookingContext(chat.booking_id, chat.user_id);
    });
    threadList.appendChild(item);

    if (idx === 0) {
      item.click();
    }
  });
}

function renderPortalChatMessages(chatId) {
  const msgEl = document.getElementById('portalChatMessages');
  if (!msgEl) return;
  const chat = DataStore.getChatById(chatId);
  if (!chat) return;

  msgEl.innerHTML = chat.messages.map(m => `
    <div class="flex flex-col ${m.from === 'agent' ? 'items-end' : 'items-start'} mb-3 animate-fade-in">
      <div class="chat-bubble ${m.from === 'agent' ? 'outgoing' : 'incoming'}">${m.text}</div>
      <span class="chat-time">${m.time}</span>
    </div>
  `).join('');

  msgEl.scrollTop = msgEl.scrollHeight;
}

function renderPortalBookingContext(bookingId, userId) {
  const ctx = document.getElementById('bookingContext');
  if (!ctx) return;

  const booking = DataStore.getBookingById(bookingId);
  const user    = DataStore.getUserById(userId);
  const vehicle = booking ? DataStore.getVehicleById(booking.vehicle_id) : null;

  if (!booking || !user || !vehicle) {
    ctx.innerHTML = '<p class="text-muted text-sm p-4">No booking context available.</p>';
    return;
  }

  ctx.innerHTML = `
    <div class="animate-fade-in">
      <div class="flex items-center gap-3 mb-4">
        <div style="font-size:2.5rem">${vehicle.emoji}</div>
        <div>
          <h4>${vehicle.brand} ${vehicle.model}</h4>
          <p class="text-xs text-muted">${vehicle.year} · ${vehicle.fuel} · ${vehicle.transmission}</p>
        </div>
      </div>
      <div class="surface p-3 mb-3" style="border-radius:var(--radius-md)">
        <p class="text-xs text-muted mb-2 font-medium" style="text-transform:uppercase;letter-spacing:0.06em">Lease Dates</p>
        <p class="text-sm" style="color:var(--clr-text)">${UI.formatDate(booking.startDate)} → ${UI.formatDate(booking.endDate)}</p>
        <p class="text-xs text-muted">${booking.totalDays} days</p>
      </div>
      <div class="surface p-3 mb-3" style="border-radius:var(--radius-md)">
        <p class="text-xs text-muted mb-2 font-medium" style="text-transform:uppercase;letter-spacing:0.06em">Payment</p>
        <p style="font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:var(--clr-text)">${UI.formatCurrency(booking.totalAmount)}</p>
        <div class="mt-1">${UI.statusBadge(booking.paymentStatus)}</div>
      </div>
      <div class="surface p-3 mb-3" style="border-radius:var(--radius-md)">
        <p class="text-xs text-muted mb-2 font-medium" style="text-transform:uppercase;letter-spacing:0.06em">Customer</p>
        <div class="flex items-center gap-2 mb-1">
          <div class="avatar avatar-sm">${user.avatar}</div>
          <span class="text-sm" style="color:var(--clr-text)">${user.name}</span>
        </div>
        <p class="text-xs text-muted">${user.email}</p>
        <p class="text-xs text-muted">${user.phone}</p>
      </div>
      <div class="surface p-3" style="border-radius:var(--radius-md)">
        <p class="text-xs text-muted mb-2 font-medium" style="text-transform:uppercase;letter-spacing:0.06em">License Status</p>
        ${UI.statusBadge(user.license_status)}
      </div>
      <div class="mt-3">
        <p class="text-xs text-muted mb-1 font-mono">Booking ID</p>
        <span class="badge badge-neutral font-mono">${booking.id}</span>
      </div>
    </div>
  `;
}

// ─────────────────────────────────────────────
// § 9. ADMIN PAGE MODULE
// ─────────────────────────────────────────────

function initAdminPage() {
  // Security: check URL param AND session key
  const params = new URLSearchParams(window.location.search);
  const urlKey = params.get('key');

  if (!Session.isAdmin() || urlKey !== Session.ADMIN_SECRET_KEY) {
    // Fail-secure: render 404
    document.body.innerHTML = `
      <div class="page-404">
        <div class="code-404">404</div>
        <h3 style="color:#555;font-family:var(--font-mono)">Page Not Found</h3>
        <p style="color:#444;font-size:0.875rem">The resource you requested does not exist.</p>
        <a href="login.html" style="color:#555;font-size:0.8rem;text-decoration:underline;margin-top:1rem">← Return home</a>
      </div>
    `;
    return;
  }

  const session = Session.get();
  document.querySelectorAll('.admin-user-name').forEach(el => el.textContent = session.name);
  document.querySelectorAll('.admin-user-avatar').forEach(el => el.textContent = session.avatar);

  const logoutBtn = document.getElementById('adminLogout');
  if (logoutBtn) logoutBtn.addEventListener('click', Auth.logout.bind(Auth));

  // Sidebar nav
  document.querySelectorAll('[data-admin-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-admin-view]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.admin-view').forEach(v => v.style.display = 'none');
      const el = document.getElementById('aview_' + btn.dataset.adminView);
      if (el) el.style.display = 'block';
    });
  });

  renderAdminDashboard();
  renderAdminUsers();
  renderAdminTenants();
}

function renderAdminDashboard() {
  const m = DataStore.getGlobalMetrics();

  const fields = {
    adm_tenants:  m.totalTenants,
    adm_users:    m.totalUsers,
    adm_vehicles: m.totalVehicles,
    adm_bookings: m.totalBookings,
    adm_revenue:  UI.formatCurrency(m.totalRevenue),
    adm_saas:     UI.formatCurrency(m.saasRevenue),
    adm_sub:      UI.formatCurrency(m.subRevenue),
  };

  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  });

  // Tenant subscription bars
  const subEl = document.getElementById('tenantSubBars');
  if (subEl) {
    const maxRev = Math.max(...DB.tenants.map(t => t.subscriptionRevenue));
    subEl.innerHTML = DB.tenants.map(t => `
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm" style="color:var(--clr-text)">${t.name}</span>
          <span class="text-sm font-display font-bold" style="color:var(--clr-text)">${UI.formatCurrency(t.subscriptionRevenue)}/mo</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.round((t.subscriptionRevenue/maxRev)*100)}%"></div>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span class="badge badge-neutral" style="font-size:0.65rem">${t.plan}</span>
          <span class="badge badge-success" style="font-size:0.65rem">${t.status}</span>
        </div>
      </div>
    `).join('');
  }

  // Booking distribution by tenant
  const bookingDistEl = document.getElementById('bookingDist');
  if (bookingDistEl) {
    const tenantBookings = DB.tenants.map(t => ({
      name: t.name,
      count: DB.bookings.filter(b => b.tenant_id === t.id).length,
      rev: DB.bookings.filter(b => b.tenant_id === t.id).reduce((s, b) => s + b.totalAmount, 0)
    }));
    const maxCount = Math.max(...tenantBookings.map(t => t.count), 1);
    bookingDistEl.innerHTML = tenantBookings.map(t => `
      <div class="mb-4">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm" style="color:var(--clr-text)">${t.name}</span>
          <span class="text-sm text-muted">${t.count} bookings · ${UI.formatCurrency(t.rev)}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${Math.round((t.count/maxCount)*100)}%;background:var(--clr-primary)"></div>
        </div>
      </div>
    `).join('');
  }
}

function renderAdminUsers() {
  const el = document.getElementById('adminUsersTable');
  if (!el) return;
  el.innerHTML = DB.users.map(u => `
    <tr>
      <td>
        <div class="flex items-center gap-2">
          <div class="avatar avatar-sm">${u.avatar}</div>
          <span style="color:var(--clr-text)">${u.name}</span>
        </div>
      </td>
      <td class="text-sm">${u.email}</td>
      <td>${UI.roleBadge(u.role, u.tenant_id)}</td>
      <td>${UI.statusBadge(u.license_status)}</td>
      <td class="text-xs text-muted">${UI.formatDate(u.joinDate)}</td>
    </tr>
  `).join('');
}

function renderAdminTenants() {
  const el = document.getElementById('adminTenantsTable');
  if (!el) return;
  el.innerHTML = DB.tenants.map(t => {
    const staffCount = DB.users.filter(u => u.tenant_id === t.id).length;
    const bookCount  = DB.bookings.filter(b => b.tenant_id === t.id).length;
    const vehCount   = DB.vehicles.filter(v => v.tenant_id === t.id).length;
    return `
      <tr>
        <td>
          <div class="flex items-center gap-2">
            <div class="avatar avatar-sm" style="background:var(--clr-primary-muted)">
              ${UI.getInitials(t.name)}
            </div>
            <div>
              <div style="color:var(--clr-text);font-size:0.875rem">${t.name}</div>
              <div class="text-xs text-muted">${t.tagline}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-neutral font-mono">${t.key}</span></td>
        <td><span class="badge badge-primary">${t.plan}</span></td>
        <td>${staffCount} staff</td>
        <td>${vehCount} vehicles</td>
        <td>${bookCount} bookings</td>
        <td><span class="font-display font-bold text-sm" style="color:var(--clr-text)">${UI.formatCurrency(t.subscriptionRevenue)}/mo</span></td>
        <td>${UI.statusBadge(t.status)}</td>
      </tr>
    `;
  }).join('');
}

// ─────────────────────────────────────────────
// § 10. SHARED CHAT SEND HANDLER
// ─────────────────────────────────────────────

function initChatSend(inputId, sendId, windowId, chatIdFn, fromRole = 'user') {
  const input = document.getElementById(inputId);
  const sendBtn = document.getElementById(sendId);
  const msgWindow = document.getElementById(windowId);

  function sendMessage() {
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const chatId = typeof chatIdFn === 'function' ? chatIdFn() : chatIdFn;
    if (!chatId) { UI.showToast('No conversation selected.', 'warning'); return; }

    DataStore.sendMessage(chatId, text, fromRole);
    input.value = '';

    const bubble = document.createElement('div');
    bubble.className = `flex flex-col ${fromRole === 'user' ? 'items-end' : 'items-start'} mb-3 animate-fade-in`;
    const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `
      <div class="chat-bubble ${fromRole === 'user' ? 'outgoing' : 'incoming'}">${text}</div>
      <span class="chat-time">${now}</span>
    `;
    if (msgWindow) {
      msgWindow.appendChild(bubble);
      msgWindow.scrollTop = msgWindow.scrollHeight;
    }

    // Simulate reply after delay (in portal, agent is sending so no auto-reply)
    if (fromRole === 'user') {
      const typing = document.createElement('div');
      typing.className = 'flex items-start mb-3';
      typing.innerHTML = `<div class="typing-indicator"><span></span><span></span><span></span></div>`;
      if (msgWindow) {
        msgWindow.appendChild(typing);
        msgWindow.scrollTop = msgWindow.scrollHeight;
      }
      setTimeout(() => {
        if (msgWindow) msgWindow.removeChild(typing);
        const reply = DataStore.sendMessage(chatId, 'Thank you for your message! Our team will get back to you shortly. 😊', 'agent');
        const replyBubble = document.createElement('div');
        replyBubble.className = 'flex flex-col items-start mb-3 animate-fade-in';
        replyBubble.innerHTML = `
          <div class="chat-bubble incoming">${reply.text}</div>
          <span class="chat-time">${reply.time}</span>
        `;
        if (msgWindow) {
          msgWindow.appendChild(replyBubble);
          msgWindow.scrollTop = msgWindow.scrollHeight;
        }
      }, 2000);
    }
  }

  if (sendBtn) sendBtn.addEventListener('click', sendMessage);
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    });
  }
}

// ─────────────────────────────────────────────
// § 11. PAGE AUTO-DETECTION & INIT
// ─────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'login.html' || page === '') {
    initLoginPage();
  } else if (page === 'index.html') {
    initIndexPage();
    // User chat send
    initChatSend('userChatInput', 'userChatSend', 'chatWindow',
      () => document.getElementById('chatInputArea')?.dataset.chatId, 'user');
  } else if (page === 'portal.html') {
    initPortalPage();
    // Portal agent chat send
    initChatSend('portalChatInput', 'portalChatSend', 'portalChatMessages',
      () => _portalActiveChatId, 'agent');
  } else if (page === 'admin.html') {
    initAdminPage();
  }
});