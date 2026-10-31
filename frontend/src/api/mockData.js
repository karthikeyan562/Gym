// ===================================================================
// CORELY / IRONPULSE LOCAL STORAGE PERSISTENT STORE
// Guarantees 100% functionality even when offline or backend is down
// ===================================================================

const STORAGE_KEYS = {
  MEMBERS: 'corely_members_v2',
  PLANS: 'corely_plans_v2',
  SUBSCRIPTIONS: 'corely_subscriptions_v2',
  TRAINERS: 'corely_trainers_v2',
  SESSIONS: 'corely_sessions_v2',
  EQUIPMENT: 'corely_equipment_v2',
  MAINTENANCE: 'corely_maintenance_v2',
  PAYMENTS: 'corely_payments_v2',
  TODAY_WORKOUTS: 'corely_today_workouts_v2',
  HYDRATION: 'corely_hydration_v2',
  WORKOUT_STATE: 'corely_workout_state_v2',
};

const DEFAULT_MEMBERS = [
  {
    id: 1,
    memberCode: 'GYM-1001',
    fullName: 'Alexander Hayes',
    email: 'alex.hayes@example.com',
    phoneNumber: '+1 555-234-8901',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    age: 29,
    gender: 'Male',
    address: '742 Evergreen Terrace, Springfield',
    emergencyContact: 'Sarah Hayes (+1 555-901-2345)',
    joiningDate: '2026-07-28',
    membershipStatus: 'ACTIVE'
  },
  {
    id: 2,
    memberCode: 'GYM-1002',
    fullName: 'Sophia Rodriguez',
    email: 'sophia.r@example.com',
    phoneNumber: '+1 555-782-3419',
    profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    age: 27,
    gender: 'Female',
    address: '1088 Ocean Drive, Miami Beach, FL',
    emergencyContact: 'Carlos Rodriguez (+1 555-882-9901)',
    joiningDate: '2026-10-04',
    membershipStatus: 'ACTIVE'
  },
  {
    id: 3,
    memberCode: 'GYM-1003',
    fullName: 'Marcus Sterling',
    email: 'marcus.sterling@example.com',
    phoneNumber: '+1 555-431-7720',
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    age: 34,
    gender: 'Male',
    address: '350 5th Ave, New York, NY',
    emergencyContact: 'Jessica Sterling (+1 555-431-7721)',
    joiningDate: '2026-06-30',
    membershipStatus: 'EXPIRED'
  },
  {
    id: 4,
    memberCode: 'GYM-1004',
    fullName: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phoneNumber: '+1 555-667-1129',
    profilePhoto: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    age: 25,
    gender: 'Female',
    address: '42 Wallaby Way, Sydney',
    emergencyContact: 'Dmitri Rostov (+1 555-667-1130)',
    joiningDate: '2026-08-30',
    membershipStatus: 'ACTIVE'
  },
  {
    id: 5,
    memberCode: 'GYM-1005',
    fullName: 'David Chen',
    email: 'david.chen@example.com',
    phoneNumber: '+1 555-901-4432',
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    age: 31,
    gender: 'Male',
    address: '88 Market St, San Francisco, CA',
    emergencyContact: 'Linda Chen (+1 555-901-4433)',
    joiningDate: '2026-09-15',
    membershipStatus: 'ACTIVE'
  },
  {
    id: 6,
    memberCode: 'GYM-1006',
    fullName: 'Jessica Miller',
    email: 'jessica.m@example.com',
    phoneNumber: '+1 555-882-1405',
    profilePhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    age: 28,
    gender: 'Female',
    address: '1240 Sunset Blvd, Los Angeles, CA',
    emergencyContact: 'Paul Miller (+1 555-882-1406)',
    joiningDate: '2026-10-01',
    membershipStatus: 'ACTIVE'
  }
];

