import { useEffect, useState } from "react";
import { ShoppingCart, Trash2, CheckCircle2, Square, Warehouse, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StallMap from "../../components/StallMap";
import { reservationsAPI, stallsAPI } from "../../api/axios";
import type { Stall } from "../../types/StallType";

export default function ReserveStalls() {
  const navigate = useNavigate();
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [selectedStalls, setSelectedStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [confirmationError, setConfirmationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void loadStalls(true);
  }, []);

  const loadStalls = async (showSpinner = false) => {
    if (showSpinner) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      setFetchError(null);
      const response = await stallsAPI.getAll();
      const list = response.stalls || [];
      setStalls(list);
      setSelectedStalls((prev) =>
        prev
          .map((selected) => list.find((stall) => stall.id === selected.id && stall.isAvailable))
          .filter((stall): stall is Stall => Boolean(stall))
      );
    } catch (error: any) {
      console.error("Failed to load stalls:", error);
      setFetchError(error?.message || "Failed to load stalls. Please try again.");
    } finally {
      if (showSpinner) {
        setLoading(false);
      } else {
        setRefreshing(false);
      }
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
      alert("Please select at least one stall to proceed.");
      return;
    }
    setConfirmationError(null);
    setShowConfirmation(true);
  };

  const confirmReservation = async () => {
    if (selectedStalls.length === 0) return;
    setIsSubmitting(true);
    setConfirmationError(null);
    try {
      await Promise.all(selectedStalls.map((stall) => reservationsAPI.create(stall.id)));
      setShowConfirmation(false);
      setSelectedStalls([]);
      setSuccessMessage(
        `Successfully reserved ${selectedStalls.length} stall${selectedStalls.length > 1 ? "s" : ""}.`
      );
      await loadStalls(false);
    } catch (error: any) {
      console.error("Failed to confirm reservation:", error);
      setConfirmationError(error?.message || "Failed to confirm reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
      {fetchError && (
        <div className="flex items-center gap-3 p-4 border border-red-200 rounded-lg bg-red-50 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{fetchError}</span>
          <button
            onClick={() => void loadStalls(false)}
            className="ml-auto inline-flex items-center gap-1 text-red-700 hover:text-red-900 font-semibold"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
            Retry
          </button>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center justify-between p-4 border border-green-200 rounded-lg bg-green-50 text-green-800 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSuccessMessage(null);
                navigate("/vendor/my-reservations");
              }}
              className="text-green-700 font-semibold hover:underline"
            >
              View reservations
            </button>
            <button onClick={() => setSuccessMessage(null)} className="text-green-700 hover:text-green-900">
              ×
            </button>
          </div>
        </div>
      )}
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
          {refreshing && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Updating stall availability...
            </div>
          )}
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
              {selectedStalls.map((stall) => (
                <div
                  key={stall.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-semibold text-gray-900">Stall {stall.name}</p>
                    <p className="text-sm text-gray-600">
                      {stall.size} ({stall.dimensions})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> A confirmation email with QR code will be sent to your registered email address.
              </p>
            </div>

            {confirmationError && (
              <div className="mb-4 p-3 border border-red-200 rounded-lg bg-red-50 text-sm text-red-700">
                {confirmationError}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={confirmReservation}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}