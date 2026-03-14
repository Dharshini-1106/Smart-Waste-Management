import React, { useState, useEffect } from 'react';
import { Search, AlertTriangle, User, MapPin, Camera, Truck, CheckCircle, X } from 'lucide-react';

export default function ReportsManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrivers, setSelectedDrivers] = useState([]);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await fetch('/api/admin/reports?status=pending', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = reports.filter(report => 
    report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (report.userId && report.userId.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const assignDriver = async (reportId, driverId) => {
    try {
      await fetch(`/api/admin/reports/${reportId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ driverId })
      });
      fetchReports();
    } catch (err) {
      console.error('Error assigning driver', err);
    }
  };

  const resolveReport = async (reportId) => {
    if (confirm('Mark as resolved?')) {
      try {
        await fetch(`/api/admin/reports/${reportId}/resolve`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        fetchReports();
      } catch (err) {
        console.error('Error resolving report', err);
      }
    }
  };

  const deleteReport = async (reportId) => {
    if (confirm('Delete this report?')) {
      try {
        await fetch(`/api/admin/reports/${reportId}`, { method: 'DELETE' });
        fetchReports();
      } catch (err) {
        console.error('Error deleting report', err);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'resolved': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      default: return 'bg-red-500/20 text-red-400 border-red-500/30';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-700 p-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <AlertTriangle className="text-red-400" />
          Reports Management
        </h1>
        <p className="text-slate-400">Review and assign citizen reports</p>
      </div>

      <div className="p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
          <input 
            type="search" 
            placeholder="Search reports by title or user..." 
            className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl focus:border-emerald-500 focus:outline-none"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <div className="grid grid-cols-[40px_1fr_120px_140px_100px_120px] gap-4 text-sm font-bold text-slate-400 items-center">
              <span>#</span>
              <span>Title / Type</span>
              <span>Bin</span>
              <span>User</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400">Loading reports...</div>
            ) : filteredReports.length === 0 ? (
              <div className="p-12 text-center text-slate-400">No reports found</div>
            ) : filteredReports.map((report, index) => (
              <div key={report._id} className="p-6 border-t border-slate-700 hover:bg-slate-900/50 transition-colors grid grid-cols-[40px_1fr_120px_140px_100px_120px] gap-4 items-center">
                <span className="font-mono font-bold">{index + 1}</span>
                <div>
                  <p className="font-bold">{report.title}</p>
                  <p className="text-sm text-slate-400 capitalize">{report.issueType}</p>
                </div>
                <span>{report.binId?.neighborhood || 'N/A'}</span>
                <span>{report.userId?.email || 'Anonymous'}</span>
                <span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(report.status)}`}>
                    {report.status.toUpperCase()}
                  </span>
                </span>
                <div className="flex gap-2">
                  {report.photos && report.photos.length > 0 && (
                    <button onClick={() => {
                      setSelectedPhotos(report.photos);
                      setShowPhotoModal(true);
                    }} className="p-2 hover:bg-slate-700 rounded-lg">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                  {report.status === 'pending' && (
                    <select onChange={(e) => assignDriver(report._id, e.target.value)} className="bg-slate-700 px-2 py-1 rounded">
                      <option value="">Assign Driver</option>
                      <option value="driver1">John D. (Truck #1)</option>
                      <option value="driver2">Sarah K. (Truck #2)</option>
                    </select>
                  )}
                  <button onClick={() => resolveReport(report._id)} className="p-2 hover:bg-emerald-600 rounded-lg text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteReport(report._id)} className="p-2 hover:bg-red-600 rounded-lg text-red-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Photos Modal */}
        {showPhotoModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">Report Photos</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedPhotos.map((photo, index) => (
                  <img key={index} src={photo} alt="Report photo" className="w-full h-48 object-cover rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors cursor-pointer" />
                ))}
              </div>
              <button onClick={() => setShowPhotoModal(false)} className="mt-6 bg-slate-700 hover:bg-slate-600 py-3 px-8 rounded-xl font-bold">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

