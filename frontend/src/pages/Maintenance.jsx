import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  RefreshCw,
  DollarSign,
  Calendar,
  CheckCircle2,
  Trash2,
  X,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

export default function Maintenance({ onShowToast }) {
  const [maintenanceList, setMaintenanceList] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialForm = {
    equipmentId: '',
    maintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceCost: '180',
    technicianName: 'Apex Gym Technician',
    description: '',
    status: 'COMPLETED',
    resolutionNotes: 'Inspection passed and certified for member use.',
    nextMaintenanceDate: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [maintToDelete, setMaintToDelete] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [maintData, eqData] = await Promise.all([
        api.getMaintenance(),
        api.getEquipment()
      ]);
      setMaintenanceList(maintData);
      setEquipmentList(eqData);
    } catch (err) {
      console.warn('Maintenance fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateMaintenance = async (e) => {
    e.preventDefault();
    try {
      await api.addMaintenanceRecord({
        equipmentId: Number(formData.equipmentId),
        maintenanceDate: formData.maintenanceDate,
        maintenanceCost: Number(formData.maintenanceCost),
        technicianName: formData.technicianName,
        description: formData.description,
        status: formData.status,
        resolutionNotes: formData.resolutionNotes,
        nextMaintenanceDate: formData.nextMaintenanceDate || null
      });
      onShowToast && onShowToast('Maintenance service record added successfully', 'success');
      setIsModalOpen(false);
      setFormData(initialForm);
      fetchData();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Operation failed', 'error');
    }
  };

  const confirmDelete = (m) => {
    setMaintToDelete(m);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!maintToDelete) return;
    try {
      await api.deleteMaintenance(maintToDelete.id);
      onShowToast && onShowToast('Maintenance log removed', 'success');
      setDeleteModalOpen(false);
      setMaintToDelete(null);
      fetchData();
    } catch (err) {
      onShowToast && onShowToast(err.message || 'Failed to delete record', 'error');
    }
  };

  const totalCost = maintenanceList.reduce((sum, m) => sum + (m.maintenanceCost || 0), 0);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Equipment Maintenance Logs</h1>
          <p>Track certified safety inspections, repair expenditures, and technician service reports</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchData}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Maintenance Record
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card accent-orange">
          <div className="stat-card-header">
            <span className="stat-card-title">Maintenance Records</span>
            <div className="stat-icon orange"><Wrench size={22} /></div>
          </div>
          <div className="stat-card-value">{maintenanceList.length}</div>
          <div className="stat-card-footer">
            <span>Completed & in-progress services</span>
          </div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Maintenance Spend</span>
            <div className="stat-icon green"><DollarSign size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>
            ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-card-footer">
            <span>Cumulative repair & service cost</span>
          </div>
        </div>
      </div>

      {/* Maintenance Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Maintenance Date</th>
                <th>Technician</th>
                <th>Service Cost</th>
                <th>Status</th>
                <th>Description</th>
                <th>Resolution Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--primary-orange)' }}>
                    Loading maintenance records...
                  </td>
                </tr>
              ) : maintenanceList.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    No maintenance records found. Click "Add Maintenance Record" to log equipment service.
                  </td>
                </tr>
              ) : (
                maintenanceList.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <div className="table-user-cell">
                        <img
                          src={m.equipment?.equipmentImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200'}
                          alt={m.equipment?.equipmentName}
                          className="table-user-avatar"
                        />
                        <div className="table-user-meta">
                          <h4>{m.equipment?.equipmentName}</h4>
                          <p>{m.equipment?.equipmentCode} &bull; {m.equipment?.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>{m.maintenanceDate}</td>
                    <td style={{ color: '#fff', fontWeight: 600 }}>{m.technicianName}</td>
                    <td style={{ color: 'var(--primary-orange)', fontWeight: 700 }}>
                      ${m.maintenanceCost?.toFixed(2)}
                    </td>
                    <td>
                      <Badge status={m.status} />
                    </td>
                    <td style={{ maxWidth: '240px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {m.description}
                    </td>
                    <td style={{ maxWidth: '240px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {m.resolutionNotes || 'N/A'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-icon danger"
                        title="Delete Record"
                        onClick={() => confirmDelete(m)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MAINTENANCE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <Wrench size={22} color="var(--primary-orange)" />
                Add Equipment Maintenance Record
              </h2>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateMaintenance}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Select Equipment *</label>
                    <select
                      className="form-control"
                      value={formData.equipmentId}
                      onChange={(e) => setFormData({ ...formData, equipmentId: e.target.value })}
                      required
                    >
                      <option value="">-- Choose Equipment --</option>
                      {equipmentList.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.equipmentName} ({eq.equipmentCode}) - Current: {eq.condition}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maintenance Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.maintenanceDate}
                      onChange={(e) => setFormData({ ...formData, maintenanceDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cost ($) *</label>
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      placeholder="e.g. 150"
                      value={formData.maintenanceCost}
                      onChange={(e) => setFormData({ ...formData, maintenanceCost: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Technician / Vendor Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Robert Vance (Apex Tech Services)"
                      value={formData.technicianName}
                      onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Service Description *</label>
                    <textarea
                      className="form-control"
                      placeholder="Details of repair, replacement pulleys, motor tune-up, belt tensioning..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="2"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="COMPLETED">COMPLETED (Restores condition to GOOD)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (Sets to UNDER MAINTENANCE)</option>
                      <option value="SCHEDULED">SCHEDULED</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Next Maintenance Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.nextMaintenanceDate}
                      onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Resolution Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Replaced worn bearings; passes 500lb safety test."
                      value={formData.resolutionNotes}
                      onChange={(e) => setFormData({ ...formData, resolutionNotes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Maintenance Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Maintenance Record"
        message="Are you sure you want to remove this maintenance entry?"
        confirmText="Yes, Delete Record"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
