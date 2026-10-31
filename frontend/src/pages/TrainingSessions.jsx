import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  CalendarCheck,
  Plus,
  RefreshCw,
  Clock,
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Edit2,
  X,
  FileText
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

export default function TrainingSessions({ onShowToast }) {
  const [searchParams] = useSearchParams();
  const initialTrainerId = searchParams.get('trainerId') || '';

  const [sessions, setSessions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterTrainer, setFilterTrainer] = useState(initialTrainerId);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Schedule Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);

  const initialForm = {
    memberId: '',
    trainerId: initialTrainerId,
    trainingDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    sessionStatus: 'SCHEDULED',
    notes: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sessionsData, trainersData, membersData] = await Promise.all([
        api.getSessions({ trainerId: filterTrainer }),
        api.getTrainers(),
        api.getMembers()
      ]);
      setSessions(sessionsData);
      setTrainers(trainersData);
      setMembers(membersData);
    } catch (err) {
      console.warn('Sessions fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [filterTrainer]);

  const openScheduleModal = () => {
    setIsEditing(false);
    setFormData({
      ...initialForm,
      trainerId: filterTrainer || ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setIsEditing(true);
    setEditingSessionId(s.id);
    setFormData({
      memberId: s.member?.id || '',
      trainerId: s.trainer?.id || '',
      trainingDate: s.trainingDate || '',
      startTime: s.startTime?.substring(0, 5) || '09:00',
      endTime: s.endTime?.substring(0, 5) || '10:00',
      sessionStatus: s.sessionStatus || 'SCHEDULED',
      notes: s.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleSaveSession = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        memberId: Number(formData.memberId),
        trainerId: Number(formData.trainerId),
        trainingDate: formData.trainingDate,
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
        sessionStatus: formData.sessionStatus,
        notes: formData.notes
      };

      if (isEditing && editingSessionId) {
        await api.updateSession(editingSessionId, payload);
        onShowToast && onShowToast('Training session updated successfully', 'success');
      } else {
        await api.scheduleSession(payload);
        onShowToast && onShowToast('Training session booked successfully!', 'success');
      }
      setIsModalOpen(false);
      fetchAll();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Conflicting schedule detected', 'error');
    }
  };

  const handleQuickStatusChange = async (session, newStatus) => {
    try {
      await api.updateSession(session.id, {
        memberId: session.member?.id,
        trainerId: session.trainer?.id,
        trainingDate: session.trainingDate,
        startTime: session.startTime,
        endTime: session.endTime,
        sessionStatus: newStatus,
        notes: session.notes
      });
      onShowToast && onShowToast(`Session status marked as ${newStatus}`, 'success');
      fetchAll();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Status update failed', 'error');
    }
  };

  const confirmDelete = (s) => {
    setSessionToDelete(s);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await api.deleteSession(sessionToDelete.id);
      onShowToast && onShowToast('Session deleted', 'success');
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      fetchAll();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Failed to delete session', 'error');
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.sessionStatus === filterStatus;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Personal Training Sessions</h1>
          <p>Schedule client workouts, prevent double-bookings, and track session completions</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchAll}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openScheduleModal}>
            <Plus size={16} /> Schedule New Session
          </button>
        </div>
      </div>

      {/* Conflict Prevention Callout */}
      <div style={{
        background: 'rgba(255, 107, 0, 0.08)',
        border: '1px solid rgba(255, 107, 0, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: 'var(--text-secondary)',
        fontSize: '0.88rem'
      }}>
        <Clock size={20} color="var(--primary-orange)" />
        <span>
          <strong style={{ color: '#fff' }}>Automated Conflict Guard Active:</strong> The scheduling engine cross-checks trainer timetables and blocks overlapping bookings for the same trainer.
        </span>
      </div>

      {/* Filter Options */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Filter By Trainer:
            </span>
            <select
              className="form-control"
              style={{ width: '220px', padding: '6px 12px' }}
              value={filterTrainer}
              onChange={(e) => setFilterTrainer(e.target.value)}
            >
              <option value="">All Trainers</option>
              {trainers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.specialization})
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['ALL', 'SCHEDULED', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Member</th>
                <th>Personal Trainer</th>
                <th>Status</th>
                <th>Workout Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-orange)' }}>
                    Loading session rosters...
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No training sessions scheduled. Click "Schedule New Session" to book.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: '#fff' }}>
                          {session.trainingDate}
                        </span>
                        <span style={{ fontSize: '0.78rem', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {session.startTime?.substring(0, 5)} - {session.endTime?.substring(0, 5)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <img
                          src={session.member?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                          alt={session.member?.fullName}
                          className="table-user-avatar"
                        />
                        <div className="table-user-meta">
                          <h4>{session.member?.fullName}</h4>
                          <p>{session.member?.memberCode}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <img
                          src={session.trainer?.profilePhoto || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=200'}
                          alt={session.trainer?.name}
                          className="table-user-avatar"
                        />
                        <div className="table-user-meta">
                          <h4>{session.trainer?.name}</h4>
                          <p>{session.trainer?.specialization}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge status={session.sessionStatus} />
                    </td>
                    <td style={{ maxWidth: '240px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {session.notes || 'Routine hypertrophy workout'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        {session.sessionStatus === 'SCHEDULED' && (
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                            title="Mark as Completed"
                            onClick={() => handleQuickStatusChange(session, 'COMPLETED')}
                          >
                            <CheckCircle2 size={14} /> Done
                          </button>
                        )}
                        <button
                          className="btn-icon"
                          title="Edit Session"
                          onClick={() => openEditModal(session)}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="btn-icon danger"
                          title="Delete Session"
                          onClick={() => confirmDelete(session)}
                        >
                          <Trash2 size={14} />
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

      {/* SCHEDULE / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <CalendarCheck size={22} color="var(--primary-orange)" />
                {isEditing ? 'Reschedule Training Session' : 'Schedule Training Session'}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveSession}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Gym Member *</label>
                    <select
                      className="form-control"
                      value={formData.memberId}
                      onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                      required
                    >
                      <option value="">-- Select Member --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.memberCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Personal Trainer *</label>
                    <select
                      className="form-control"
                      value={formData.trainerId}
                      onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                      required
                    >
                      <option value="">-- Select Trainer --</option>
                      {trainers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} &bull; {t.specialization}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Training Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.trainingDate}
                      onChange={(e) => setFormData({ ...formData, trainingDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Time *</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Session Status</label>
                    <select
                      className="form-control"
                      value={formData.sessionStatus}
                      onChange={(e) => setFormData({ ...formData, sessionStatus: e.target.value })}
                    >
                      <option value="SCHEDULED">SCHEDULED</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="NO_SHOW">NO_SHOW</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Session Goals & Notes</label>
                    <textarea
                      className="form-control"
                      placeholder="e.g. Focus on squat depth, barbell bench press 4x8, core stability"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows="2"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Session' : 'Book Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Cancel Training Session"
        message={`Are you sure you want to remove the scheduled session for ${sessionToDelete?.member?.fullName} with Coach ${sessionToDelete?.trainer?.name}?`}
        confirmText="Yes, Remove Session"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
