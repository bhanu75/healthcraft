import React, { useState } from 'react';
import { Brain, Heart, Smile, Frown, Meh, Plus } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { getTodayDate } from '../../utils/helpers';

const Psychology = () => {
  const { psychologyData, addPsychologyEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [notes, setNotes] = useState('');

  const moods = [
    { value: 'great', label: 'Great', icon: '😊', color: 'success' },
    { value: 'good', label: 'Good', icon: '🙂', color: 'info' },
    { value: 'okay', label: 'Okay', icon: '😐', color: 'warning' },
    { value: 'bad', label: 'Bad', icon: '😔', color: 'error' },
  ];

  const handleSubmit = () => {
    if (!mood) return;

    addPsychologyEntry({
      date: getTodayDate(),
      mood,
      energy,
      notes,
      timestamp: new Date().toISOString(),
    });

    setMood('');
    setEnergy(5);
    setNotes('');
    setShowForm(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-500" />
            Psychology Tracker
          </h1>
          <p className="text-sm text-base-content/60">Track your mental wellness</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Coming Soon Card */}
      <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl">
        <div className="card-body text-center">
          <div className="text-6xl mb-4">🧠</div>
          <h2 className="card-title justify-center text-2xl mb-2">
            Coming Soon
          </h2>
          <p className="opacity-90">
            Track your mood, motivation, and mental wellness journey
          </p>
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Mood Tracking</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Brain className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Motivation Log</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Smile className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Stress Levels</p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
              <Meh className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm font-medium">Energy Tracking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mood Form Preview (Functional but in development) */}
      {showForm && (
        <div className="card bg-base-100 shadow-xl animate-slide-up">
          <div className="card-body">
            <h3 className="card-title text-lg mb-4">How are you feeling?</h3>
            
            {/* Mood Selection */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {moods.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`btn btn-lg flex-col gap-2 ${
                    mood === m.value ? `btn-${m.color}` : 'btn-outline'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <span className="text-xs">{m.label}</span>
                </button>
              ))}
            </div>

            {/* Energy Level */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Energy Level</span>
                <span className="label-text-alt">{energy}/10</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={energy}
                onChange={(e) => setEnergy(e.target.value)}
                className="range range-primary"
                step="1"
              />
            </div>

            {/* Notes */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Notes (Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="How was your day?"
                className="textarea textarea-bordered h-24"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSubmit}
                disabled={!mood}
                className="btn btn-primary flex-1"
              >
                Save Entry
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-ghost flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title text-lg mb-3">Upcoming Features</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="badge badge-primary badge-lg">📊</div>
              <div>
                <p className="font-medium">Daily mood patterns</p>
                <p className="text-sm text-base-content/60">
                  Visualize your emotional trends over time
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="badge badge-secondary badge-lg">💭</div>
              <div>
                <p className="font-medium">Gratitude journal</p>
                <p className="text-sm text-base-content/60">
                  Build positive thinking habits
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="badge badge-accent badge-lg">🎯</div>
              <div>
                <p className="font-medium">Goal setting & tracking</p>
                <p className="text-sm text-base-content/60">
                  Set mental wellness goals and track progress
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Psychology;