const DEFAULT_PLANS = [
  { id: 1, planName: 'Monthly Plan', durationMonths: 1, amount: 49.99, description: 'Flexible 30-day all-access membership' },
  { id: 2, planName: 'Quarterly Plan', durationMonths: 3, amount: 129.99, description: '3 months full fitness & recovery access' },
  { id: 3, planName: 'Half-Yearly Plan', durationMonths: 6, amount: 229.99, description: '6 months athlete tier with free trainer check-ins' },
  { id: 4, planName: 'Annual Plan', durationMonths: 12, amount: 399.99, description: '12 months VIP access with sauna and guest passes' }
];

const DEFAULT_SUBSCRIPTIONS = [
  { id: 1, member: DEFAULT_MEMBERS[0], plan: DEFAULT_PLANS[3], planName: 'Annual Plan', startDate: '2026-07-28', expiryDate: '2027-07-28', amount: 399.99, paymentStatus: 'PAID', status: 'ACTIVE' },
  { id: 2, member: DEFAULT_MEMBERS[1], plan: DEFAULT_PLANS[0], planName: 'Monthly Plan', startDate: '2026-10-04', expiryDate: '2026-11-04', amount: 49.99, paymentStatus: 'PAID', status: 'EXPIRING_SOON' },
  { id: 3, member: DEFAULT_MEMBERS[2], plan: DEFAULT_PLANS[1], planName: 'Quarterly Plan', startDate: '2026-06-30', expiryDate: '2026-09-30', amount: 129.99, paymentStatus: 'PAID', status: 'EXPIRED' },
  { id: 4, member: DEFAULT_MEMBERS[3], plan: DEFAULT_PLANS[2], planName: 'Half-Yearly Plan', startDate: '2026-08-30', expiryDate: '2027-02-28', amount: 229.99, paymentStatus: 'PAID', status: 'ACTIVE' },
  { id: 5, member: DEFAULT_MEMBERS[4], plan: DEFAULT_PLANS[0], planName: 'Monthly Plan', startDate: '2026-09-15', expiryDate: '2026-10-15', amount: 49.99, paymentStatus: 'PAID', status: 'ACTIVE' },
  { id: 6, member: DEFAULT_MEMBERS[5], plan: DEFAULT_PLANS[0], planName: 'Monthly Plan', startDate: '2026-10-01', expiryDate: '2026-11-01', amount: 49.99, paymentStatus: 'PAID', status: 'EXPIRING_SOON' }
];

const DEFAULT_TRAINERS = [
  {
    id: 1,
    name: 'Viktor Kane',
    email: 'viktor.kane@corelygym.com',
    phoneNumber: '+1 555-112-9988',
    profilePhoto: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
    specialization: 'Strength & Conditioning',
    experienceYears: 8,
    salary: 4800.0,
    hireDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Samantha Drake',
    email: 'samantha.drake@corelygym.com',
    phoneNumber: '+1 555-334-1122',
    profilePhoto: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=400&auto=format&fit=crop&q=80',
    specialization: 'CrossFit & HIIT',
    experienceYears: 6,
    salary: 4400.0,
    hireDate: '2023-05-10'
  },
  {
    id: 3,
    name: 'Marcus Brody',
    email: 'marcus.brody@corelygym.com',
    phoneNumber: '+1 555-776-5544',
    profilePhoto: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&auto=format&fit=crop&q=80',
    specialization: 'Bodybuilding & Hypertrophy',
    experienceYears: 10,
    salary: 5200.0,
    hireDate: '2022-03-01'
  },
  {
    id: 4,
    name: 'Aria Thorne',
    email: 'aria.thorne@corelygym.com',
    phoneNumber: '+1 555-889-4433',
    profilePhoto: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
    specialization: 'Mobility, Core & Recovery',
    experienceYears: 5,
    salary: 4100.0,
    hireDate: '2024-02-18'
  }
];

