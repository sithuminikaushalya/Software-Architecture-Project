// frontend/src/pages/vendor/Profile.tsx
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Building2, QrCode, Download } from 'lucide-react';

interface UserProfile {
  id: number;
  email: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  address: string;
  role: string;
  createdAt: string;
}

interface Reservation {
  id: number;
  stallName: string;
  qrCodeUrl?: string;
}

export default function VendorProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = sessionStorage.getItem('authToken');
        
        // Fetch user profile
        const profileResponse = await fetch('http://localhost:4000/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setUser(profileData.user);
        }

        // Fetch reservations for QR codes
        const reservationsResponse = await fetch('http://localhost:4000/api/reservations/user/current', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (reservationsResponse.ok) {
          const reservationsData = await reservationsResponse.json();
          setReservations(reservationsData.reservations || []);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        // Mock data for demo
        setUser({
          id: 1,
          email: 'publisher@example.com',
          businessName: 'Galaxy Books',
          contactPerson: 'Ishara',
          phone: '077-0000000',
          address: 'Colombo 7',
          role: 'VENDOR',
          createdAt: '2024-01-01T00:00:00Z'
        });
        setReservations([
          { id: 1, stallName: 'Stall A', qrCodeUrl: '/qr-sample.png' },
          { id: 2, stallName: 'Stall B', qrCodeUrl: '/qr-sample.png' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2ab7c9]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load profile data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account information and QR codes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-[#2ab7c9]" />
                Business Information
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Business Name
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.businessName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4 inline mr-2" />
                    Contact Person
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.contactPerson}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-gray-900">{user.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Business Address
                </label>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Codes */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#2ab7c9]" />
                Entry QR Codes
              </h2>
            </div>
            <div className="p-6">
              {reservations.filter(r => r.qrCodeUrl).length === 0 ? (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No QR codes available yet</p>
                  <p className="text-gray-400 text-xs mt-1">
                    QR codes will be generated after stall reservations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations
                    .filter(reservation => reservation.qrCodeUrl)
                    .map((reservation) => (
                      <div
                        key={reservation.id}
                        className="border border-gray-200 rounded-lg p-4 text-center"
                      >
                        <div className="bg-gray-100 rounded-lg p-4 mb-3">
                          <div className="w-32 h-32 mx-auto bg-white flex items-center justify-center rounded">
                            <span className="text-gray-400 text-xs">QR Code</span>
                            {/* In real app: <img src={reservation.qrCodeUrl} alt={`QR for ${reservation.stallName}`} /> */}
                          </div>
                        </div>
                        <p className="font-medium text-gray-900 mb-2">
                          {reservation.stallName}
                        </p>
                        <button
                          onClick={() => window.open(reservation.qrCodeUrl, '_blank')}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-[#4dd9e8] to-[#2ab7c9] text-white rounded-lg font-medium hover:shadow-lg transition-all text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download QR
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Bring your QR codes for exhibition entry</li>
              <li>• Each stall requires a separate QR code</li>
              <li>• QR codes are sent to your email after reservation</li>
              <li>• Maximum 3 stalls per vendor</li>
              <li>• Keep your contact information updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}