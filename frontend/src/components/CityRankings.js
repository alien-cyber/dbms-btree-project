import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function CityRankings() {
  const { user } = useAuth();
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRankings();
  }, []);

  const fetchRankings = async () => {
    try {
      const response = await axios.get('/city-rankings');
      setRankings(response.data);
    } catch (error) {
      setError('Failed to fetch city rankings');
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

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">City Rankings</h1>
        
        {/* Top 3 Cities */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">🏆 Top 3 Cities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rankings.top_cities.map((city, index) => (
              <div key={city.city} className={`bg-white rounded-lg shadow-md p-6 ${
                index === 0 ? 'ring-2 ring-yellow-400' : 
                index === 1 ? 'ring-2 ring-gray-300' : 
                index === 2 ? 'ring-2 ring-orange-400' : ''
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{city.city}</h3>
                  <span className={`text-2xl ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-500' : 
                    index === 2 ? 'text-orange-500' : ''
                  }`}>
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rank:</span>
                    <span className="font-semibold">#{city.rank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donations:</span>
                    <span className="font-semibold">${city.total_donations.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Donors:</span>
                    <span className="font-semibold">{city.total_donors}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Donation:</span>
                    <span className="font-semibold">${city.average_donation.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User City Context */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            📍 Your City Context ({user.city})
          </h2>
          {rankings.user_city_rank ? (
            <div className="mb-4">
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <strong>{user.city}</strong> is currently ranked <strong>#{rankings.user_city_rank}</strong> in the global rankings!
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <strong>{user.city}</strong> hasn't made any donations yet. Be the first to donate from your city!
              </div>
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      City
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Donations
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Donors
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Average Donation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankings.user_city_context.map((city) => (
                    <tr key={city.city} className={city.city === user.city ? 'bg-blue-50' : ''}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{city.rank}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.city === user.city ? (
                          <span className="font-bold text-blue-600">{city.city} (Your City)</span>
                        ) : (
                          city.city
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${city.total_donations.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {city.total_donors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${city.average_donation.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CityRankings;