const DEFAULT_SESSIONS = [
  {
    id: 1,
    member: DEFAULT_MEMBERS[0],
    trainer: DEFAULT_TRAINERS[0],
    trainingDate: '2026-10-31',
    startTime: '09:00:00',
    endTime: '10:00:00',
    sessionStatus: 'SCHEDULED',
    notes: 'Upper body power development'
  },
  {
    id: 2,
    member: DEFAULT_MEMBERS[1],
    trainer: DEFAULT_TRAINERS[1],
    trainingDate: '2026-10-31',
    startTime: '10:30:00',
    endTime: '11:30:00',
    sessionStatus: 'SCHEDULED',
    notes: 'HIIT metabolic conditioning & kettlebell drills'
  },
  {
    id: 3,
    member: DEFAULT_MEMBERS[3],
    trainer: DEFAULT_TRAINERS[3],
    trainingDate: '2026-10-30',
    startTime: '16:00:00',
    endTime: '17:00:00',
    sessionStatus: 'COMPLETED',
    notes: 'Hip mobility & posterior chain activation'
  },
  {
    id: 4,
    member: DEFAULT_MEMBERS[4],
    trainer: DEFAULT_TRAINERS[2],
    trainingDate: '2026-10-30',
    startTime: '18:00:00',
    endTime: '19:00:00',
    sessionStatus: 'SCHEDULED',
    notes: 'Chest and shoulders hypertrophy'
  }
];

const DEFAULT_EQUIPMENT = [
  {
    id: 1,
    equipmentName: 'Matrix Commercial Treadmill T70',
    category: 'Cardio',
    serialNumber: 'MTX-TR-9021',
    purchaseDate: '2024-03-12',
    cost: 4500.0,
    equipmentCondition: 'GOOD',
    location: 'Cardio Deck - Floor 1',
    notes: 'Touchscreen console & Bluetooth telemetry'
  },
  {
    id: 2,
    equipmentName: 'Hammer Strength Olympic Bench Press',
    category: 'Free Weights',
    serialNumber: 'HS-BP-1044',
    purchaseDate: '2023-08-20',
    cost: 1850.0,
    equipmentCondition: 'GOOD',
    location: 'Powerlifting Zone',
    notes: 'Competition grade vinyl upholstery'
  },
  {
    id: 3,
    equipmentName: 'Life Fitness Dual Cable Crossover',
    category: 'Cable Machines',
    serialNumber: 'LF-CC-5502',
    purchaseDate: '2023-11-05',
    cost: 5200.0,
    equipmentCondition: 'NEEDS_REPAIR',
    location: 'Main Gym Floor - Zone B',
    notes: 'Left pulley cable showing friction wear'
  },
  {
    id: 4,
    equipmentName: 'Cybex 45-Degree Plate-Loaded Leg Press',
    category: 'Strength Machines',
    serialNumber: 'CYB-LP-7719',
    purchaseDate: '2024-01-14',
    cost: 3800.0,
    equipmentCondition: 'GOOD',
    location: 'Lower Body Zone',
    notes: 'Heavy duty carriage with smooth roller bearings'
  },
  {
    id: 5,
    equipmentName: 'Rogue Competition Bumper Plates & Barbells',
    category: 'Free Weights',
    serialNumber: 'ROG-BP-3301',
    purchaseDate: '2024-05-18',
    cost: 2900.0,
    equipmentCondition: 'GOOD',
    location: 'Olympic Weightlifting Platforms',
    notes: 'Color coded IWF spec bumper sets'
  },
  {
    id: 6,
    equipmentName: 'Commercial Urethane Dumbbell Set (5kg - 50kg)',
    category: 'Free Weights',
    serialNumber: 'DMB-ST-0012',
    purchaseDate: '2023-06-10',
    cost: 6500.0,
    equipmentCondition: 'GOOD',
    location: 'Dumbbell Wall',
    notes: '3-tier heavy-duty saddle rack'
  },
  {
    id: 7,
    equipmentName: 'Concept2 RowErg Model D',
    category: 'Cardio',
    serialNumber: 'C2-ROW-4410',
    purchaseDate: '2024-02-22',
    cost: 1250.0,
    equipmentCondition: 'UNDER_MAINTENANCE',
    location: 'CrossFit Studio',
    notes: 'PM5 monitor sensor recalibration in progress'
  }
];

