
import { AlertCircle, Loader2, Plus, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { stallsAPI } from '../../api/axios';
import StallMap from '../../components/StallMap';
import AdminLayout from '../../layout/AdminLayout';
import type { Stall } from '../../types/StallType';

export default function AdminStalls() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  



  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await stallsAPI.getAll();
      setStalls(response.stalls || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load stalls');
    } finally {
      setLoading(false);
    }
  };



  const handleStallClick = (stall: Stall) => {
    
    navigate(`/admin/stalls/${stall.id}`);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-[#4dd9e8] animate-spin" />
            <p className="text-gray-600">Loading stalls...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex items-center gap-3 p-6 border border-red-200 rounded-xl bg-red-50">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <div>
              <p className="font-medium text-red-700">{error}</p>
              <button
                onClick={loadStalls}
                className="mt-2 text-sm text-red-600 underline hover:text-red-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl">
      
        <div className="p-6 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <Store className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Stalls Management</h1>
                <p className="text-gray-600">Manage all exhibition stalls</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/admin/stalls/create')}
              className="flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] rounded-lg hover:shadow-lg transition-all font-medium"
            >
              <Plus size={20} />
              Add Stall
            </button>
          </div>
        </div>

      

     
        <div className="mb-6">
          <StallMap 
            stalls={stalls}
            onStallClick={handleStallClick}
            readOnly={true}
            showLegend={true}
            highlightReserved={false}
          />
        </div>
      </div>
    </AdminLayout>
  );
}