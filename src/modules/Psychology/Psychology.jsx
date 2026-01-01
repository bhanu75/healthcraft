import React, { useState } from 'react';
import { Brain, Plus, X, Sparkles } from 'lucide-react';
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
      energy: Number(energy),
      stress: Number(stress),
      motivation: Number(motivation),
      notes,
      gratitude,
      timestamp: new Date().toISOString(),
    });

    setMood('');
    setEnergy(5);
    setStress(5);
    setMotivation(5);
    setNotes('');
    setGratitude('');
    setShowForm(false);
  };

  const getMoodEmoji = (value) =>
    moods.find(m => m.value === value)?.icon ?? '😐';

  const getAverageMood = () => {
    if (!psychologyData.length) return null;

    const moodValues = { great: 4, good: 3, okay: 2, bad: 1 };
    const avg =
      psychologyData.reduce(
        (sum, e) => sum + (moodValues[e.mood] || 2),
        0
      ) / psychologyData.length;

    if (avg >= 3.5) return { emoji: '😊', text: 'Great' };
    if (avg >= 2.5) return { emoji: '🙂', text: 'Good' };
    if (avg >= 1.5) return { emoji: '😐', text: 'Okay' };
    return { emoji: '😔', text: 'Needs Care' };
  };

  const avgMood = getAverageMood();
  const avgEnergy = psychologyData.length
    ? (psychologyData.reduce((a, e) => a + e.energy, 0) / psychologyData.length).toFixed(1)
    : 0;
  const avgMotivation = psychologyData.length
    ? (psychologyData.reduce((a, e) => a + e.motivation, 0) / psychologyData.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
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

      {/* Stats */}
      {psychologyData.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="card bg-purple-500 text-white">
            <div className="card-body p-4">
              <p className="text-xs">Avg Mood</p>
              <p className="text-3xl">{avgMood?.emoji}</p>
              <p>{avgMood?.text}</p>
            </div>
          </div>

          <div className="card bg-orange-500 text-white">
            <div className="card-body p-4">
              <p className="text-xs">Avg Energy</p>
              <p className="text-2xl font-bold">{avgEnergy}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>

          <div className="card bg-pink-500 text-white">
            <div className="card-body p-4">
              <p className="text-xs">Motivation</p>
              <p className="text-2xl font-bold">{avgMotivation}</p>
              <p className="text-xs">/10</p>
            </div>
          </div>
        </div>
      )}

      {/* Quote */}
      <div className="card bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="card-body text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2" />
          <p className="italic">
            “Your mental health is just as important as your physical health.”
          </p>
        </div>
      </div>

      {/* Entries */}
      {psychologyData.length > 0 && (
        <div className="card bg-base-100">
          <div className="card-body">
            <h2 className="card-title">Recent Check-ins</h2>
            <div className="space-y-3">
              {psychologyData.slice(0, 10).map((e, i) => (
                <div key={i} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex gap-3">
                      <span className="text-3xl">{getMoodEmoji(e.mood)}</span>
                      <div>
                        <p className="font-medium">{formatDate(e.date)}</p>
                        <p className="text-xs opacity-60">
                          ⚡ {e.energy}/10 · 😰 {e.stress}/10 · 🎯 {e.motivation}/10
                        </p>
                      </div>
                    </div>

                    {e.notes && <p className="italic mt-2">"{e.notes}"</p>}
                    {e.gratitude && (
                      <p className="text-sm mt-2">
                        <strong>Grateful for:</strong> {e.gratitude}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-md">
            <div className="card-body">
              <div className="flex justify-between">
                <h3 className="card-title">How are you feeling?</h3>
                <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
                  <X />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 my-4">
                {moods.map(m => (
                  <button
                    key={m.value}
                    onClick={() => setMood(m.value)}
                    className={`btn ${mood === m.value ? `btn-${m.color}` : 'btn-outline'}`}
                  >
                    <div className="text-2xl">{m.icon}</div>
                    <div className="text-xs">{m.label}</div>
                  </button>
                ))}
              </div>

              <input type="range" min="1" max="10" value={energy} onChange={e => setEnergy(e.target.value)} />
              <input type="range" min="1" max="10" value={stress} onChange={e => setStress(e.target.value)} />
              <input type="range" min="1" max="10" value={motivation} onChange={e => setMotivation(e.target.value)} />

              <input
                className="input input-bordered mt-2"
                placeholder="Grateful for..."
                value={gratitude}
                onChange={e => setGratitude(e.target.value)}
              />

              <textarea
                className="textarea textarea-bordered mt-2"
                placeholder="Notes"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />

              <button onClick={handleSubmit} className="btn btn-primary mt-4" disabled={!mood}>
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
