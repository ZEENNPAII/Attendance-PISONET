'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Shield, 
  Gift, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Users,
  CheckCircle
} from 'lucide-react';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { 
  getRewards, 
  addReward, 
  updateReward, 
  deleteReward 
} from '@/lib/database';
import { Reward } from '@/types';

export default function AdminRewardsPage() {
  const router = useRouter();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<Reward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    requiredDays: '',
    redeemDate: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || !isAdmin()) {
      router.push('/admin');
      return;
    }

    loadRewards();
    setIsLoading(false);
  }, [router]);

  const loadRewards = () => {
    setRewards(getRewards());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      requiredDays: '',
      redeemDate: ''
    });
    setShowAddForm(false);
    setEditingReward(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.requiredDays || !formData.redeemDate) {
      setMessage('Please fill in all fields');
      return;
    }

    if (editingReward) {
      // Update existing reward
      const success = updateReward(editingReward.id, {
        name: formData.name,
        description: formData.description,
        requiredDays: parseInt(formData.requiredDays),
        redeemDate: formData.redeemDate
      });
      
      if (success) {
        setMessage('Reward updated successfully');
        loadRewards();
        resetForm();
      } else {
        setMessage('Failed to update reward');
      }
    } else {
      // Add new reward
      addReward({
        name: formData.name,
        description: formData.description,
        requiredDays: parseInt(formData.requiredDays),
        redeemDate: formData.redeemDate
      });
      
      setMessage('Reward added successfully');
      loadRewards();
      resetForm();
    }
  };

  const handleEdit = (reward: Reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name,
      description: reward.description,
      requiredDays: reward.requiredDays.toString(),
      redeemDate: reward.redeemDate
    });
    setShowAddForm(true);
  };

  const handleDelete = (rewardId: string) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      const success = deleteReward(rewardId);
      if (success) {
        setMessage('Reward deleted successfully');
        loadRewards();
      } else {
        setMessage('Failed to delete reward');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-red-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Reward Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-success-50 border border-success-200 text-success-700">
            {message}
            <button
              onClick={() => setMessage('')}
              className="ml-2 text-success-600 hover:text-success-800"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Rewards List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">All Rewards</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Reward</span>
                </button>
              </div>

              {rewards.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No rewards configured yet</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Add your first reward to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {reward.name}
                            </h3>
                            {reward.claimed && (
                              <CheckCircle className="h-5 w-5 text-success-600" />
                            )}
                          </div>
                          <p className="text-gray-600 mb-3">{reward.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>Requires {reward.requiredDays} days</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Redeemable on {new Date(reward.redeemDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => handleEdit(reward)}
                            className="p-2 text-gray-400 hover:text-primary-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reward.id)}
                            className="p-2 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Add/Edit Form */}
          <div>
            {showAddForm && (
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingReward ? 'Edit Reward' : 'Add New Reward'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Reward Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="e.g., 5 Kilo Rice"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      required
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Describe the reward..."
                    />
                  </div>

                  <div>
                    <label htmlFor="requiredDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Required Attendance Days
                    </label>
                    <input
                      type="number"
                      id="requiredDays"
                      name="requiredDays"
                      required
                      min="1"
                      value={formData.requiredDays}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="20"
                    />
                  </div>

                  <div>
                    <label htmlFor="redeemDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Redeem Date
                    </label>
                    <input
                      type="date"
                      id="redeemDate"
                      name="redeemDate"
                      required
                      value={formData.redeemDate}
                      onChange={handleInputChange}
                      className="input-field"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="btn-primary flex-1"
                    >
                      {editingReward ? 'Update Reward' : 'Add Reward'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Quick Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rewards:</span>
                  <span className="font-semibold">{rewards.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Claimed Rewards:</span>
                  <span className="font-semibold">
                    {rewards.filter(r => r.claimed).length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Rewards:</span>
                  <span className="font-semibold">
                    {rewards.filter(r => !r.claimed).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
