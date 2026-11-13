import { useEffect, useState } from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

export function PrivacyTimer({ 
  jobId, 
  onDelete 
}: { 
  jobId: string; 
  onDelete: () => void; 
}) {
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await fetch(`${API_BASE_URL}/api/v1/conversions/${jobId}`, {
        method: 'DELETE',
      });
      onDelete();
    } catch (error) {
      console.error('Failed to delete job', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-6 border border-zinc-800 bg-zinc-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between">
      <div className="flex items-center text-zinc-300 mb-4 sm:mb-0">
        <ShieldCheck className="w-5 h-5 mr-2.5 text-zinc-400" />
        <div>
          <p className="font-medium text-sm text-zinc-200">Privacy Guaranteed</p>
          <p className="text-xs text-zinc-400">
            Files auto-delete in <span className="font-mono font-bold text-zinc-200">{formatTime(timeLeft)}</span>
          </p>
        </div>
      </div>
      
      <button 
        onClick={handleDelete}
        disabled={isDeleting}
        className="flex items-center px-4 py-2 bg-red-950/30 hover:bg-red-950/60 text-red-400 text-sm font-medium rounded-lg transition border border-red-900/40 disabled:opacity-50"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        {isDeleting ? 'Deleting...' : 'Delete Now'}
      </button>
    </div>
  );
}
