import React, { useEffect, useState } from 'react';
import { Music, Users, BookOpen, Plus, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Character {
  id: number;
  name: string;
  role: string;
  actor: string;
  notes: string;
}

interface Scene {
  id: number;
  name: string;
  act: string;
  duration: string;
  notes: string;
}

type ActiveTab = 'characters' | 'scenes';

export default function MusicalDashboard() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('characters');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [loadingChars, setLoadingChars] = useState(false);
  const [loadingScenes, setLoadingScenes] = useState(false);
  const [newCharName, setNewCharName] = useState('');
  const [newCharRole, setNewCharRole] = useState('');
  const [newSceneName, setNewSceneName] = useState('');
  const [newSceneAct, setNewSceneAct] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const tabs = [
    { id: 'characters' as const, label: 'Characters', icon: Users },
    { id: 'scenes' as const, label: 'Scenes', icon: BookOpen },
  ];

  useEffect(() => {
    if (activeTab === 'characters') fetchCharacters();
    else fetchScenes();
  }, [activeTab]);

  const fetchCharacters = async () => {
    try {
      setLoadingChars(true);
      const resp = await fetch(`${apiUrl}/api/musical/characters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const { characters: data } = await resp.json();
        setCharacters(data);
      }
    } catch (err) {
      console.error('Failed to fetch characters:', err);
    } finally {
      setLoadingChars(false);
    }
  };

  const fetchScenes = async () => {
    try {
      setLoadingScenes(true);
      const resp = await fetch(`${apiUrl}/api/musical/scenes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (resp.ok) {
        const { scenes: data } = await resp.json();
        setScenes(data);
      }
    } catch (err) {
      console.error('Failed to fetch scenes:', err);
    } finally {
      setLoadingScenes(false);
    }
  };

  const addCharacter = async () => {
    if (!newCharName) return;
    try {
      const resp = await fetch(`${apiUrl}/api/musical/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCharName,
          role: newCharRole || 'Lead',
          actor: 'TBD',
        }),
      });
      if (resp.ok) {
        setNewCharName('');
        setNewCharRole('');
        await fetchCharacters();
      }
    } catch (err) {
      console.error('Failed to add character:', err);
    }
  };

  const deleteCharacter = async (id: number) => {
    try {
      await fetch(`${apiUrl}/api/musical/characters/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCharacters();
    } catch (err) {
      console.error('Failed to delete character:', err);
    }
  };

  const addScene = async () => {
    if (!newSceneName) return;
    try {
      const resp = await fetch(`${apiUrl}/api/musical/scenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newSceneName,
          act: newSceneAct || 'Act 1',
          duration: '5 min',
        }),
      });
      if (resp.ok) {
        setNewSceneName('');
        setNewSceneAct('');
        await fetchScenes();
      }
    } catch (err) {
      console.error('Failed to add scene:', err);
    }
  };

  const deleteScene = async (id: number) => {
    try {
      await fetch(`${apiUrl}/api/musical/scenes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchScenes();
    } catch (err) {
      console.error('Failed to delete scene:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-pink-600 rounded-lg">
              <Music className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Musical Production CMS</h1>
              <p className="text-slate-400 mt-1">Organize characters and scenes</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-slate-700">
          <div className="flex gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition border-b-2 ${
                    activeTab === tab.id
                      ? 'border-pink-500 text-pink-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
          {/* Characters Tab */}
          {activeTab === 'characters' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Characters</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition">
                  <Plus size={16} /> Add Character
                </button>
              </div>

              {/* Add Character Form */}
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newCharName}
                    onChange={(e) => setNewCharName(e.target.value)}
                    placeholder="Character name..."
                    className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="text"
                    value={newCharRole}
                    onChange={(e) => setNewCharRole(e.target.value)}
                    placeholder="Role (Lead, Supporting, etc)..."
                    className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    onClick={addCharacter}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Characters List */}
              {loadingChars ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <div key={char.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-white">{char.name}</h3>
                          <p className="text-sm text-slate-400">{char.role}</p>
                        </div>
                        <button
                          onClick={() => deleteCharacter(char.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-slate-300">Actor: {char.actor}</p>
                      {char.notes && <p className="text-xs text-slate-400 mt-2">{char.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
              {!loadingChars && characters.length === 0 && (
                <p className="text-center text-slate-400 py-8">No characters yet. Add one to get started!</p>
              )}
            </div>
          )}

          {/* Scenes Tab */}
          {activeTab === 'scenes' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Scenes</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition">
                  <Plus size={16} /> Add Scene
                </button>
              </div>

              {/* Add Scene Form */}
              <div className="mb-6 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    placeholder="Scene name..."
                    className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                  <input
                    type="text"
                    value={newSceneAct}
                    onChange={(e) => setNewSceneAct(e.target.value)}
                    placeholder="Act..."
                    className="flex-1 bg-slate-600 border border-slate-500 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-pink-500"
                  />
                  <button
                    onClick={addScene}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded font-medium transition"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Scenes List */}
              {loadingScenes ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-pink-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {scenes.map((scene) => (
                    <div key={scene.id} className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-white">{scene.name}</h3>
                          <p className="text-sm text-slate-400">
                            {scene.act} • {scene.duration}
                          </p>
                        </div>
                        <button
                          onClick={() => deleteScene(scene.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {scene.notes && <p className="text-xs text-slate-400 mt-2">{scene.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
              {!loadingScenes && scenes.length === 0 && (
                <p className="text-center text-slate-400 py-8">No scenes yet. Add one to get started!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
