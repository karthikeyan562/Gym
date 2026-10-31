// ===================================================================
// CORELY / IRONPULSE API CLIENT WITH HYBRID BACKEND & PERSISTENT MOCK
// Seamless auto-switch: Uses Spring Boot when online, MockStore when offline
// ===================================================================

import { MockStore } from './mockData';

const API_BASE_URL = 'http://localhost:8080/api';

export const getAuthToken = () => {
  let token = localStorage.getItem('corely_token') || localStorage.getItem('ironpulse_token');
  if (!token) {
    // Default active session for Alex Johnson
    token = 'corely-jwt-session-token';
    localStorage.setItem('corely_token', token);
  }
  return token;
};

export const setAuthToken = (token) => {
  localStorage.setItem('corely_token', token);
  localStorage.setItem('ironpulse_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('corely_token');
  localStorage.removeItem('ironpulse_token');
  localStorage.removeItem('corely_user');
  localStorage.removeItem('ironpulse_user');
};

export const getStoredUser = () => {
  const user = localStorage.getItem('corely_user') || localStorage.getItem('ironpulse_user');
  try {
    return user ? JSON.parse(user) : {
      id: 1,
      fullName: 'Alex Johnson',
      username: 'alex',
      email: 'alex.johnson@corely.com',
      role: 'ROLE_ADMIN',
      joiningDate: 'Jan 2024'
    };
  } catch {
    return {
      id: 1,
      fullName: 'Alex Johnson',
      username: 'alex',
      email: 'alex.johnson@corely.com',
      role: 'ROLE_ADMIN',
      joiningDate: 'Jan 2024'
    };
  }
};

export const setStoredUser = (user) => {
  localStorage.setItem('corely_user', JSON.stringify(user));
  localStorage.setItem('ironpulse_user', JSON.stringify(user));
};

async function apiRequest(endpoint, options = {}, mockFallback = null) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.status === 401) {
      if (mockFallback) return mockFallback();
      removeAuthToken();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || `Server error: ${res.status}`);
    }
    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (mockFallback) {
      // Graceful offline mock fallback
      return mockFallback();
    }
    throw err;
  }
}

