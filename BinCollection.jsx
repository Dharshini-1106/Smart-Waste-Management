import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Camera, CheckCircle, Upload, Thermometer, Image, X, AlertTriangle } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBinById, collectBin } from '../lib/api';

export default function BinCollection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bin, setBin] = useState(null);
  const [fillLevel, setFillLevel] = useState(92);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const loadBin = async () => {
      try {
        const res = await getBinById(id);
        setBin(res.data);
        setFillLevel(res.data.fillLevel || 92);
      } catch {
        // Dummy data
      }
    };
    loadBin();
  }, [id]);

  const takePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], 'bin-collection-proof.jpg', { type: 'image/jpeg' });
        setPhoto(file);
        const url = URL.createObjectURL(file);
        setPhotoPreview(url);
        stream.getTracks().forEach(track => track.stop());
      }, 'image/jpeg', 0.8);
    } catch (err) {
      console.error('Camera access denied', err);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const confirmCollection = async () => {
    if (!photo) return;
    
    setIsCollecting(true);
    try {
      await collectBin(id, { fillLevel: 0, photo: photo, status: 'collected' });
      setSuccess(true);
      setTimeout(() => navigate('/driver/list'), 2000);
    } catch (err) {
      console.error('Collection failed', err);
    } finally {
      setIsCollecting(false);
    }
  };

  const goBack = () => navigate('/driver/list');

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-slate-800/50 rounded-xl backdrop-blur-sm transition-all">
          <ChevronLeft className="w-6 h-6 text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Bin Collection</h1>
          <p className="text-slate-400">Confirm collection for <span className="font-mono text-cyan-400">B{bin?.id || id}</span></p>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6">
        {/* Bin Status */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-3xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-4">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-mono font-bold text-orange-400">{fillLevel}%</span>
                <Thermometer className="w-8 h-8 text-orange-400" />
              </div>
              <p className="text-slate-400">Fill level before collection</p>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 rounded-2xl h-2">
            <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-2xl" style={{ width: `${fillLevel}%` }} />
          </div>
        </div>

        {/* Photo Proof */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Image className="w-6 h-6" />
            Collection Proof Photo
          </h3>
          
          {photoPreview ? (
            <div className="relative group">
              <img src={photoPreview} alt="Collection proof" className="w-full max-w-md mx-auto rounded-3xl shadow-2xl border-4 border-emerald-500/30" />
              <button 
                onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                className="absolute -top-3 -right-3 bg-slate-900 border-2 border-slate-700 p-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/80 hover:border-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Camera */}
              <button 
                onClick={takePhoto}
                className="group relative bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-3xl p-12 hover:border-cyan-400 hover:bg-slate-800/80 transition-all flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-white">Take Photo</p>
                <p className="text-sm text-slate-400">Use camera</p>
              </button>

              {/* Upload */}
              <label className="cursor-pointer group relative bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-3xl p-12 hover:border-emerald-400 hover:bg-slate-800/80 transition-all flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-white">Upload Photo</p>
                <p className="text-sm text-slate-400">From gallery</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleUpload}
                />
              </label>
            </div>
          )}
        </div>

        {/* Video for camera (hidden) */}
        <video 
          ref={videoRef} 
          className="hidden"
          playsInline
        />
      </div>

      {/* Confirm Button */}
      <div className="p-6 bg-gradient-to-t from-slate-900/50 to-transparent border-t border-slate-700">
        <button 
          onClick={confirmCollection}
          disabled={!photo || isCollecting}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:from-slate-700 disabled:to-slate-600 text-white font-bold py-5 px-8 rounded-3xl shadow-2xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all disabled:cursor-not-allowed flex items-center gap-3 justify-center text-xl"
        >
          {isCollecting ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Collecting...
            </>
          ) : (
            <>
              <CheckCircle className="w-7 h-7" />
              Confirm Collection Complete
            </>
          )}
        </button>
        {success && (
          <div className="mt-4 p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-400 text-center font-bold animate-in slide-in-from-top-2 fade-in duration-300">
            Collection confirmed! Returning to list...
          </div>
        )}
      </div>
    </div>
  );
}
