import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    profile_picture: ''
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const [profileRes, donationsRes] = await Promise.all([
        axios.get('/profile'),
        axios.get('/donations')
      ]);
      setProfile(profileRes.data);
      setDonations(donationsRes.data);
      setFormData({
        bio: profileRes.data.profile.bio || '',
        profile_picture: profileRes.data.profile.profile_picture || ''
      });
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/profile', formData);
      setEditing(false);
      fetchProfileData();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <button
                onClick={() => setEditing(!editing)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                {editing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Information */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="mx-auto h-24 w-24 bg-gray-300 rounded-full flex items-center justify-center">
                    {profile?.profile.profile_picture ? (
                      <img
                        src={profile.profile.profile_picture}
                        alt="Profile"
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-gray-600">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.full_name}</h2>
                  <p className="text-gray-600">@{user.username}</p>
                  <p className="text-gray-500">{user.city}</p>
                </div>

                {editing ? (
                  <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="4"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Profile Picture URL</label>
                      <input
                        type="url"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={formData.profile_picture}
                        onChange={(e) => setFormData({...formData, profile_picture: e.target.value})}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                    >
                      Save Changes
                    </button>
                  </form>
                ) : (
                  <div className="mt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Bio</h3>
                    <p className="text-gray-600">
                      {profile?.profile.bio || 'No bio available'}
                    </p>
                  </div>
                )}
              </div>

              {/* Statistics and Donations */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">💰</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Total Donated</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          ${profile?.profile.total_donated.toLocaleString() || '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">📊</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Campaigns Created</p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {profile?.profile.total_campaigns || '0'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                          <span className="text-white text-sm">🏆</span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">Verification</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {profile?.profile.verification_status || 'Unverified'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Donation History</h3>
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Campaign
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Message
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {donations.map((donation) => (
                            <tr key={donation.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                ${donation.amount.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                Campaign #{donation.campaign_id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {donation.message || '-'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(donation.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {donations.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No donations yet. Start donating to help your city climb the rankings!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
