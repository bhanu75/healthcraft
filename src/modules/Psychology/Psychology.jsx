import React, { useState } from 'react';
import { Brain, Heart, Smile, Frown, Meh, Plus, X, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { getTodayDate, formatDate } from '../../utils/helpers';

const Psychology = () => {
  const { psychologyData, addPsychologyEntry } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [mood, setMood] = useState('');
  const [energy, setEnergy] = useState(5);
  const [stress, setStress] = useState(5);
  const [motivation, setMotivation] = useState(5);
  const [notes, setNotes] = useState('');
  const [gratitude, setGratitude] = useState('');

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
      energy: parseInt(energy),
      stress: parseInt(stress),
      motivation: parseInt(motivation),
      notes,
      gratitude,
      timestamp: new Date().toISOString(),
    });

    // Reset form
    setMood('');
    setEnergy(5);
    setStress(5);
    setMotivation(5);
    setNotes('');
    setGratitude('');
    setShowForm(false);
  };

  const getMoodEmoji = (moodValue) => {
    const found = moods.find(m => m.value === moodValue);
    return found ? found.icon : '😐';
  };

  const getAverageMood = () => {
    if (psychologyData.length === 0) return null;
    const moodValues = { great: 4, good: 3, okay: 2, bad: 1 };
    const sum = psychologyData.reduce((acc, entry) => acc + (moodValues[entry.mood] || 2), 0);
    const avg = sum / psychologyData.length;
    if (avg >= 3.5) return { emoji: '😊', text: 'Great', color: 'success' };
    if (avg >= 2.5) return { emoji: '🙂', text: 'Good', color: 'info' };
    if (avg >= 1.5) return { emoji: '😐', text: 'Okay', color: 'warning' };
    return { emoji: '😔', text: 'Needs Care', color: 'error' };
  };

  const avgMood = getAverageMood();
  const avgEnergy = psychologyData.length > 0 
    ? (psychologyData.reduce((acc, e) => acc + e.energy, 0) / psychologyData.length).toFixed(1)
    : 0;
  const avgMotivation = psychologyData.length > 0
    ? (psychologyData.reduce((acc, e) => acc + e.motivation, 0) / psychologyData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-base-content flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-500" />
            Mind Tracker
          </h1>
          <p className="text-sm text-base-content/60">Track your mental wellness</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-circle shadow-lg"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {/* Stats Cards */}
      {psychologyData.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <div className="card-body p-4">
              <p className="text-xs opacity-80 mb-1">Avg Mood</p>
              <p className="text-3xl mb-1">{avgMood?.emoji}</p>
              <p className="text-sm">{avgMood?.text}</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            <div className="card-body p-4">
              <p className="text-xs opacity-80 mb-1">Avg Energy</p>
              <p className="text-2xl font-bold mb-1">{avgEnergy}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg">
            <div className="card-body p-4">
              <p className="text-xs opacity-80 mb-1">Motivation</p>
              <p className="text-2xl font-bold mb-1">{avgMotivation}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>
        </div>
      )}

      {/* Motivational Quote */}
      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xl">
        <div className="card-body p-6 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-3 animate-pulse" />
          <p className="text-lg font-medium italic">
            "Your mental health is just as important as your physical health"
          </p>
          <p className="text-sm opacity-80 mt-2">Take a moment to check in with yourself</p>
        </div>
      </div>

      {/* Recent Entries */}
      {psychologyData.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-lg mb-3">Recent Check-ins</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {psychologyData.slice(0, 10).map((entry, idx) => (
                <div key={idx} className="card bg-base-200 shadow">
                  <div className="card-body p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                        <div>
                          <p className="font-medium">{formatDate(entry.date)}</p>
                          <div className="flex gap-3 text-xs text-base-content/60 mt-1">
                            <span>⚡ {entry.energy}/10</span>
                            <span>😰 {entry.stress}/10</span>
                            <span>🎯 {entry.motivation}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-base-content/70 mt-2 italic">
                        "{entry.notes}"
                      </p>
                    )}
                    {entry.gratitude && (
                      <div className="bg-base-300 rounded-lg p-2 mt-2">
                        <p className="text-xs font-medium text-success">Grateful for:</p>
                        <p className="text-sm">{entry.gratitude}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {psychologyData.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <Brain className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Start Your Wellness Journey</h3>
            <p className="text-base-content/60 mb-6">
              Track your mood, energy, and motivation to understand patterns
            </p>
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-wide">
              Add First Check-in
            </button>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-md my-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="card-title text-lg">How are you feeling?</h3>
                  <button onClick={() => setShowForm(false)} className="btn btn-sm btn-circle btn-ghost">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Mood Selection */}
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Mood</span>
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {moods.map((m) => (
                        <button
                          key={m.value}
                          onClick={() => setMood(m.value)}
                          className={`btn btn-lg flex-col gap-1 ${
                            mood === m.value ? `btn-${m.color}` : 'btn-outline'
                          }`}
                        >
                          <span className="text-2xl">{m.icon}</span>
                          <span className="text-xs">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Energy Level */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Energy Level</span>
                      <span className="label-text-alt font-bold text-lg">{energy}/10</span>
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
                    <div className="w-full flex justify-between text-xs px-2 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  {/* Stress Level */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Stress Level</span>
                      <span className="label-text-alt font-bold text-lg">{stress}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stress}
                      onChange={(e) => setStress(e.target.value)}
                      className="range range-error"
                      step="1"
                    />
                  </div>

                  {/* Motivation Level */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Motivation Level</span>
                      <span className="label-text-alt font-bold text-lg">{motivation}/10</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={motivation}
                      onChange={(e) => setMotivation(e.target.value)}
                      className="range range-success"
                      step="1"
                    />
                  </div>

                  {/* Gratitude */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">What are you grateful for?</span>
                    </label>
                    <input
                      type="text"
                      value={gratitude}
                      onChange={(e) => setGratitude(e.target.value)}
                      placeholder="Something positive today..."
                      className="input input-bordered"
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
                      className="textarea textarea-bordered h-20"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSubmit}
                      disabled={!mood}
                      className="btn btn-primary flex-1"
                    >
                      Save Check-in
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Psychology;  return (
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
