import React, { useState } from 'react';
import { Target, X } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { getTodayDate } from '../../utils/helpers';

const GoalModal = ({ onClose }) => {
  const { goalWeight, goalDate, setGoal, getCurrentWeight } = useAppStore();
  const [weight, setWeight] = useState(goalWeight || '');
  const [date, setDate] = useState(goalDate || '');
  const [error, setError] = useState('');

  const currentWeight = getCurrentWeight();

  const handleSubmit = () => {
    setError('');

    if (!weight || parseFloat(weight) <= 0) {
      setError('Please enter a valid goal weight');
      return;
    }

    if (!date) {
      setError('Please select a target date');
      return;
    }

    const goalDate = new Date(date);
    const today = new Date();
    
    if (goalDate <= today) {
      setError('Target date must be in the future');
      return;
    }

    setGoal(parseFloat(weight), date);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="card bg-base-100 w-full max-w-md shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg flex items-center gap-2">
              <Target className="w-6 h-6 text-green-500" />
              Set Your Goal
            </h3>
            <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {currentWeight > 0 && (
              <div className="alert alert-info">
                <div className="text-sm">
                  <p>Current Weight: <strong>{currentWeight} kg</strong></p>
                </div>
              </div>
            )}

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Goal Weight (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your target weight"
                className="input input-bordered w-full focus:input-primary"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-medium">Target Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={getTodayDate()}
                className="input input-bordered w-full focus:input-primary"
              />
            </div>

            {error && (
              <div className="alert alert-error">
                <span className="text-sm">{error}</span>
              </div>
            )}

            {weight && currentWeight > 0 && (
              <div className="card bg-base-200">
                <div className="card-body p-4 text-sm">
                  <p className="font-medium">Goal Summary:</p>
                  <p>
                    {parseFloat(weight) < currentWeight ? 'Lose' : 'Gain'}{' '}
                    <strong>{Math.abs(currentWeight - parseFloat(weight)).toFixed(1)} kg</strong>
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmit} className="btn btn-primary flex-1">
                Set Goal
              </button>
              <button onClick={onClose} className="btn btn-ghost flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalModal;
