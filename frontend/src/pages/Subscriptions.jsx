import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Calendar,
  X,
  DollarSign
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

export default function Subscriptions({ onShowToast }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Assign Plan Modal State
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({
    memberId: '',
    planId: '',
    startDate: new Date().toISOString().split('T')[0],
    amount: '',
    paymentStatus: 'PAID',
    paymentMethod: 'CARD',
    notes: ''
  });

  // Renewal Modal State
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [subToRenew, setSubToRenew] = useState(null);
  const [renewForm, setRenewForm] = useState({
    planId: '',
    amount: '',
    paymentMethod: 'CARD',
    notes: 'Subscription renewed'
  });

  // Delete Modal State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [subsData, plansData, membersData] = await Promise.all([
        api.getSubscriptions(),
        api.getPlans(),
        api.getMembers()
      ]);
      setSubscriptions(subsData);
      setPlans(plansData);
      setMembers(membersData);
    } catch (err) {
      console.warn('Subscription fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handlePlanSelectInAssign = (e) => {
    const pId = e.target.value;
    const selected = plans.find(p => p.id === Number(pId));
    setAssignForm({
      ...assignForm,
      planId: pId,
      amount: selected ? selected.amount : ''
    });
  };

  const handleAssignSubscription = async (e) => {
    e.preventDefault();
    try {
      await api.assignSubscription({
        memberId: Number(assignForm.memberId),
        planId: Number(assignForm.planId),
        startDate: assignForm.startDate,
        amount: Number(assignForm.amount),
        paymentStatus: assignForm.paymentStatus,
        paymentMethod: assignForm.paymentMethod,
        notes: assignForm.notes
      });
      onShowToast && onShowToast('Subscription assigned successfully!', 'success');
      setIsAssignOpen(false);
      fetchAllData();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Failed to assign plan', 'error');
    }
  };

  const openRenewModal = (sub) => {
    setSubToRenew(sub);
    setRenewForm({
      planId: sub.plan?.id || '',
      amount: sub.amount || '',
      paymentMethod: 'CARD',
      notes: `Renewed ${sub.planName} membership`
    });
    setIsRenewOpen(true);
  };

  const handleRenewSubscription = async (e) => {
    e.preventDefault();
    if (!subToRenew) return;
    try {
      await api.renewSubscription(subToRenew.id, {
        planId: Number(renewForm.planId),
        amount: Number(renewForm.amount),
        paymentMethod: renewForm.paymentMethod,
        notes: renewForm.notes
      });
      onShowToast && onShowToast('Subscription successfully renewed!', 'success');
      setIsRenewOpen(false);
      setSubToRenew(null);
      fetchAllData();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Renewal failed', 'error');
    }
  };

  const confirmDelete = (sub) => {
    setSubToDelete(sub);
    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!subToDelete) return;
    try {
      await api.deleteSubscription(subToDelete.id);
      onShowToast && onShowToast('Subscription record removed', 'success');
      setDeleteConfirmOpen(false);
      setSubToDelete(null);
      fetchAllData();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Failed to delete subscription', 'error');
    }
  };

  // Filter subscriptions based on status
  const today = new Date().toISOString().split('T')[0];
  const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const filteredSubs = subscriptions.filter(sub => {
    if (filterStatus === 'ACTIVE') return sub.status === 'ACTIVE';
    if (filterStatus === 'EXPIRED') return sub.status === 'EXPIRED';
    if (filterStatus === 'EXPIRING_SOON') {
      return sub.expiryDate >= today && sub.expiryDate <= inSevenDays && sub.status !== 'EXPIRED';
    }
    return true;
  });

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Gym Subscription Management</h1>
          <p>Track membership durations, renewals, recurring billing, and plan expiry dates</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchAllData}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsAssignOpen(true)}>
            <Plus size={16} /> Assign Plan to Member
          </button>
        </div>
      </div>

      {/* Available Plans Cards Showcase */}
      <div style={{ marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#fff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CreditCard size={18} color="var(--primary-orange)" />
          Available Membership Tiers
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
          {plans.map((plan) => (
            <div key={plan.id} className="card" style={{ padding: '22px', borderTop: '3px solid var(--primary-orange)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>{plan.planName}</h4>
                  <span style={{ color: 'var(--primary-orange)', fontSize: '0.82rem', fontWeight: 600 }}>
                    {plan.durationMonths} {plan.durationMonths === 1 ? 'Month' : 'Months'} Duration
                  </span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                  ${plan.amount.toFixed(2)}
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '14px', flex: 1 }}>
                {plan.description}
              </p>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px dashed rgba(255,255,255,0.08)', paddingTop: '10px' }}>
                {plan.features}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Filter Status:
          </span>
          <button
            className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('ALL')}
          >
            All Subscriptions ({subscriptions.length})
          </button>
          <button
            className={`btn btn-sm ${filterStatus === 'ACTIVE' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('ACTIVE')}
          >
            Active Only
          </button>
          <button
            className={`btn btn-sm ${filterStatus === 'EXPIRING_SOON' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('EXPIRING_SOON')}
          >
            Expiring Within 7 Days
          </button>
          <button
            className={`btn btn-sm ${filterStatus === 'EXPIRED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterStatus('EXPIRED')}
          >
            Expired
          </button>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Plan Name</th>
                <th>Start Date</th>
                <th>Expiry Date</th>
                <th>Amount</th>
                <th>Payment Status</th>
                <th>Subscription Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-orange)' }}>
                    Loading subscriptions...
                  </td>
                </tr>
              ) : filteredSubs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No subscriptions match this filter.
                  </td>
                </tr>
              ) : (
                filteredSubs.map((sub) => {
                  const isExpiringSoon = sub.expiryDate >= today && sub.expiryDate <= inSevenDays && sub.status !== 'EXPIRED';
                  return (
                    <tr key={sub.id} style={isExpiringSoon ? { background: 'rgba(245, 158, 11, 0.04)' } : {}}>
                      <td>
                        <div className="table-user-cell">
                          <img
                            src={sub.member?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
                            alt={sub.member?.fullName}
                            className="table-user-avatar"
                          />
                          <div className="table-user-meta">
                            <h4>{sub.member?.fullName}</h4>
                            <p>{sub.member?.memberCode} &bull; {sub.member?.phoneNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: '#fff' }}>
                        {sub.planName}
                      </td>
                      <td>{sub.startDate}</td>
                      <td style={{ fontWeight: 600, color: isExpiringSoon ? 'var(--warning)' : '#fff' }}>
                        {sub.expiryDate}
                        {isExpiringSoon && (
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--warning)' }}>
                            Expiring in &le; 7 days!
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: 700, color: '#fff' }}>
                        ${sub.amount?.toFixed(2)}
                      </td>
                      <td>
                        <Badge status={sub.paymentStatus} />
                      </td>
                      <td>
                        <Badge status={isExpiringSoon ? 'EXPIRING_SOON' : sub.status} text={isExpiringSoon ? 'Expiring Soon' : sub.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            title="Renew Subscription"
                            onClick={() => openRenewModal(sub)}
                          >
                            <RotateCcw size={14} /> Renew
                          </button>
                          <button
                            className="btn-icon danger"
                            title="Delete Subscription"
                            onClick={() => confirmDelete(sub)}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSIGN SUBSCRIPTION MODAL */}
      {isAssignOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <CreditCard size={22} color="var(--primary-orange)" />
                Assign Subscription Plan
              </h2>
              <button className="modal-close-btn" onClick={() => setIsAssignOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAssignSubscription}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Select Gym Member *</label>
                    <select
                      className="form-control"
                      value={assignForm.memberId}
                      onChange={(e) => setAssignForm({ ...assignForm, memberId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Member --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.memberCode}) &bull; {m.phoneNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Select Membership Plan *</label>
                    <select
                      className="form-control"
                      value={assignForm.planId}
                      onChange={handlePlanSelectInAssign}
                      required
                    >
                      <option value="">-- Choose Plan --</option>
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.planName} ({p.durationMonths} Months) &bull; ${p.amount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={assignForm.startDate}
                      onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={assignForm.amount}
                      onChange={(e) => setAssignForm({ ...assignForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Status</label>
                    <select
                      className="form-control"
                      value={assignForm.paymentStatus}
                      onChange={(e) => setAssignForm({ ...assignForm, paymentStatus: e.target.value })}
                    >
                      <option value="PAID">PAID</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-control"
                      value={assignForm.paymentMethod}
                      onChange={(e) => setAssignForm({ ...assignForm, paymentMethod: e.target.value })}
                    >
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Notes (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Promotional summer discount applied"
                      value={assignForm.notes}
                      onChange={(e) => setAssignForm({ ...assignForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsAssignOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Assign Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RENEW SUBSCRIPTION MODAL */}
      {isRenewOpen && subToRenew && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <RotateCcw size={22} color="var(--primary-orange)" />
                Renew Subscription: {subToRenew.member?.fullName}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsRenewOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRenewSubscription}>
              <div className="modal-body">
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Current Plan: <strong style={{ color: '#fff' }}>{subToRenew.planName}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                    Current Expiry Date: <strong style={{ color: 'var(--warning)' }}>{subToRenew.expiryDate}</strong>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Choose Renewal Plan</label>
                    <select
                      className="form-control"
                      value={renewForm.planId}
                      onChange={(e) => {
                        const pId = e.target.value;
                        const p = plans.find(pl => pl.id === Number(pId));
                        setRenewForm({
                          ...renewForm,
                          planId: pId,
                          amount: p ? p.amount : renewForm.amount
                        });
                      }}
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.planName} ({p.durationMonths} Months) &bull; ${p.amount.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={renewForm.amount}
                      onChange={(e) => setRenewForm({ ...renewForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select
                      className="form-control"
                      value={renewForm.paymentMethod}
                      onChange={(e) => setRenewForm({ ...renewForm, paymentMethod: e.target.value })}
                    >
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Renewal Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={renewForm.notes}
                      onChange={(e) => setRenewForm({ ...renewForm, notes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsRenewOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Renewal & Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Delete Subscription Record"
        message={`Are you sure you want to remove the subscription for ${subToDelete?.member?.fullName} (${subToDelete?.planName})?`}
        confirmText="Delete Subscription"
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
