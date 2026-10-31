import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  RefreshCw,
  Printer,
  DollarSign,
  Users,
  CreditCard,
  UserCheck,
  Wrench,
  Filter
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { api } from '../api/apiClient';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Reports({ onShowToast: _onShowToast }) {
  const startDateInit = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDateInit = new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(startDateInit);
  const [endDate, setEndDate] = useState(endDateInit);

  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const data = await api.getReports(startDate, endDate);
      setReportData(data);
    } catch (err) {
      console.warn('Reports fetch fallback:', err);
      // Demo report data
      setReportData({
        totalMembers: 6,
        activeMembers: 5,
        expiredMembers: 1,
        rangeRevenue: 729.96,
        totalSubscriptions: 6,
        totalSessionsInRange: 4,
        totalMaintenanceCost: 430.0,
        paymentsList: [
          { id: 1, invoiceNumber: 'INV-2026-001', member: { fullName: 'Alexander Hayes' }, amount: 399.99, paymentDate: '2026-07-28', paymentMethod: 'CARD' },
          { id: 2, invoiceNumber: 'INV-2026-002', member: { fullName: 'Sophia Rodriguez' }, amount: 49.99, paymentDate: '2026-10-04', paymentMethod: 'UPI' },
          { id: 4, invoiceNumber: 'INV-2026-004', member: { fullName: 'Elena Rostova' }, amount: 229.99, paymentDate: '2026-08-30', paymentMethod: 'CASH' },
          { id: 5, invoiceNumber: 'INV-2026-005', member: { fullName: 'David Chen' }, amount: 49.99, paymentDate: '2026-10-18', paymentMethod: 'CARD' },
        ],
        sessionsList: [
          { id: 1, member: { fullName: 'Alexander Hayes' }, trainer: { name: 'Viktor Kane' }, trainingDate: '2026-10-30', sessionStatus: 'SCHEDULED' },
          { id: 2, member: { fullName: 'Sophia Rodriguez' }, trainer: { name: 'Samantha Drake' }, trainingDate: '2026-10-30', sessionStatus: 'SCHEDULED' },
          { id: 4, member: { fullName: 'Elena Rostova' }, trainer: { name: 'Aria Thorne' }, trainingDate: '2026-10-29', sessionStatus: 'COMPLETED' },
        ],
        maintenanceList: [
          { id: 1, equipment: { equipmentName: 'Life Fitness Cable Crossover' }, maintenanceCost: 180.0, maintenanceDate: '2026-10-25', status: 'IN_PROGRESS' },
          { id: 2, equipment: { equipmentName: 'Matrix Commercial Treadmill' }, maintenanceCost: 250.0, maintenanceDate: '2026-09-30', status: 'COMPLETED' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchReport();
  }, []);

  const handleApplyFilter = (e) => {
    e.preventDefault();
    fetchReport();
  };

  const handlePrint = () => {
    window.print();
  };

  // Bar Chart Configuration
  const barChartData = {
    labels: ['Total Revenue ($)', 'Maintenance Spend ($)'],
    datasets: [
      {
        label: 'Financial Flow ($)',
        data: [
          reportData?.rangeRevenue || 729.96,
          reportData?.totalMaintenanceCost || 430.0,
        ],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(255, 107, 0, 0.8)'],
        borderColor: ['#10B981', '#FF6B00'],
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#161922',
        titleColor: '#FF6B00',
        bodyColor: '#FFFFFF',
        borderColor: 'rgba(255, 107, 0, 0.3)',
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94A3B8' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: {
          color: '#94A3B8',
          callback: (value) => `$${value}`,
        },
      },
    },
  };

  return (
    <div className="page-wrapper" id="printable-report">
      {/* Header */}
      <div className="page-header">
        <div className="page-header-title">
          <h1>Analytics & Financial Reports</h1>
          <p>Audited performance metrics, revenue statements, trainer sessions, and maintenance costs</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary" onClick={handlePrint}>
            <Printer size={16} /> Print / Export PDF
          </button>
          <button className="btn btn-primary" onClick={fetchReport}>
            <RefreshCw size={16} /> Refresh Metrics
          </button>
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="card" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <form onSubmit={handleApplyFilter} style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>
            <Filter size={18} color="var(--primary-orange)" />
            <span>Date Filter:</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>From:</label>
            <input
              type="date"
              className="form-control"
              style={{ padding: '6px 12px' }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>To:</label>
            <input
              type="date"
              className="form-control"
              style={{ padding: '6px 12px' }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-sm">
            Apply Date Range
          </button>
        </form>
      </div>

      {/* Summary KPI Grid */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card accent-green">
          <div className="stat-card-header">
            <span className="stat-card-title">Range Revenue</span>
            <div className="stat-icon green"><DollarSign size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: '#10B981' }}>
            ${reportData?.rangeRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="stat-card-footer">
            <span>Collected in selected timeframe</span>
          </div>
        </div>

        <div className="stat-card accent-orange">
          <div className="stat-card-header">
            <span className="stat-card-title">Active / Total Members</span>
            <div className="stat-icon orange"><Users size={22} /></div>
          </div>
          <div className="stat-card-value">
            {reportData?.activeMembers || 0} / {reportData?.totalMembers || 0}
          </div>
          <div className="stat-card-footer">
            <span>{reportData?.expiredMembers || 0} expired members</span>
          </div>
        </div>

        <div className="stat-card accent-blue">
          <div className="stat-card-header">
            <span className="stat-card-title">PT Sessions in Period</span>
            <div className="stat-icon blue"><UserCheck size={22} /></div>
          </div>
          <div className="stat-card-value">
            {reportData?.totalSessionsInRange || 0}
          </div>
          <div className="stat-card-footer">
            <span>Coaching sessions conducted</span>
          </div>
        </div>

        <div className="stat-card accent-red">
          <div className="stat-card-header">
            <span className="stat-card-title">Maintenance Costs</span>
            <div className="stat-icon red"><Wrench size={22} /></div>
          </div>
          <div className="stat-card-value" style={{ color: 'var(--danger)' }}>
            ${reportData?.totalMaintenanceCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
          <div className="stat-card-footer">
            <span>Equipment service and parts</span>
          </div>
        </div>
      </div>

      {/* Financial Comparison Chart */}
      <div className="card" style={{ marginBottom: '28px' }}>
        <div className="card-header">
          <div className="card-title">
            <BarChart3 size={20} className="card-title-icon" />
            <span>Revenue vs Maintenance Expenditure Overview</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Financial comparison for selected period
          </span>
        </div>
        <div style={{ height: '260px' }}>
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </div>

      {/* Detailed Tables Split */}
      <div className="grid-2">
        {/* Payment History in Period */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <CreditCard size={18} className="card-title-icon" />
              <span>Payments in Period</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {reportData?.paymentsList?.length || 0} records
            </span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice</th>
                  <th>Member</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.paymentsList?.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--primary-orange)', fontWeight: 600 }}>{p.invoiceNumber}</td>
                    <td>{p.member?.fullName}</td>
                    <td style={{ fontWeight: 700, color: '#fff' }}>${p.amount?.toFixed(2)}</td>
                    <td>{p.paymentDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sessions in Period */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <UserCheck size={18} className="card-title-icon" />
              <span>Coaching Sessions in Period</span>
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {reportData?.sessionsList?.length || 0} sessions
            </span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Member</th>
                  <th>Trainer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.sessionsList?.slice(0, 6).map((s) => (
                  <tr key={s.id}>
                    <td>{s.trainingDate}</td>
                    <td style={{ fontWeight: 600, color: '#fff' }}>{s.member?.fullName}</td>
                    <td style={{ color: 'var(--primary-orange)' }}>{s.trainer?.name}</td>
                    <td>
                      <span className="badge badge-orange">{s.sessionStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
