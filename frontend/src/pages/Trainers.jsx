import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Plus,
  RefreshCw,
  Phone,
  Mail,
  Award,
  DollarSign,
  Edit2,
  Trash2,
  Calendar,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/apiClient';
import ConfirmModal from '../components/ConfirmModal';

export default function Trainers({ onShowToast }) {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const initialForm = {
    name: '',
    profilePhoto: '',
    specialization: 'Strength & Conditioning',
    experience: '5 Years',
    contactNumber: '',
    email: '',
    monthlySalary: '3500',
    bio: '',
    isActive: true
  };
  const [formData, setFormData] = useState(initialForm);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const data = await api.getTrainers();
      setTrainers(data);
    } catch (err) {
      console.warn('Trainers fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const openEditModal = (t) => {
    setIsEditing(true);
    setSelectedTrainer(t);
    setFormData({
      name: t.name || '',
      profilePhoto: t.profilePhoto || '',
      specialization: t.specialization || '',
      experience: t.experience || '',
      contactNumber: t.contactNumber || '',
      email: t.email || '',
      monthlySalary: t.monthlySalary || '',
      bio: t.bio || '',
      isActive: t.isActive !== false
    });
    setIsFormOpen(true);
  };

  const handleSaveTrainer = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        monthlySalary: Number(formData.monthlySalary)
      };

      if (isEditing && selectedTrainer) {
        await api.updateTrainer(selectedTrainer.id, payload);
        onShowToast('Trainer details updated', 'success');
      } else {
        await api.createTrainer(payload);
        onShowToast('Personal trainer onboarded successfully!', 'success');
      }
      setIsFormOpen(false);
      fetchTrainers();
    } catch (err) {
      onShowToast(err.message || 'Operation failed', 'error');
    }
  };

  const confirmDelete = (t) => {
    setTrainerToDelete(t);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!trainerToDelete) return;
    try {
      await api.deleteTrainer(trainerToDelete.id);
      onShowToast('Trainer removed', 'success');
      setDeleteModalOpen(false);
      setTrainerToDelete(null);
      fetchTrainers();
    } catch (err) {
      onShowToast(err.message || 'Delete failed', 'error');
    }
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Personal Trainers & Staff</h1>
          <p>Manage expert fitness trainers, compensation, specializations, and coaching rosters</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchTrainers}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Onboard New Trainer
          </button>
        </div>
      </div>

      {/* Trainers Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--primary-orange)' }}>
          Loading trainers...
        </div>
      ) : trainers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          No trainers onboarded yet. Click "Onboard New Trainer" to add one!
        </div>
      ) : (
        <div className="trainers-grid">
          {trainers.map((t) => (
            <div key={t.id} className="item-card">
              <div className="item-card-image">
                <img
                  src={t.profilePhoto || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=500'}
                  alt={t.name}
                />
                <div className="item-card-overlay-badge">
                  <span className="badge badge-active">Active Coach</span>
                </div>
              </div>

              <div className="item-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="item-card-title">{t.name}</h3>
                    <div className="item-card-subtitle">{t.specialization}</div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
                    {t.trainerCode}
                  </span>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px', lineHeight: '1.5' }}>
                  {t.bio || 'Dedicated elite fitness coach focused on science-backed hypertrophy and athletic conditioning.'}
                </p>

                <div className="item-card-details">
                  <div className="item-detail-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Award size={14} color="var(--primary-orange)" /> Experience
                    </span>
                    <span>{t.experience}</span>
                  </div>
                  <div className="item-detail-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="var(--primary-orange)" /> Contact
                    </span>
                    <span>{t.contactNumber}</span>
                  </div>
                  <div className="item-detail-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={14} color="var(--primary-orange)" /> Email
                    </span>
                    <span>{t.email}</span>
                  </div>
                  <div className="item-detail-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <DollarSign size={14} color="var(--primary-orange)" /> Monthly Salary
                    </span>
                    <span style={{ color: '#10B981' }}>${t.monthlySalary?.toLocaleString()} / mo</span>
                  </div>
                </div>

                <div className="item-card-actions">
                  <Link
                    to={`/sessions?trainerId=${t.id}`}
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                  >
                    <Calendar size={14} /> View Sessions
                  </Link>
                  <button
                    className="btn-icon"
                    title="Edit Trainer"
                    onClick={() => openEditModal(t)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon danger"
                    title="Delete Trainer"
                    onClick={() => confirmDelete(t)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ONBOARD / EDIT TRAINER MODAL */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <UserCheck size={22} color="var(--primary-orange)" />
                {isEditing ? 'Edit Trainer Profile' : 'Onboard New Personal Trainer'}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveTrainer}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Trainer Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Viktor Kane"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Specialization *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Strength & Conditioning"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Experience *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. 8 Years"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Contact Number *</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="+1 555-402-9988"
                      value={formData.contactNumber}
                      onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="trainer@ironpulse.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Monthly Salary ($) *</label>
                    <input
                      type="number"
                      step="100"
                      className="form-control"
                      placeholder="e.g. 3800"
                      value={formData.monthlySalary}
                      onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
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
                    <label className="form-label">Coach Biography / Accreditations</label>
                    <textarea
                      className="form-control"
                      placeholder="Short bio, certifications (CSCS, ACE, IFBB), coaching philosophy..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Onboard Trainer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remove Personal Trainer"
        message={`Are you sure you want to remove ${trainerToDelete?.name} from staff? Existing scheduled sessions will be affected.`}
        confirmText="Remove Trainer"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
