'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Lock, Key, Facebook, Instagram, Music } from 'lucide-react';
import { addPlayer, getPlayerByUsername } from '@/lib/database';
import { loginPlayer } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    pincode: '',
    facebook: '',
    instagram: '',
    tiktok: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else {
      const existingPlayer = await getPlayerByUsername(formData.username);
      if (existingPlayer) {
        newErrors.username = 'Username already exists';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 5) {
      newErrors.password = 'Password must be at least 5 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{4}$/.test(formData.pincode)) {
      newErrors.pincode = 'Pincode must be exactly 4 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);
    
    try {
      // Add player to database
      const success = await addPlayer({
        username: formData.username,
        password: formData.password,
        pincode: formData.pincode,
        socials: {
          facebook: formData.facebook,
          instagram: formData.instagram,
          tiktok: formData.tiktok
        }
      });

      if (success) {
        // Auto-login the user
        await loginPlayer(formData.username, formData.password);
        
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setErrors({ general: 'Registration failed. Please try again.' });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100">
            <User className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join the LCP PISO NET Attendance System
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1 relative">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`input-field ${errors.username ? 'border-red-300' : ''}`}
                  placeholder="Enter your username"
                />
                <User className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`input-field ${errors.password ? 'border-red-300' : ''}`}
                  placeholder="Enter your password"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`input-field ${errors.confirmPassword ? 'border-red-300' : ''}`}
                  placeholder="Confirm your password"
                />
                <Lock className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Pincode */}
            <div>
              <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                4-Digit Pincode
              </label>
              <div className="mt-1 relative">
                <input
                  id="pincode"
                  name="pincode"
                  type="password"
                  required
                  maxLength={4}
                  value={formData.pincode}
                  onChange={handleInputChange}
                  className={`input-field ${errors.pincode ? 'border-red-300' : ''}`}
                  placeholder="1234"
                />
                <Key className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-1 text-xs text-gray-500">This will be used for daily check-ins</p>
              {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
            </div>

            {/* Social Media Links (Optional) */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Social Media Links (Optional)</h3>
              
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <div className="mt-1 relative">
                  <input
                    id="facebook"
                    name="facebook"
                    type="url"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://facebook.com/yourprofile"
                  />
                  <Facebook className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <div className="mt-1 relative">
                  <input
                    id="instagram"
                    name="instagram"
                    type="url"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://instagram.com/yourprofile"
                  />
                  <Instagram className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700">
                  TikTok
                </label>
                <div className="mt-1 relative">
                  <input
                    id="tiktok"
                    name="tiktok"
                    type="url"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://tiktok.com/@yourprofile"
                  />
                  <Music className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
