import React, { useState, useEffect } from 'react';
import {
  Receipt,
  Plus,
  RefreshCw,
  Search,
  DollarSign,
  Printer,
  X,
  CheckCircle2
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';

export default function Payments({ onShowToast }) {
  const [payments, setPayments] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Manual payment modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'CARD',
    remarks: 'Gym membership fee payment'
  });

  // Invoice Receipt View Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const [payData, memData] = await Promise.all([
        api.getPayments(),
        api.getMembers()
      ]);
      setPayments(payData);
      setMembers(memData);
    } catch (err) {
      console.warn('Payments fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      await api.recordPayment({
        memberId: paymentForm.memberId,
        amount: paymentForm.amount,
        paymentMethod: paymentForm.paymentMethod,
        remarks: paymentForm.remarks
      });
      onShowToast && onShowToast('Payment receipt recorded successfully!', 'success');
      setIsModalOpen(false);
      setPaymentForm({
        memberId: '',
        amount: '',
        paymentMethod: 'CARD',
        remarks: 'Gym membership fee payment'
      });
      fetchPayments();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Payment recording failed', 'error');
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const filteredPayments = payments.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.invoiceNumber?.toLowerCase().includes(term) ||
      p.member?.fullName?.toLowerCase().includes(term) ||
      p.member?.memberCode?.toLowerCase().includes(term) ||
      p.paymentMethod?.toLowerCase().includes(term)
    );
  });

  const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Payments & Financial Ledger</h1>
          <p>Track all membership dues, transaction histories, invoices, and billing statements</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchPayments}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Record Payment
          </button>
        </div>
      </div>

      {/* Summary Stat Pill */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', marginBottom: '24px' }}>
        <div className="stat-card accent-green">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Payments Collected</span>
            <div className="stat-icon green"><DollarSign size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>
            ${totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-card-footer">
            <span>Across {payments.length} verified transactions</span>
          </div>
        </div>

        <div className="stat-card accent-orange">
          <div className="stat-card-header">
            <span className="stat-card-title">Latest Transaction</span>
            <div className="stat-icon orange"><Receipt size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ fontSize: '1.4rem' }}>
            {payments[0]?.invoiceNumber || 'INV-2026-001'}
          </div>
          <div className="stat-card-footer">
            <span>{payments[0]?.member?.fullName || 'N/A'} &bull; ${payments[0]?.amount || 0}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card" style={{ padding: '16px 24px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div className="search-bar" style={{ width: '360px' }}>
            <Search size={16} color="#94A3B8" />
            <input
              type="text"
              placeholder="Search by invoice #, member, or method..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Showing {filteredPayments.length} transactions
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Member</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'right' }}>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-orange)' }}>
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No payment transactions found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id}>
                    <td style={{ fontWeight: 700, color: 'var(--primary-orange)' }}>
                      {p.invoiceNumber}
                    </td>
                    <td>
                      <div className="table-user-cell">
                        <div className="table-user-meta">
                          <h4>{p.member?.fullName}</h4>
                          <p>{p.member?.memberCode}</p>
                        </div>
                      </div>
                    </td>
                    <td>{p.paymentDate}</td>
                    <td>
                      <span className="badge badge-orange">{p.paymentMethod}</span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>
                      ${p.amount?.toFixed(2)}
                    </td>
                    <td>
                      <Badge status={p.paymentStatus} />
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {p.remarks || 'Standard Fee'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedInvoice(p)}
                        title="View Invoice"
                      >
                        <Receipt size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD PAYMENT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <Receipt size={22} color="var(--primary-orange)" />
                Record Member Payment
              </h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleRecordPayment}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Select Member *</label>
                    <select
                      className="form-control"
                      value={paymentForm.memberId}
                      onChange={(e) => setPaymentForm({ ...paymentForm, memberId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Member --</option>
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.fullName} ({m.memberCode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Amount ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      placeholder="e.g. 49.99"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Payment Method *</label>
                    <select
                      className="form-control"
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                    >
                      <option value="CARD">Credit / Debit Card</option>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Remarks / Note</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Personal training session add-on payment"
                      value={paymentForm.remarks}
                      onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Receipt & Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INVOICE RECEIPT MODAL */}
      {selectedInvoice && (
        <div className="modal-overlay">
          <div className="modal-dialog" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h2>
                <CheckCircle2 size={22} color="var(--success)" />
                Official Gym Invoice Receipt
              </h2>
              <button className="modal-close-btn" onClick={() => setSelectedInvoice(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" id="printable-receipt">
              <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>IRONPULSE FITNESS</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Commercial Club & Performance Center</p>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
                  INVOICE: {selectedInvoice.invoiceNumber}
                </div>
              </div>

              <div className="item-card-details" style={{ fontSize: '0.88rem' }}>
                <div className="item-detail-row">
                  <span>Bill To Member:</span>
                  <span>{selectedInvoice.member?.fullName} ({selectedInvoice.member?.memberCode})</span>
                </div>
                <div className="item-detail-row">
                  <span>Payment Date:</span>
                  <span>{selectedInvoice.paymentDate}</span>
                </div>
                <div className="item-detail-row">
                  <span>Payment Method:</span>
                  <span>{selectedInvoice.paymentMethod}</span>
                </div>
                <div className="item-detail-row">
                  <span>Payment Status:</span>
                  <span style={{ color: 'var(--success)' }}>PAID IN FULL</span>
                </div>
                <div className="item-detail-row">
                  <span>Description / Remarks:</span>
                  <span>{selectedInvoice.remarks || 'Membership Dues'}</span>
                </div>
                <div className="item-detail-row" style={{ paddingTop: '10px', fontSize: '1.1rem', borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontWeight: 700, color: '#fff' }}>TOTAL CHARGED:</span>
                  <span style={{ fontWeight: 800, color: 'var(--primary-orange)' }}>
                    ${selectedInvoice.amount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={handlePrintReceipt}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="btn btn-primary" onClick={() => setSelectedInvoice(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
