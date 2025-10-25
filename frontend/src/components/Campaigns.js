import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function Campaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDonateForm, setShowDonateForm] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    category_id: ''
  });
  const [donationData, setDonationData] = useState({
    amount: '',
    message: '',
    is_anonymous: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [campaignsRes, categoriesRes] = await Promise.all([
        axios.get('/campaigns'),
        axios.get('/categories')
      ]);
      setCampaigns(campaignsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/campaigns', {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        category_id: formData.category_id ? parseInt(formData.category_id) : null
      });
      setFormData({ title: '', description: '', target_amount: '', category_id: '' });
      setShowCreateForm(false);
      fetchData();
    } catch (error) {
      console.error('Failed to create campaign:', error);
    }
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/donations', {
        ...donationData,
        amount: parseFloat(donationData.amount),
        campaign_id: selectedCampaign.id
      });
      setDonationData({ amount: '', message: '', is_anonymous: false });
      setShowDonateForm(false);
      setSelectedCampaign(null);
      fetchData();
    } catch (error) {
      console.error('Failed to make donation:', error);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Create Campaign
          </button>
        </div>

        {/* Create Campaign Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Campaign</h3>
                <form onSubmit={handleCreateCampaign}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="3"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Target Amount</label>
                      <input
                        type="number"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={formData.target_amount}
                        onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <select
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={formData.category_id}
                        onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Donate Modal */}
        {showDonateForm && selectedCampaign && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Donate to {selectedCampaign.title}</h3>
                <form onSubmit={handleDonate}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        value={donationData.amount}
                        onChange={(e) => setDonationData({...donationData, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Message (Optional)</label>
                      <textarea
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="3"
                        value={donationData.message}
                        onChange={(e) => setDonationData({...donationData, message: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={donationData.is_anonymous}
                        onChange={(e) => setDonationData({...donationData, is_anonymous: e.target.checked})}
                      />
                      <label className="ml-2 block text-sm text-gray-900">Anonymous donation</label>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDonateForm(false);
                        setSelectedCampaign(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Donate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{campaign.title}</h3>
                <p className="text-gray-600 mb-4">{campaign.description}</p>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{((campaign.current_amount / campaign.target_amount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{width: `${Math.min((campaign.current_amount / campaign.target_amount) * 100, 100)}%`}}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>${campaign.current_amount.toLocaleString()}</span>
                    <span>${campaign.target_amount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Status: <span className={`font-medium ${
                      campaign.status === 'active' ? 'text-green-600' : 
                      campaign.status === 'completed' ? 'text-blue-600' : 'text-red-600'
                    }`}>
                      {campaign.status}
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setShowDonateForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm"
                  >
                    Donate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
