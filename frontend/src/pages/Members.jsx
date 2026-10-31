import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  ShieldAlert,
  UserCheck,
  X,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

export default function Members({ onShowToast, globalSearch }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [plans, setPlans] = useState([]);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Delete modal state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Form State
  const initialFormData = {
    fullName: '',
    profilePhoto: '',
    age: '',
    gender: 'Male',
    phoneNumber: '',
    email: '',
    address: '',
    joiningDate: new Date().toISOString().split('T')[0],
    membershipStatus: 'ACTIVE',
    emergencyContact: '',
    initialPlanId: '',
    initialPaymentMethod: 'CARD',
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchMembers = async (query = '') => {
    setLoading(true);
    try {
      const data = await api.getMembers(query);
      setMembers(data);
    } catch (err) {
      console.warn('Members fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const data = await api.getPlans();
      setPlans(data);
    } catch (err) {
      console.warn('Plans fetch fallback:', err);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPlans();
  }, []);

  useEffect(() => {
    if (globalSearch !== undefined && globalSearch !== null) {
      setSearchTerm(globalSearch);
      fetchMembers(globalSearch);
    }
  }, [globalSearch]);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    fetchMembers(val);
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const openEditModal = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
    setFormData({
      fullName: member.fullName || '',
      profilePhoto: member.profilePhoto || '',
      age: member.age || '',
      gender: member.gender || 'Male',
      phoneNumber: member.phoneNumber || '',
      email: member.email || '',
      address: member.address || '',
      joiningDate: member.joiningDate || new Date().toISOString().split('T')[0],
      membershipStatus: member.membershipStatus || 'ACTIVE',
      emergencyContact: member.emergencyContact || '',
      initialPlanId: '',
      initialPaymentMethod: 'CARD',
    });
    setIsFormOpen(true);
  };

  const openProfileModal = (member) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && selectedMember) {
        await api.updateMember(selectedMember.id, formData);
        onShowToast && onShowToast('Member profile updated successfully', 'success');
      } else {
        await api.createMember(formData);
        onShowToast && onShowToast('New member registered successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchMembers(searchTerm);
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Operation failed', 'error');
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    try {
      await api.deleteMember(memberToDelete.id);
      onShowToast && onShowToast(`Member ${memberToDelete.fullName} removed`, 'success');
      setDeleteConfirmOpen(false);
      setMemberToDelete(null);
      fetchMembers(searchTerm);
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Failed to delete member', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Gym Members Directory</h1>
          <p>Register, track, and manage all athlete and gym member memberships</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={() => fetchMembers(searchTerm)}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add New Member
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div className="search-bar" style={{ width: '380px' }}>
            <Search size={18} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by full name, phone number, or ID..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <span>Showing <strong style={{ color: '#fff' }}>{members.length}</strong> registered members</span>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Contact</th>
                <th>Age & Gender</th>
                <th>Joining Date</th>
                <th>Status</th>
                <th>Emergency Contact</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ color: 'var(--primary-orange)' }}>Loading members data...</div>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No gym members found matching your search criteria.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="table-user-cell">
                        <img
                          src={member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          alt={member.fullName}
                          className="table-user-avatar"
                        />
                        <div className="table-user-meta">
                          <h4>{member.fullName}</h4>
                          <p style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>{member.memberCode}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.82rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fff' }}>
                          <Phone size={13} color="var(--primary-orange)" /> {member.phoneNumber}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                          <Mail size={13} /> {member.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{member.age} yrs</span> &bull; {member.gender}
                    </td>
                    <td>{member.joiningDate}</td>
                    <td><Badge status={member.membershipStatus} /></td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {member.emergencyContact || 'Not specified'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn-icon"
                          title="View Profile"
                          onClick={() => openProfileModal(member)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          title="Edit Member"
                          onClick={() => openEditModal(member)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon danger"
                          title="Delete Member"
                          onClick={() => confirmDelete(member)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <Users size={22} color="var(--primary-orange)" />
                {isEditing ? 'Edit Gym Member Profile' : 'Register New Gym Member'}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMember}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Marcus Vance"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="marcus@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+1 555-019-2831"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Age *</label>
                    <input
                      type="number"
                      min="12"
                      max="100"
                      className="form-control"
                      placeholder="e.g. 27"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender *</label>
                    <select
                      className="form-control"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Joining Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Membership Status</label>
                    <select
                      className="form-control"
                      value={formData.membershipStatus}
                      onChange={(e) => setFormData({ ...formData, membershipStatus: e.target.value })}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING">PENDING</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="INACTIVE">INACTIVE</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Profile Photo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.profilePhoto}
                      onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Emergency Contact (Name & Phone)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Sarah Vance (+1 555-891-2092)"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Physical Address</label>
                    <textarea
                      className="form-control"
                      placeholder="Street, City, State, ZIP..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows="2"
                    />
                  </div>

                  {/* Initial Subscription on enrollment if creating new member */}
                  {!isEditing && plans.length > 0 && (
                    <>
                      <div className="form-group form-full" style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                        <label className="form-label" style={{ color: 'var(--primary-orange)' }}>
                          Assign Initial Membership Plan (Optional)
                        </label>
                        <select
                          className="form-control"
                          value={formData.initialPlanId}
                          onChange={(e) => setFormData({ ...formData, initialPlanId: e.target.value })}
                        >
                          <option value="">-- No initial plan (enroll only) --</option>
                          {plans.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.planName} ({p.durationMonths} Months) - ${p.amount.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>

                      {formData.initialPlanId && (
                        <div className="form-group">
                          <label className="form-label">Payment Method</label>
                          <select
                            className="form-control"
                            value={formData.initialPaymentMethod}
                            onChange={(e) => setFormData({ ...formData, initialPaymentMethod: e.target.value })}
                          >
                            <option value="CARD">Credit / Debit Card</option>
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Register Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MEMBER PROFILE VIEW MODAL */}
      {isProfileOpen && selectedMember && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <UserCheck size={22} color="var(--primary-orange)" />
                Member Profile: {selectedMember.fullName}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsProfileOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', gap: '22px', alignItems: 'center', marginBottom: '24px' }}>
                <img
                  src={selectedMember.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300'}
                  alt={selectedMember.fullName}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-lg)',
                    objectFit: 'cover',
                    border: '3px solid var(--primary-orange)',
                    boxShadow: 'var(--shadow-orange)'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>
                    {selectedMember.fullName}
                  </h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.9rem' }}>
                      {selectedMember.memberCode}
                    </span>
                    <Badge status={selectedMember.membershipStatus} />
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Member since {selectedMember.joiningDate}
                  </p>
                </div>
              </div>

              <div className="item-card-details" style={{ fontSize: '0.9rem' }}>
                <div className="item-detail-row">
                  <span>Age & Gender</span>
                  <span>{selectedMember.age} yrs &bull; {selectedMember.gender}</span>
                </div>
                <div className="item-detail-row">
                  <span>Phone Number</span>
                  <span>{selectedMember.phoneNumber}</span>
                </div>
                <div className="item-detail-row">
                  <span>Email Address</span>
                  <span>{selectedMember.email}</span>
                </div>
                <div className="item-detail-row">
                  <span>Emergency Contact</span>
                  <span>{selectedMember.emergencyContact || 'None provided'}</span>
                </div>
                <div className="item-detail-row">
                  <span>Address</span>
                  <span>{selectedMember.address || 'None provided'}</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setIsProfileOpen(false);
                  openEditModal(selectedMember);
                }}
              >
                <Edit2 size={16} /> Edit Profile
              </button>
              <button className="btn btn-primary" onClick={() => setIsProfileOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Gym Member"
        message={`Are you sure you want to permanently remove ${memberToDelete?.fullName} (${memberToDelete?.memberCode})? All corresponding membership sessions and history will be deleted.`}
        confirmText="Yes, Delete Member"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