const DEFAULT_MAINTENANCE = [
  {
    id: 1,
    equipment: DEFAULT_EQUIPMENT[2],
    serviceDate: '2026-10-25',
    maintenanceDate: '2026-10-25',
    technicianName: 'Mike Vance (Apex Gym Tech)',
    maintenanceCost: 180.0,
    cost: 180.0,
    description: 'Replacing frayed aircraft-grade cable on left pulley tower',
    resolutionNotes: 'Parts on order, expected delivery in 2 business days',
    status: 'IN_PROGRESS'
  },
  {
    id: 2,
    equipment: DEFAULT_EQUIPMENT[0],
    serviceDate: '2026-09-30',
    maintenanceDate: '2026-09-30',
    technicianName: 'Sarah Jenkins (FitServe Pro)',
    maintenanceCost: 250.0,
    cost: 250.0,
    description: 'Quarterly deck lubrication and motor belt tension adjustment',
    resolutionNotes: 'Inspection passed. Speed calibration certified.',
    status: 'COMPLETED'
  }
];

const DEFAULT_PAYMENTS = [
  {
    id: 1,
    invoiceNumber: 'INV-2026-001',
    member: DEFAULT_MEMBERS[0],
    amount: 399.99,
    paymentDate: '2026-07-28',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Annual Membership initial payment'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2026-002',
    member: DEFAULT_MEMBERS[1],
    amount: 49.99,
    paymentDate: '2026-10-04',
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    notes: 'Monthly Membership renewal'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2026-003',
    member: DEFAULT_MEMBERS[2],
    amount: 129.99,
    paymentDate: '2026-06-30',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Quarterly Membership'
  },
  {
    id: 4,
    invoiceNumber: 'INV-2026-004',
    member: DEFAULT_MEMBERS[3],
    amount: 229.99,
    paymentDate: '2026-08-30',
    paymentMethod: 'CASH',
    paymentStatus: 'PAID',
    notes: 'Half-Yearly Membership fee'
  },
  {
    id: 5,
    invoiceNumber: 'INV-2026-005',
    member: DEFAULT_MEMBERS[4],
    amount: 49.99,
    paymentDate: '2026-10-18',
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    notes: 'Monthly membership'
  }
];

export const DEFAULT_TODAY_WORKOUTS = [
  { id: 'bench', name: 'Bench Press', setsReps: '4 × 10', weight: '80 kg', completed: true, muscle: 'chest', video: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600' },
  { id: 'shoulder', name: 'Shoulder Press', setsReps: '3 × 12', weight: '24 kg', completed: true, muscle: 'shoulders', video: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600' },
  { id: 'lat', name: 'Lat Pulldown', setsReps: '4 × 10', weight: '65 kg', completed: false, muscle: 'lats', video: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600' },
  { id: 'bicep', name: 'Bicep Curl', setsReps: '3 × 12', weight: '18 kg', completed: false, muscle: 'biceps', video: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600' }
];

// Helper to get or initialize stored data
function getStoredItem(key, defaultData) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item);
  } catch {
    return defaultData;
  }
}

function setStoredItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`LocalStorage write error for ${key}:`, e);
  }
}

