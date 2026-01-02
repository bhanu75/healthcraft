import React, { useState } from 'react';
import { Brain, Plus, X, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

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
    { value: 'great', label: 'Great', color: 'success' },
    { value: 'good', label: 'Good', color: 'info' },
    { value: 'okay', label: 'Okay', color: 'warning' },
    { value: 'bad', label: 'Bad', color: 'error' }
  ];

  const handleSubmit = () => {
    if (!mood) return;

    const today = new Date().toISOString().split('T')[0];
    
    addPsychologyEntry({
      date: today,
      mood: mood,
      energy: Number(energy),
      stress: Number(stress),
      motivation: Number(motivation),
      notes: notes,
      gratitude: gratitude,
      timestamp: new Date().toISOString()
    });

    setMood('');
    setEnergy(5);
    setStress(5);
    setMotivation(5);
    setNotes('');
    setGratitude('');
    setShowForm(false);
  };

  const getAverageMood = () => {
    if (psychologyData.length === 0) return null;

    const moodValues = { great: 4, good: 3, okay: 2, bad: 1 };
    let sum = 0;
    
    for (let i = 0; i < psychologyData.length; i++) {
      const entry = psychologyData[i];
      sum = sum + (moodValues[entry.mood] || 2);
    }
    
    const avg = sum / psychologyData.length;

    if (avg >= 3.5) return { text: 'Great', color: 'success' };
    if (avg >= 2.5) return { text: 'Good', color: 'info' };
    if (avg >= 1.5) return { text: 'Okay', color: 'warning' };
    return { text: 'Needs Care', color: 'error' };
  };

  const getAverageEnergy = () => {
    if (psychologyData.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < psychologyData.length; i++) {
      sum = sum + psychologyData[i].energy;
    }
    return (sum / psychologyData.length).toFixed(1);
  };

  const getAverageMotivation = () => {
    if (psychologyData.length === 0) return 0;
    let sum = 0;
    for (let i = 0; i < psychologyData.length; i++) {
      sum = sum + psychologyData[i].motivation;
    }
    return (sum / psychologyData.length).toFixed(1);
  };

  const avgMood = getAverageMood();
  const avgEnergy = getAverageEnergy();
  const avgMotivation = getAverageMotivation();

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-500" />
            Mind Tracker
          </h1>
          <p className="text-sm opacity-60">Track your mental wellness</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-circle"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>

      {psychologyData.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card bg-purple-500 text-white">
            <div className="card-body p-4 text-center">
              <p className="text-xs">Avg Mood</p>
              <p className="text-2xl font-bold">{avgMood ? avgMood.text : 'N/A'}</p>
            </div>
          </div>

          <div className="card bg-orange-500 text-white">
            <div className="card-body p-4 text-center">
              <p className="text-xs">Avg Energy</p>
              <p className="text-2xl font-bold">{avgEnergy}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>

          <div className="card bg-pink-500 text-white">
            <div className="card-body p-4 text-center">
              <p className="text-xs">Motivation</p>
              <p className="text-2xl font-bold">{avgMotivation}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="card-body text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2" />
          <p className="italic">
            Your mental health is just as important as your physical health.
          </p>
        </div>
      </div>

      {psychologyData.length > 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Check-ins</h2>
            <div className="space-y-3">
              {psychologyData.slice(0, 10).map((entry, index) => (
                <div key={index} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium capitalize">{entry.mood}</p>
                        <p className="text-sm opacity-60">{formatDate(entry.date)}</p>
                      </div>
                      <div className={`badge badge-${moods.find(m => m.value === entry.mood)?.color || 'ghost'}`}>
                        {entry.mood}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                      <div>
                        <span className="opacity-60">Energy: </span>
                        <span className="font-bold">{entry.energy}/10</span>
                      </div>
                      <div>
                        <span className="opacity-60">Stress: </span>
                        <span className="font-bold">{entry.stress}/10</span>
                      </div>
                      <div>
                        <span className="opacity-60">Motivation: </span>
                        <span className="font-bold">{entry.motivation}/10</span>
                      </div>
                    </div>

                    {entry.notes && (
                      <p className="text-sm italic mt-2 opacity-80">
                        {entry.notes}
                      </p>
                    )}
                    
                    {entry.gratitude && (
                      <p className="text-sm mt-2">
                        <strong>Grateful for:</strong> {entry.gratitude}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {psychologyData.length === 0 && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <h3 className="text-xl font-bold mb-2">Start Tracking Your Mind</h3>
            <p className="text-base-content/60 mb-4">
              Log your first mental wellness check-in
            </p>
            <button 
              onClick={() => setShowForm(true)} 
              className="btn btn-primary btn-wide"
            >
              Add First Check-in
            </button>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-md">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">How are you feeling?</h3>
                <button 
                  onClick={() => setShowForm(false)} 
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Select Your Mood</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {moods.map(m => (
                    <button
                      key={m.value}
                      onClick={() => setMood(m.value)}
                      className={`btn ${mood === m.value ? `btn-${m.color}` : 'btn-outline'}`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Energy Level</span>
                  <span className="label-text-alt font-bold">{energy}/10</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={energy} 
                  onChange={(e) => setEnergy(e.target.value)}
                  className="range range-primary"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Stress Level</span>
                  <span className="label-text-alt font-bold">{stress}/10</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={stress} 
                  onChange={(e) => setStress(e.target.value)}
                  className="range range-warning"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Motivation</span>
                  <span className="label-text-alt font-bold">{motivation}/10</span>
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={motivation} 
                  onChange={(e) => setMotivation(e.target.value)}
                  className="range range-success"
                />
              </div>

              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text">Gratitude</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="What are you grateful for?"
                  value={gratitude}
                  onChange={(e) => setGratitude(e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Notes</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  placeholder="Any notes about your day?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="3"
                />
              </div>

              <button 
                onClick={handleSubmit} 
                className="btn btn-primary btn-block mt-4" 
                disabled={!mood}
              >
                Save Check-in
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Psychology;
