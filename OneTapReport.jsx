import React, { useState, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Image, AlertCircle, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import Webcam from 'react-webcam';

export default function OneTapReport() {
  const [searchParams] = useSearchParams();
  const binId = searchParams.get('binId');
  const navigate = useNavigate();
  const webcamRef = useRef(null);
  const [issueType, setIssueType] = useState('Broken Lid');
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueOptions = [
    'Broken Lid',
    'Spill / Overflow',
    'Illegal Dumping',
    'Other'
  ];

  const getLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
      },
      (err) => console.error('Location error:', err),
      { enableHighAccuracy: true }
    );
  }, []);

  React.useEffect(() => {
    getLocation();
  }, [getLocation]);

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
  }, [webcamRef]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) return;

    setSubmitting(true);
    try {
      const reportData = {
        binId: binId || null,
        issueType,
        location: {
          type: 'Point',
          coordinates: [location.lng, location.lat]
        },
        photo: photo ? photo.split(',')[1] : null, // base64 without prefix
        status: 'Pending'
      };

      await createReport(reportData);
      setSubmitted(true);
      setTimeout(() => navigate('/citizen'), 2000);
    } catch (err) {
      console.error('Report submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900/50 to-slate-900 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-12 text-center shadow-2xl max-w-md mx-auto">
          <CheckCircle className="w-24 h-24 text-emerald-400 mx-auto mb-6 animate-bounce" />
          <h1 className="text-3xl font-bold text-emerald-400 mb-4">Report Submitted!</h1>
          <p className="text-slate-300 mb-8">Thank you for helping keep our city clean.</p>
          <p className="text-sm text-slate-400">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-md mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700 rounded-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-8">
            Report Issue
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type */}
            <div>
              <label className="block text-slate-400 mb-3 font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-400" />
                Issue Type
              </label>
              <select 
                value={issueType} 
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors text-white"
                required
              >
                {issueOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
              <label className="block text-emerald-400 mb-2 font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Auto GPS Location
              </label>
              {location ? (
                <p className="text-emerald-300 font-mono">
                  📍 {location.lat?.toFixed(4)}, {location.lng?.toFixed(4)}
                </p>
              ) : (
                <p className="text-slate-400 italic">Getting location...</p>
              )}
            </div>

            {/* Photo Capture */}
            <div>
              <label className="block text-slate-400 mb-3 font-semibold flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Upload Photo (Optional)
              </label>
              <div className="space-y-3">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{ facingMode: 'environment' }}
                  className="w-full rounded-xl border-4 border-dashed border-slate-700 bg-slate-900 aspect-video object-cover"
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Image className="w-5 h-5" />
                  Capture Photo
                </button>
                {photo && (
                  <img 
                    src={photo} 
                    alt="Captured" 
                    className="w-full max-h-48 object-cover rounded-xl border border-emerald-500/50 shadow-lg"
                  />
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !location}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Submit Report
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
