import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CheckCircle2, Square, Warehouse } from 'lucide-react';
import StallMap from '../../components/StallMap';
import { stallsAPI } from '../../api/axios';
import type { Stall } from '../../types/StallType';


export default function ReserveStalls() {
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStalls, setSelectedStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadStalls();
  }, []);

  const loadStalls = async () => {
    try {
      const response = await stallsAPI.getAvailable();
      setStalls(response.stalls || []);
    } catch (error) {
      console.error('Failed to load stalls:', error);
      alert('Failed to load stalls. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStallClick = (stall: Stall) => {
    if (!stall.isAvailable) return;

    const isSelected = selectedStalls.find(s => s.id === stall.id);
    
    if (isSelected) {
      setSelectedStalls(selectedStalls.filter(s => s.id !== stall.id));
    } else {
      if (selectedStalls.length >= 3) {
        alert('You can only reserve a maximum of 3 stalls per business.');
        return;
      }
      setSelectedStalls([...selectedStalls, stall]);
    }
  };

  const removeFromCart = (stallId: number) => {
    setSelectedStalls(selectedStalls.filter(s => s.id !== stallId));
  };

  const handleConfirmReservation = () => {
    if (selectedStalls.length === 0) {
      alert('Please select at least one stall to proceed.');
      return;
    }
    setShowConfirmation(true);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stalls...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Reserve Exhibition Stalls
            </h1>
            <p className="text-gray-600 mt-2">
              Select up to 3 stalls for your business at BMICH
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className='text-lg font-bold text-gray-900 mb-4 flex items-center gap-3'>
          <Warehouse className="w-5 h-5 text-gray-500" />
          Stall Type Legend
        </h3>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-14 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-400 border-2 border-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Small Stall (2x2m) - LKR 20,000</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-yellow-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">M</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Medium Stall (3x3m) - LKR 35,000</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-400 border-2 border-red-500 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold text-white">L</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Large Stall (4x3m) - LKR 50,000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gray-300 border-2 border-gray-400 rounded-lg flex items-center justify-center opacity-60">
                <span className="text-xs text-gray-600">✕</span>
              </div>
              <span className="text-sm font-medium text-gray-700">Reserved</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-gray-600" />
          Selected Stalls ({selectedStalls.length}/3)
        </h3>
        
        {selectedStalls.length === 0 ? (
          <div className="text-center py-8">
            <Square className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No stalls selected yet</p>
          </div>
        ) : (
          <div className="space-y-2 mb-4">
            {selectedStalls.map(stall => (
              <div key={stall.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                  <p className="font-semibold text-gray-900">Stall {stall.name}</p>
                  <p className="text-xs text-gray-600">{stall.size} - {stall.dimensions}</p>
                </div>
                <button
                  onClick={() => removeFromCart(stall.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedStalls.length > 0 && (
          <button
            onClick={handleConfirmReservation}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg"
          >
            Proceed to Reservation
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <StallMap 
            stalls={stalls}
            selectedStalls={selectedStalls}
            onStallClick={handleStallClick}
            showLegend={false}
          />
        </div>

        <div className="hidden lg:block">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-gray-600" />
              Selected Stalls
            </h3>
            
            <div className="mb-4">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-blue-800 font-medium text-center">
                  {selectedStalls.length} / 3 Selected
                </p>
              </div>
            </div>

            {selectedStalls.length === 0 ? (
              <div className="text-center py-8">
                <Square className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No stalls selected</p>
              </div>
            ) : (
              <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
                {selectedStalls.map(stall => {
                  const getStallBgColor = () => {
                    switch(stall.size) {
                      case 'SMALL': return 'from-emerald-50 to-emerald-100 border-emerald-200';
                      case 'MEDIUM': return 'from-yellow-50 to-yellow-100 border-yellow-200';
                      case 'LARGE': return 'from-red-50 to-red-100 border-red-200';
                      default: return 'from-gray-50 to-gray-100 border-gray-200';
                    }
                  };

                  const getStallTextColor = () => {
                    switch(stall.size) {
                      case 'SMALL': return 'text-emerald-700';
                      case 'MEDIUM': return 'text-yellow-700';
                      case 'LARGE': return 'text-red-700';
                      default: return 'text-gray-700';
                    }
                  };

                  return (
                    <div key={stall.id} className={`p-3 bg-gradient-to-br ${getStallBgColor()} rounded-lg border`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">Stall {stall.name}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            <span className="font-semibold">{stall.size}</span>
                          </p>
                          <p className="text-xs text-gray-500">{stall.dimensions}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(stall.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className={`flex items-center gap-1 ${getStallTextColor()} text-xs`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Selected</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {selectedStalls.length > 0 && (
              <>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Total Stalls:</span>
                      <span className="font-semibold">{selectedStalls.length}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Small:</span>
                      <span className="font-semibold">
                        {selectedStalls.filter(s => s.size === 'SMALL').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Medium:</span>
                      <span className="font-semibold">
                        {selectedStalls.filter(s => s.size === 'MEDIUM').length}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Large:</span>
                      <span className="font-semibold">
                        {selectedStalls.filter(s => s.size === 'LARGE').length}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmReservation}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Proceed to Reservation
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Reservation</h3>
              <p className="text-gray-600">You are about to reserve the following stalls:</p>
            </div>

            <div className="space-y-2 mb-6">
              {selectedStalls.map(stall => (
                <div key={stall.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-900">Stall {stall.name}</p>
                    <p className="text-sm text-gray-600">{stall.size} ({stall.dimensions})</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> A confirmation email with QR code will be sent to your registered email address.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}