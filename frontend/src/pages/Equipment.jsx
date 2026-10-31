import React, { useState, useEffect } from 'react';
import {
  Dumbbell,
  Plus,
  RefreshCw,
  Wrench,
  AlertTriangle,
  DollarSign,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { api } from '../api/apiClient';
import Badge from '../components/Badge';
import ConfirmModal from '../components/ConfirmModal';

export default function Equipment({ onShowToast }) {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCondition, setFilterCondition] = useState('ALL');

  // Form Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  const TODAY = new Date().toISOString().split('T')[0];
  const initialForm = {
    equipmentName: '',
    equipmentImage: '',
    category: 'Strength Machines',
    quantity: '1',
    purchaseDate: TODAY,
    purchaseCost: '3500',
    condition: 'GOOD',
    lastMaintenanceDate: '',
    nextMaintenanceDate: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Quick Maintenance Modal State
  const [isMaintOpen, setIsMaintOpen] = useState(false);
  const [maintEquipment, setMaintEquipment] = useState(null);
  const [maintForm, setMaintForm] = useState({
    maintenanceDate: TODAY,
    maintenanceCost: '150',
    technicianName: 'Apex Gym Technician',
    description: 'Routine scheduled maintenance & cable inspection',
    status: 'COMPLETED',
    resolutionNotes: 'Inspected and certified ready for heavy lifting.'
  });

  // Delete State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const data = await api.getEquipment();
      setEquipmentList(data);
    } catch (err) {
      console.warn('Equipment fetch fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  const openEditModal = (eq) => {
    setIsEditing(true);
    setSelectedEquipment(eq);
    setFormData({
      equipmentName: eq.equipmentName || '',
      equipmentImage: eq.equipmentImage || '',
      category: eq.category || 'Strength Machines',
      quantity: eq.quantity || '1',
      purchaseDate: eq.purchaseDate || '',
      purchaseCost: eq.purchaseCost || '',
      condition: eq.condition || 'GOOD',
      lastMaintenanceDate: eq.lastMaintenanceDate || '',
      nextMaintenanceDate: eq.nextMaintenanceDate || ''
    });
    setIsFormOpen(true);
  };

  const handleSaveEquipment = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity),
        purchaseCost: Number(formData.purchaseCost)
      };

      if (isEditing && selectedEquipment) {
        await api.updateEquipment(selectedEquipment.id, payload);
        onShowToast('Equipment details updated successfully', 'success');
      } else {
        await api.createEquipment(payload);
        onShowToast('New equipment added to gym floor!', 'success');
      }
      setIsFormOpen(false);
      fetchEquipment();
    } catch (err) {
      onShowToast(err.message || 'Operation failed', 'error');
    }
  };

  const openLogMaintenanceModal = (eq) => {
    setMaintEquipment(eq);
    setMaintForm({
      maintenanceDate: TODAY,
      maintenanceCost: '150',
      technicianName: 'Apex Gym Technician',
      description: `Service & safety tune-up for ${eq.equipmentName}`,
      status: 'COMPLETED',
      resolutionNotes: 'Re-calibrated and marked in GOOD condition.'
    });
    setIsMaintOpen(true);
  };

  const handleSaveMaintenance = async (e) => {
    e.preventDefault();
    if (!maintEquipment) return;
    try {
      await api.addMaintenanceRecord({
        equipmentId: maintEquipment.id,
        maintenanceDate: maintForm.maintenanceDate,
        maintenanceCost: Number(maintForm.maintenanceCost),
        technicianName: maintForm.technicianName,
        description: maintForm.description,
        status: maintForm.status,
        resolutionNotes: maintForm.resolutionNotes
      });
      onShowToast('Maintenance logged & equipment condition updated!', 'success');
      setIsMaintOpen(false);
      setMaintEquipment(null);
      fetchEquipment();
    } catch (err) {
      onShowToast(err.message || 'Maintenance logging failed', 'error');
    }
  };

  const confirmDelete = (eq) => {
    setEquipmentToDelete(eq);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!equipmentToDelete) return;
    try {
      await api.deleteEquipment(equipmentToDelete.id);
      onShowToast('Equipment deleted', 'success');
      setDeleteModalOpen(false);
      setEquipmentToDelete(null);
      fetchEquipment();
    } catch (err) {
      onShowToast(err.message || 'Delete failed', 'error');
    }
  };

  const filteredEquipment = equipmentList.filter((eq) => {
    if (filterCondition === 'ALL') return true;
    if (filterCondition === 'REPAIR') {
      return eq.condition === 'NEEDS_REPAIR' || eq.condition === 'UNDER_MAINTENANCE';
    }
    return eq.condition === filterCondition;
  });

  const totalValue = equipmentList.reduce((sum, eq) => sum + ((eq.purchaseCost || 0) * (eq.quantity || 1)), 0);
  const repairCount = equipmentList.filter(eq => eq.condition !== 'GOOD').length;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Gym Equipment & Assets</h1>
          <p>Track machines, free weights, condition statuses, asset valuations, and repair schedules</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={fetchEquipment}>
            <RefreshCw size={16} /> Refresh
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Equipment
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        <div className="stat-card accent-blue">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Equipment Assets</span>
            <div className="stat-icon blue"><Dumbbell size={22} /></div>
          </div>
          <div className="stat-card-value">{equipmentList.length}</div>
          <div className="stat-card-footer">
            <span>Commercial gym gear</span>
          </div>
        </div>

        <div className="stat-card accent-green">
          <div className="stat-card-header">
            <span className="stat-card-title">Total Equipment Valuation</span>
            <div className="stat-icon green"><DollarSign size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="stat-card-footer">
            <span>Cumulative capital investment</span>
          </div>
        </div>

        <div className="stat-card accent-red">
          <div className="stat-card-header">
            <span className="stat-card-title">Needs Attention / Repair</span>
            <div className="stat-icon red"><AlertTriangle size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: repairCount > 0 ? 'var(--danger)' : '#10B981' }}>
            {repairCount}
          </div>
          <div className="stat-card-footer">
            <span>Require technician maintenance</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card" style={{ padding: '14px 20px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Filter Condition:
          </span>
          <button
            className={`btn btn-sm ${filterCondition === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterCondition('ALL')}
          >
            All Equipment ({equipmentList.length})
          </button>
          <button
            className={`btn btn-sm ${filterCondition === 'GOOD' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterCondition('GOOD')}
          >
            Good Condition
          </button>
          <button
            className={`btn btn-sm ${filterCondition === 'REPAIR' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterCondition('REPAIR')}
          >
            Requires Repair / Under Maintenance ({repairCount})
          </button>
        </div>
      </div>

      {/* Equipment Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--primary-orange)' }}>
          Loading gym equipment inventory...
        </div>
      ) : filteredEquipment.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
          No gym equipment found under this filter.
        </div>
      ) : (
        <div className="equipment-grid">
          {filteredEquipment.map((eq) => (
            <div key={eq.id} className="item-card">
              <div className="item-card-image">
                <img
                  src={eq.equipmentImage || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500'}
                  alt={eq.equipmentName}
                />
                <div className="item-card-overlay-badge">
                  <Badge status={eq.condition} text={eq.condition?.replace('_', ' ')} />
                </div>
              </div>

              <div className="item-card-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 className="item-card-title">{eq.equipmentName}</h3>
                </div>
                <div className="item-card-subtitle">{eq.category} &bull; {eq.equipmentCode}</div>

                <div className="item-card-details">
                  <div className="item-detail-row">
                    <span>Units Quantity</span>
                    <span>{eq.quantity} units</span>
                  </div>
                  <div className="item-detail-row">
                    <span>Unit Purchase Cost</span>
                    <span>${eq.purchaseCost?.toLocaleString()}</span>
                  </div>
                  <div className="item-detail-row">
                    <span>Purchase Date</span>
                    <span>{eq.purchaseDate}</span>
                  </div>
                  <div className="item-detail-row">
                    <span>Last Maintained</span>
                    <span>{eq.lastMaintenanceDate || 'Recent'}</span>
                  </div>
                  <div className="item-detail-row">
                    <span>Next Scheduled</span>
                    <span style={{ color: eq.condition !== 'GOOD' ? 'var(--warning)' : '#fff' }}>
                      {eq.nextMaintenanceDate || 'As needed'}
                    </span>
                  </div>
                </div>

                <div className="item-card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => openLogMaintenanceModal(eq)}
                  >
                    <Wrench size={14} /> Log Service
                  </button>
                  <button
                    className="btn-icon"
                    title="Edit Equipment"
                    onClick={() => openEditModal(eq)}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon danger"
                    title="Delete Equipment"
                    onClick={() => confirmDelete(eq)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD / EDIT EQUIPMENT MODAL */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <Dumbbell size={22} color="var(--primary-orange)" />
                {isEditing ? 'Edit Equipment Details' : 'Add New Gym Equipment'}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsFormOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveEquipment}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group form-full">
                    <label className="form-label">Equipment Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Matrix Commercial High-Speed Treadmill T70"
                      value={formData.equipmentName}
                      onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Cardio">Cardio (Treadmill, Bike, Rower)</option>
                      <option value="Free Weights">Free Weights (Dumbbells, Barbells, Plates)</option>
                      <option value="Strength Machines">Strength Machines (Leg Press, Chest Press)</option>
                      <option value="Cable Machines">Cable Machines & Pulleys</option>
                      <option value="Functional / Recovery">Functional / Recovery</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Purchase Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Purchase Cost ($ per unit) *</label>
                    <input
                      type="number"
                      step="10"
                      className="form-control"
                      placeholder="e.g. 3500"
                      value={formData.purchaseCost}
                      onChange={(e) => setFormData({ ...formData, purchaseCost: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Equipment Condition *</label>
                    <select
                      className="form-control"
                      value={formData.condition}
                      onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    >
                      <option value="GOOD">GOOD (Operating Normal)</option>
                      <option value="NEEDS_REPAIR">NEEDS REPAIR</option>
                      <option value="UNDER_MAINTENANCE">UNDER MAINTENANCE</option>
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
                    <label className="form-label">Equipment Photo URL</label>
                    <input
                      type="url"
                      className="form-control"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.equipmentImage}
                      onChange={(e) => setFormData({ ...formData, equipmentImage: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save Changes' : 'Add to Floor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK LOG MAINTENANCE MODAL */}
      {isMaintOpen && maintEquipment && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h2>
                <Wrench size={22} color="var(--primary-orange)" />
                Log Maintenance: {maintEquipment.equipmentName}
              </h2>
              <button className="modal-close-btn" onClick={() => setIsMaintOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveMaintenance}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Maintenance Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={maintForm.maintenanceDate}
                      onChange={(e) => setMaintForm({ ...maintForm, maintenanceDate: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Service Cost ($) *</label>
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      value={maintForm.maintenanceCost}
                      onChange={(e) => setMaintForm({ ...maintForm, maintenanceCost: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Technician / Vendor Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={maintForm.technicianName}
                      onChange={(e) => setMaintForm({ ...maintForm, technicianName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Work Done / Description *</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={maintForm.description}
                      onChange={(e) => setMaintForm({ ...maintForm, description: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Maintenance Status</label>
                    <select
                      className="form-control"
                      value={maintForm.status}
                      onChange={(e) => setMaintForm({ ...maintForm, status: e.target.value })}
                    >
                      <option value="COMPLETED">COMPLETED (Sets condition to GOOD)</option>
                      <option value="IN_PROGRESS">IN PROGRESS (Sets condition to UNDER MAINTENANCE)</option>
                    </select>
                  </div>

                  <div className="form-group form-full">
                    <label className="form-label">Resolution Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={maintForm.resolutionNotes}
                      onChange={(e) => setMaintForm({ ...maintForm, resolutionNotes: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMaintOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Record Service Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Equipment"
        message={`Are you sure you want to remove ${equipmentToDelete?.equipmentName} (${equipmentToDelete?.equipmentCode}) from inventory?`}
        confirmText="Yes, Delete Equipment"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />
    </div>
  );
}