export const api = {
  // Auth
  login: async (credentials) => {
    try {
      return await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    } catch {
      // Mock login fallback
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        return {
          token: 'corely-jwt-session-token',
          id: 1,
          username: 'admin',
          fullName: 'Alex Johnson',
          email: 'admin@corely.com',
          role: 'ROLE_ADMIN'
        };
      }
      throw new Error('Invalid credentials. Default is admin / admin123');
    }
  },

  checkHealth: () => apiRequest('/auth/status', {}, () => ({ status: 'UP' })),

  // Dashboard
  getDashboardStats: () => apiRequest('/dashboard/stats', {}, () => MockStore.getDashboardStats()),

  // Members
  getMembers: (query = '') => apiRequest(`/members${query ? `?query=${encodeURIComponent(query)}` : ''}`, {}, () => MockStore.getMembers(query)),
  getMemberById: (id) => apiRequest(`/members/${id}`, {}, () => MockStore.getMemberById(id)),
  createMember: (memberData) => apiRequest('/members', { method: 'POST', body: JSON.stringify(memberData) }, () => MockStore.createMember(memberData)),
  updateMember: (id, memberData) => apiRequest(`/members/${id}`, { method: 'PUT', body: JSON.stringify(memberData) }, () => MockStore.updateMember(id, memberData)),
  deleteMember: (id) => apiRequest(`/members/${id}`, { method: 'DELETE' }, () => MockStore.deleteMember(id)),

  // Subscriptions & Plans
  getSubscriptions: (status = '', memberId = null) => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (memberId) params.append('memberId', memberId);
    const qs = params.toString();
    return apiRequest(`/subscriptions${qs ? `?${qs}` : ''}`, {}, () => MockStore.getSubscriptions(status, memberId));
  },
  getPlans: () => apiRequest('/subscriptions/plans', {}, () => MockStore.getPlans()),
  createPlan: (plan) => apiRequest('/subscriptions/plans', { method: 'POST', body: JSON.stringify(plan) }, () => plan),
  getExpiringSoon: (days = 7) => apiRequest(`/subscriptions/expiring-soon?days=${days}`, {}, () => MockStore.getExpiringSoon()),
  assignSubscription: (subData) => apiRequest('/subscriptions/assign', { method: 'POST', body: JSON.stringify(subData) }, () => MockStore.assignSubscription(subData)),
  renewSubscription: (id, renewData) => apiRequest(`/subscriptions/${id}/renew`, { method: 'PUT', body: JSON.stringify(renewData) }, () => MockStore.renewSubscription(id, renewData)),
  deleteSubscription: (id) => apiRequest(`/subscriptions/${id}`, { method: 'DELETE' }, () => MockStore.deleteSubscription(id)),

  // Trainers
  getTrainers: () => apiRequest('/trainers', {}, () => MockStore.getTrainers()),
  getTrainerById: (id) => apiRequest(`/trainers/${id}`, {}, () => MockStore.getTrainers().find(t => t.id === Number(id))),
  createTrainer: (trainer) => apiRequest('/trainers', { method: 'POST', body: JSON.stringify(trainer) }, () => MockStore.createTrainer(trainer)),
  updateTrainer: (id, trainer) => apiRequest(`/trainers/${id}`, { method: 'PUT', body: JSON.stringify(trainer) }, () => MockStore.updateTrainer(id, trainer)),
  deleteTrainer: (id) => apiRequest(`/trainers/${id}`, { method: 'DELETE' }, () => MockStore.deleteTrainer(id)),

  // Training Sessions
  getSessions: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.trainerId) params.append('trainerId', filters.trainerId);
    if (filters.memberId) params.append('memberId', filters.memberId);
    if (filters.date) params.append('date', filters.date);
    const qs = params.toString();
    return apiRequest(`/sessions${qs ? `?${qs}` : ''}`, {}, () => MockStore.getSessions(filters));
  },
  scheduleSession: (sessionData) => apiRequest('/sessions', { method: 'POST', body: JSON.stringify(sessionData) }, () => MockStore.scheduleSession(sessionData)),
  updateSession: (id, sessionData) => apiRequest(`/sessions/${id}`, { method: 'PUT', body: JSON.stringify(sessionData) }, () => MockStore.updateSession(id, sessionData)),
  deleteSession: (id) => apiRequest(`/sessions/${id}`, { method: 'DELETE' }, () => MockStore.deleteSession(id)),

  // Equipment
  getEquipment: (condition = '') => apiRequest(`/equipment${condition ? `?condition=${condition}` : ''}`, {}, () => MockStore.getEquipment(condition)),
  getEquipmentNeedingRepair: () => apiRequest('/equipment/needing-repair', {}, () => MockStore.getEquipment().filter(e => e.equipmentCondition !== 'GOOD')),
  getEquipmentById: (id) => apiRequest(`/equipment/${id}`, {}, () => MockStore.getEquipment().find(e => e.id === Number(id))),
  createEquipment: (eqData) => apiRequest('/equipment', { method: 'POST', body: JSON.stringify(eqData) }, () => MockStore.createEquipment(eqData)),
  updateEquipment: (id, eqData) => apiRequest(`/equipment/${id}`, { method: 'PUT', body: JSON.stringify(eqData) }, () => MockStore.updateEquipment(id, eqData)),
  deleteEquipment: (id) => apiRequest(`/equipment/${id}`, { method: 'DELETE' }, () => MockStore.deleteEquipment(id)),

  // Maintenance
  getMaintenance: (equipmentId = null) => apiRequest(`/maintenance${equipmentId ? `?equipmentId=${equipmentId}` : ''}`, {}, () => MockStore.getMaintenance(equipmentId)),
  addMaintenanceRecord: (record) => apiRequest('/maintenance', { method: 'POST', body: JSON.stringify(record) }, () => MockStore.addMaintenanceRecord(record)),
  deleteMaintenance: (id) => apiRequest(`/maintenance/${id}`, { method: 'DELETE' }, () => MockStore.deleteMaintenance(id)),

  // Payments
  getPayments: (memberId = null) => apiRequest(`/payments${memberId ? `?memberId=${memberId}` : ''}`, {}, () => MockStore.getPayments(memberId)),
  recordPayment: (paymentData) => apiRequest('/payments', { method: 'POST', body: JSON.stringify(paymentData) }, () => MockStore.recordPayment(paymentData)),

  // Reports
  getReports: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const qs = params.toString();
    return apiRequest(`/reports${qs ? `?${qs}` : ''}`, {}, () => MockStore.getReports(startDate, endDate));
  }
};