export const MockStore = {
  // Members
  getMembers: (query = '') => {
    const list = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    if (!query) return list;
    const q = query.toLowerCase().trim();
    return list.filter(m =>
      (m.fullName && m.fullName.toLowerCase().includes(q)) ||
      (m.memberCode && m.memberCode.toLowerCase().includes(q)) ||
      (m.phoneNumber && m.phoneNumber.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q))
    );
  },
  getMemberById: (id) => {
    const list = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    return list.find(m => m.id === Number(id)) || null;
  },
  createMember: (data) => {
    const list = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const newId = list.length > 0 ? Math.max(...list.map(m => m.id)) + 1 : 1;
    const memberCode = `GYM-${1000 + newId}`;
    const newMember = {
      id: newId,
      memberCode,
      fullName: data.fullName,
      email: data.email || `${data.fullName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phoneNumber: data.phoneNumber || '+1 555-000-0000',
      profilePhoto: data.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      age: Number(data.age) || 28,
      gender: data.gender || 'Male',
      address: data.address || 'Local Resident',
      emergencyContact: data.emergencyContact || 'Emergency Contact (+1 555-123-4567)',
      joiningDate: data.joiningDate || new Date().toISOString().split('T')[0],
      membershipStatus: data.membershipStatus || 'ACTIVE'
    };
    list.unshift(newMember);
    setStoredItem(STORAGE_KEYS.MEMBERS, list);

    // Optional plan assignment
    if (data.initialPlanId) {
      const plans = getStoredItem(STORAGE_KEYS.PLANS, DEFAULT_PLANS);
      const plan = plans.find(p => p.id === Number(data.initialPlanId));
      if (plan) {
        MockStore.assignSubscription({
          memberId: newId,
          planId: plan.id,
          startDate: newMember.joiningDate,
          amount: plan.amount,
          paymentMethod: data.initialPaymentMethod || 'CARD'
        });
      }
    }
    return newMember;
  },
  updateMember: (id, data) => {
    const list = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const idx = list.findIndex(m => m.id === Number(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.MEMBERS, list);
      return list[idx];
    }
    return null;
  },
  deleteMember: (id) => {
    let list = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    list = list.filter(m => m.id !== Number(id));
    setStoredItem(STORAGE_KEYS.MEMBERS, list);
    return { success: true };
  },

  // Plans & Subscriptions
  getPlans: () => getStoredItem(STORAGE_KEYS.PLANS, DEFAULT_PLANS),
  getSubscriptions: (status = '', memberId = null) => {
    let list = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    if (status && status !== 'ALL') {
      list = list.filter(s => s.status === status);
    }
    if (memberId) {
      list = list.filter(s => s.member && s.member.id === Number(memberId));
    }
    return list;
  },
  getExpiringSoon: () => {
    const list = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    return list.filter(s => s.status === 'EXPIRING_SOON');
  },
  assignSubscription: (subData) => {
    const list = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    const members = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const plans = getStoredItem(STORAGE_KEYS.PLANS, DEFAULT_PLANS);

    const member = members.find(m => m.id === Number(subData.memberId));
    const plan = plans.find(p => p.id === Number(subData.planId));

    const startDate = subData.startDate || new Date().toISOString().split('T')[0];
    const duration = plan ? plan.durationMonths : 1;
    const startObj = new Date(startDate);
    startObj.setMonth(startObj.getMonth() + duration);
    const expiryDate = startObj.toISOString().split('T')[0];

    const newSub = {
      id: list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1,
      member: member || { id: subData.memberId, fullName: 'Gym Member' },
      plan: plan || { id: subData.planId, planName: 'Monthly Plan' },
      planName: plan ? plan.planName : 'Monthly Plan',
      startDate,
      expiryDate,
      amount: Number(subData.amount) || (plan ? plan.amount : 49.99),
      paymentStatus: subData.paymentStatus || 'PAID',
      status: 'ACTIVE'
    };

    list.unshift(newSub);
    setStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, list);

    // Record invoice payment
    MockStore.recordPayment({
      memberId: subData.memberId,
      amount: newSub.amount,
      paymentMethod: subData.paymentMethod || 'CARD',
      notes: `Subscription: ${newSub.planName}`
    });

    return newSub;
  },
  renewSubscription: (id, renewData) => {
    const list = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    const idx = list.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      const sub = list[idx];
      const today = new Date().toISOString().split('T')[0];
      const baseDate = sub.expiryDate > today ? new Date(sub.expiryDate) : new Date(today);
      baseDate.setMonth(baseDate.getMonth() + (sub.plan?.durationMonths || 1));

      list[idx] = {
        ...sub,
        expiryDate: baseDate.toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, list);

      MockStore.recordPayment({
        memberId: sub.member?.id,
        amount: Number(renewData.amount) || sub.amount,
        paymentMethod: renewData.paymentMethod || 'CARD',
        notes: `Subscription Renewal: ${sub.planName}`
      });

      return list[idx];
    }
    return null;
  },
  deleteSubscription: (id) => {
    let list = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    list = list.filter(s => s.id !== Number(id));
    setStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, list);
    return { success: true };
  },

  // Trainers
  getTrainers: () => getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS),
  createTrainer: (trainerData) => {
    const list = getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS);
    const newTrainer = {
      id: list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1,
      name: trainerData.name,
      email: trainerData.email || `${trainerData.name.toLowerCase().replace(/\s+/g, '.')}@corelygym.com`,
      phoneNumber: trainerData.phoneNumber || '+1 555-000-0000',
      profilePhoto: trainerData.profilePhoto || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&auto=format&fit=crop&q=80',
      specialization: trainerData.specialization || 'Strength & Conditioning',
      experienceYears: Number(trainerData.experienceYears) || 3,
      salary: Number(trainerData.salary) || 4000.0,
      hireDate: trainerData.hireDate || new Date().toISOString().split('T')[0]
    };
    list.unshift(newTrainer);
    setStoredItem(STORAGE_KEYS.TRAINERS, list);
    return newTrainer;
  },
  updateTrainer: (id, data) => {
    const list = getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS);
    const idx = list.findIndex(t => t.id === Number(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.TRAINERS, list);
      return list[idx];
    }
    return null;
  },
  deleteTrainer: (id) => {
    let list = getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS);
    list = list.filter(t => t.id !== Number(id));
    setStoredItem(STORAGE_KEYS.TRAINERS, list);
    return { success: true };
  },

  // Sessions with Conflict Detection
  getSessions: (filters = {}) => {
    let list = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    if (filters.trainerId) {
      list = list.filter(s => s.trainer && s.trainer.id === Number(filters.trainerId));
    }
    if (filters.memberId) {
      list = list.filter(s => s.member && s.member.id === Number(filters.memberId));
    }
    return list;
  },
  scheduleSession: (data) => {
    const list = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    const trainers = getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS);
    const members = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);

    const trainer = trainers.find(t => t.id === Number(data.trainerId));
    const member = members.find(m => m.id === Number(data.memberId));

    // Conflict Guard
    const conflict = list.find(s =>
      s.trainer && s.trainer.id === Number(data.trainerId) &&
      s.trainingDate === data.trainingDate &&
      s.sessionStatus !== 'CANCELLED' &&
      ((data.startTime < s.endTime && data.endTime > s.startTime))
    );

    if (conflict) {
      throw new Error(`Schedule Conflict: Trainer ${trainer?.name || 'Selected'} already has a session from ${conflict.startTime.substring(0,5)} to ${conflict.endTime.substring(0,5)} on ${data.trainingDate}`);
    }

    const newSession = {
      id: list.length > 0 ? Math.max(...list.map(s => s.id)) + 1 : 1,
      member: member || { id: data.memberId, fullName: 'Member' },
      trainer: trainer || { id: data.trainerId, name: 'Coach' },
      trainingDate: data.trainingDate,
      startTime: data.startTime,
      endTime: data.endTime,
      sessionStatus: data.sessionStatus || 'SCHEDULED',
      notes: data.notes || ''
    };

    list.unshift(newSession);
    setStoredItem(STORAGE_KEYS.SESSIONS, list);
    return newSession;
  },
  updateSession: (id, data) => {
    const list = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    const idx = list.findIndex(s => s.id === Number(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
      setStoredItem(STORAGE_KEYS.SESSIONS, list);
      return list[idx];
    }
    return null;
  },
  deleteSession: (id) => {
    let list = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    list = list.filter(s => s.id !== Number(id));
    setStoredItem(STORAGE_KEYS.SESSIONS, list);
    return { success: true };
  },

  // Equipment & Maintenance
  getEquipment: (condition = '') => {
    let list = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
    if (condition) {
      list = list.filter(eq => eq.equipmentCondition === condition);
    }
    return list;
  },
  createEquipment: (eqData) => {
    const list = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
    const newEq = {
      id: list.length > 0 ? Math.max(...list.map(e => e.id)) + 1 : 1,
      equipmentName: eqData.equipmentName,
      category: eqData.category || 'Strength',
      serialNumber: eqData.serialNumber || `SN-${Math.floor(1000 + Math.random() * 9000)}`,
      purchaseDate: eqData.purchaseDate || new Date().toISOString().split('T')[0],
      cost: Number(eqData.cost) || 1500.0,
      equipmentCondition: eqData.equipmentCondition || 'GOOD',
      location: eqData.location || 'Main Gym Floor',
      notes: eqData.notes || ''
    };
    list.unshift(newEq);
    setStoredItem(STORAGE_KEYS.EQUIPMENT, list);
    return newEq;
  },
  updateEquipment: (id, eqData) => {
    const list = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
    const idx = list.findIndex(e => e.id === Number(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...eqData };
      setStoredItem(STORAGE_KEYS.EQUIPMENT, list);
      return list[idx];
    }
    return null;
  },
  deleteEquipment: (id) => {
    let list = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
    list = list.filter(e => e.id !== Number(id));
    setStoredItem(STORAGE_KEYS.EQUIPMENT, list);
    return { success: true };
  },

  getMaintenance: (equipmentId = null) => {
    let list = getStoredItem(STORAGE_KEYS.MAINTENANCE, DEFAULT_MAINTENANCE);
    if (equipmentId) {
      list = list.filter(m => m.equipment && m.equipment.id === Number(equipmentId));
    }
    return list;
  },
  addMaintenanceRecord: (data) => {
    const maintList = getStoredItem(STORAGE_KEYS.MAINTENANCE, DEFAULT_MAINTENANCE);
    const eqList = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);

    const equipment = eqList.find(e => e.id === Number(data.equipmentId));
    const newRecord = {
      id: maintList.length > 0 ? Math.max(...maintList.map(m => m.id)) + 1 : 1,
      equipment: equipment || { id: data.equipmentId, equipmentName: 'Gym Asset' },
      serviceDate: data.maintenanceDate || data.serviceDate || new Date().toISOString().split('T')[0],
      maintenanceDate: data.maintenanceDate || data.serviceDate || new Date().toISOString().split('T')[0],
      technicianName: data.technicianName || 'Specialized Technician',
      maintenanceCost: Number(data.maintenanceCost) || Number(data.cost) || 150.0,
      cost: Number(data.maintenanceCost) || Number(data.cost) || 150.0,
      description: data.description || 'Routine service & calibration',
      resolutionNotes: data.resolutionNotes || 'Machine serviced and cleared for athletes',
      status: data.status || 'COMPLETED'
    };

    maintList.unshift(newRecord);
    setStoredItem(STORAGE_KEYS.MAINTENANCE, maintList);

    // Update equipment status if COMPLETED
    if (newRecord.status === 'COMPLETED' && equipment) {
      MockStore.updateEquipment(equipment.id, { equipmentCondition: 'GOOD' });
    }

    return newRecord;
  },
  deleteMaintenance: (id) => {
    let list = getStoredItem(STORAGE_KEYS.MAINTENANCE, DEFAULT_MAINTENANCE);
    list = list.filter(m => m.id !== Number(id));
    setStoredItem(STORAGE_KEYS.MAINTENANCE, list);
    return { success: true };
  },

  // Payments
  getPayments: (memberId = null) => {
    let list = getStoredItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    if (memberId) {
      list = list.filter(p => p.member && p.member.id === Number(memberId));
    }
    return list;
  },
  recordPayment: (paymentData) => {
    const list = getStoredItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    const members = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const member = members.find(m => m.id === Number(paymentData.memberId));

    const newPayment = {
      id: list.length > 0 ? Math.max(...list.map(p => p.id)) + 1 : 1,
      invoiceNumber: `INV-2026-00${list.length + 1}`,
      member: member || { id: paymentData.memberId, fullName: 'Gym Member' },
      amount: Number(paymentData.amount) || 49.99,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod || 'CARD',
      paymentStatus: 'PAID',
      notes: paymentData.notes || 'Payment processed'
    };

    list.unshift(newPayment);
    setStoredItem(STORAGE_KEYS.PAYMENTS, list);
    return newPayment;
  },

  // Reports
  getReports: (_startDate, _endDate) => {
    const members = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const subs = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    const payments = getStoredItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    const sessions = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    const maint = getStoredItem(STORAGE_KEYS.MAINTENANCE, DEFAULT_MAINTENANCE);

    const totalRev = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const totalMaint = maint.reduce((acc, m) => acc + (Number(m.maintenanceCost || m.cost) || 0), 0);

    return {
      totalMembers: members.length,
      activeMembers: members.filter(m => m.membershipStatus === 'ACTIVE').length,
      expiredMembers: members.filter(m => m.membershipStatus === 'EXPIRED').length,
      rangeRevenue: Number(totalRev.toFixed(2)),
      totalSubscriptions: subs.length,
      totalSessionsInRange: sessions.length,
      totalMaintenanceCost: Number(totalMaint.toFixed(2)),
      paymentsList: payments.slice(0, 5),
      sessionsList: sessions.slice(0, 5),
      maintenanceList: maint.slice(0, 5)
    };
  },

  // Dashboard Stats
  getDashboardStats: () => {
    const members = getStoredItem(STORAGE_KEYS.MEMBERS, DEFAULT_MEMBERS);
    const subs = getStoredItem(STORAGE_KEYS.SUBSCRIPTIONS, DEFAULT_SUBSCRIPTIONS);
    const trainers = getStoredItem(STORAGE_KEYS.TRAINERS, DEFAULT_TRAINERS);
    const sessions = getStoredItem(STORAGE_KEYS.SESSIONS, DEFAULT_SESSIONS);
    const equipment = getStoredItem(STORAGE_KEYS.EQUIPMENT, DEFAULT_EQUIPMENT);
    const payments = getStoredItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);

    const activeMembers = members.filter(m => m.membershipStatus === 'ACTIVE').length;
    const expiredSubs = subs.filter(s => s.status === 'EXPIRED').length;
    const expiringSoon = subs.filter(s => s.status === 'EXPIRING_SOON');
    const eqMaintenance = equipment.filter(e => e.equipmentCondition !== 'GOOD').length;
    const monthlyRev = payments.slice(0, 5).reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const totalRev = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

    return {
      totalMembers: members.length,
      activeMembers,
      expiredSubscriptions: expiredSubs,
      expiringSoonSubscriptions: expiringSoon.length,
      totalTrainers: trainers.length,
      activeSessions: sessions.filter(s => s.sessionStatus === 'SCHEDULED').length,
      totalEquipment: equipment.length,
      equipmentNeedingMaintenance: eqMaintenance,
      monthlyRevenue: Number(monthlyRev.toFixed(2)),
      totalRevenue: Number(totalRev.toFixed(2)),
      recentMembers: members.slice(0, 4),
      recentPayments: payments.slice(0, 4),
      expiringSoonList: expiringSoon,
      monthlyRevenueTrend: {
        'May 2026': 1450,
        'Jun 2026': 1820,
        'Jul 2026': 2250,
        'Aug 2026': 2680,
        'Sep 2026': 3100,
        'Oct 2026': 3420
      },
      memberStatusDistribution: {
        Active: activeMembers,
        Expired: expiredSubs,
        'Expiring Soon': expiringSoon.length
      }
    };
  }
};

