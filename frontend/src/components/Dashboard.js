import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [campaignsRes, donationsRes, statsRes] = await Promise.all([
        axios.get('/campaigns'),
        axios.get('/donations'),
        axios.get('/global-statistics')
      ]);
      
      setCampaigns(campaignsRes.data);
      setDonations(donationsRes.data);
      setGlobalStats(statsRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome back, {user.full_name}!
        </h1>
        
        {/* Global Statistics */}
        {globalStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">🏙️</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Cities
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {globalStats.total_cities}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">💰</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Donations
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${globalStats.total_donations.toLocaleString()}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">👥</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Donors
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {globalStats.total_donors}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                      <span className="text-white text-sm">📊</span>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Avg per City
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ${globalStats.average_donation_per_city.toFixed(2)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Recent Campaigns
              </h3>
              <div className="space-y-4">
                {campaigns.slice(0, 5).map((campaign) => (
                  <div key={campaign.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{campaign.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Progress</span>
                        <span>{((campaign.current_amount / campaign.target_amount) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{width: `${(campaign.current_amount / campaign.target_amount) * 100}%`}}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>${campaign.current_amount.toLocaleString()}</span>
                        <span>${campaign.target_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Donations */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Your Recent Donations
              </h3>
              <div className="space-y-4">
                {donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          ${donation.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Campaign ID: {donation.campaign_id}
                        </p>
                        {donation.message && (
                          <p className="text-sm text-gray-500 mt-1">
                            "{donation.message}"
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {donations.length === 0 && (
                  <p className="text-gray-500 text-center py-4">
                    No donations yet. Start donating to help your city climb the rankings!
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
