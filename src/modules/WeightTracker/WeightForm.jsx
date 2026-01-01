import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { getTodayDate, isValidWeight } from '../../utils/helpers';

const WeightForm = ({ onSubmit, onCancel }) => {
  const [date, setDate] = useState(getTodayDate());
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');

    if (!weight) {
      setError('Please enter your weight');
      return;
    }

    if (!isValidWeight(weight)) {
      setError('Please enter a valid weight (1-500 kg)');
      return;
    }

    onSubmit(date, weight);
    setWeight('');
    setDate(getTodayDate());
  };

  return (
    <div className="card bg-base-100 shadow-xl animate-slide-up">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="card-title text-lg">Add Weight Entry</h3>
          <button 
            onClick={onCancel}
            className="btn btn-sm btn-circle btn-ghost"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Date Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Date</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full focus:input-primary"
              max={getTodayDate()}
            />
          </div>

          {/* Weight Input */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">Weight (kg)</span>
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="input input-bordered w-full focus:input-primary"
            />
            {error && (
              <label className="label">
                <span className="label-text-alt text-error">{error}</span>
              </label>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSubmit}
              className="btn btn-primary flex-1 gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Entry
            </button>
            <button
              onClick={onCancel}
              className="btn btn-ghost flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeightForm;
