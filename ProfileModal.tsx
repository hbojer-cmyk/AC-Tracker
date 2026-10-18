// ProfileModal.tsx - Cyber flight-deck styled Profile Management Modal & First-Load Setup
import React, { useState } from 'react';
import {
  X,
  User,
  Plus,
  Copy,
  Trash2,
  Check,
  AlertTriangle,
  Download,
  Shield,
  Sparkles,
  Plane,
  Edit2
} from 'lucide-react';
import {
  ProfileData,
  ProfileMeta,
  DEFAULT_AVATARS,
  DEFAULT_ACCENT_COLORS,
  generateProfileId,
  createBlankProfile,
  cloneProfile
} from './profiles';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Record<string, ProfileData>;
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onSaveProfile: (profile: ProfileData) => void;
  onDeleteProfile: (id: string) => void;
  onExportProfile: (id: string) => void;
  onExportAllProfiles: () => void;
  initialMode?: 'manage' | 'create';
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onExportProfile,
  onExportAllProfiles,
  initialMode = 'manage',
}) => {
  const [mode, setMode] = useState<'manage' | 'create' | 'edit'>(initialMode);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  // Form states for Create / Edit
  const [formName, setFormName] = useState('');
  const [formEmoji, setFormEmoji] = useState('✈️');
  const [formAcCode, setFormAcCode] = useState('');
  const [formColor, setFormColor] = useState('#00e5ff');
  const [cloneSourceId, setCloneSourceId] = useState<string>('blank');

  // Deletion confirmation state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const profileList = Object.values(profiles);

  const startCreate = () => {
    setFormName('');
    setFormEmoji('✈️');
    setFormAcCode('');
    setFormColor('#00e5ff');
    setCloneSourceId('blank');
    setMode('create');
  };

  const startEdit = (profile: ProfileData) => {
    setEditingProfileId(profile.meta.id);
    setFormName(profile.meta.name);
    setFormEmoji(profile.meta.emoji || '✈️');
    setFormAcCode(profile.meta.acCode || '');
    setFormColor(profile.meta.accentColor || '#00e5ff');
    setMode('edit');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = formName.trim() || 'Pilot Commander';
    const newMeta: ProfileMeta = {
      id: generateProfileId(),
      name: finalName,
      emoji: formEmoji,
      acCode: formAcCode.trim().toUpperCase(),
      accentColor: formColor,
      createdAt: Date.now(),
    };

    let newProfile: ProfileData;
    if (cloneSourceId !== 'blank' && profiles[cloneSourceId]) {
      newProfile = cloneProfile(profiles[cloneSourceId], newMeta);
    } else {
      newProfile = createBlankProfile(newMeta);
    }

    onSaveProfile(newProfile);
    onSelectProfile(newMeta.id);
    setMode('manage');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfileId || !profiles[editingProfileId]) return;

    const existing = profiles[editingProfileId];
    const updated: ProfileData = {
      ...existing,
      meta: {
        ...existing.meta,
        name: formName.trim() || existing.meta.name,
        emoji: formEmoji,
        acCode: formAcCode.trim().toUpperCase(),
        accentColor: formColor,
      },
    };

    onSaveProfile(updated);
    setEditingProfileId(null);
    setMode('manage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-subtle)] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-base)]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/15 border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-heading text-[var(--text-main)] flex items-center gap-2">
                {mode === 'manage' && 'Manage Profiles'}
                {mode === 'create' && 'Create New Profile'}
                {mode === 'edit' && 'Edit Profile'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {mode === 'manage' && 'Switch, customize, or export individual pilot command profiles'}
                {mode === 'create' && 'Set up a new flight progression and fleet hangar'}
                {mode === 'edit' && 'Update profile identity, callsign code, or accent color'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-lg hover:bg-[var(--border-subtle)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {mode === 'manage' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Pilot Profiles ({profileList.length})
                </span>
                <button
                  type="button"
                  onClick={startCreate}
                  className="px-3 py-1.5 rounded-xl bg-[var(--accent)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Profile
                </button>
              </div>

              {/* Profiles List */}
              <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
                {profileList.map(p => {
                  const isActive = p.meta.id === activeProfileId;
                  const isPendingDelete = deletingId === p.meta.id;

                  return (
                    <div
                      key={p.meta.id}
                      className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 shadow-sm'
                          : 'border-[var(--border-subtle)] bg-[var(--bg-base)]/30 hover:border-[var(--border-subtle)]/80'
                      }`}
                    >
                      {/* Left: Avatar & Info */}
                      <div
                        onClick={() => {
                          if (!isActive) onSelectProfile(p.meta.id);
                        }}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 border relative"
                          style={{
                            borderColor: p.meta.accentColor || 'var(--accent)',
                            backgroundColor: `${p.meta.accentColor || '#00e5ff'}20`,
                          }}
                        >
                          <span>{p.meta.emoji || '✈️'}</span>
                          <span
                            className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-black/40"
                            style={{ backgroundColor: p.meta.accentColor || 'var(--accent)' }}
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[var(--text-main)] truncate">
                              {p.meta.name}
                            </span>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
                            {p.meta.acCode ? (
                              <span className="font-mono bg-[var(--border-subtle)]/40 px-1.5 py-0.5 rounded text-[11px] text-[var(--text-main)]">
                                🆔 {p.meta.acCode}
                              </span>
                            ) : (
                              <span>No Code</span>
                            )}
                            <span>•</span>
                            <span>{Object.keys(p.userData || {}).length} destinations logged</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        {!isActive && (
                          <button
                            type="button"
                            onClick={() => onSelectProfile(p.meta.id)}
                            className="px-2.5 py-1 text-xs rounded-lg font-medium border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                          >
                            Switch
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          title="Edit Profile"
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--border-subtle)]/60 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onExportProfile(p.meta.id)}
                          title="Export Single Profile JSON"
                          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--border-subtle)]/60 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        {profileList.length > 1 && (
                          <>
                            {isPendingDelete ? (
                              <div className="flex items-center gap-1 bg-rose-500/10 border border-rose-500/30 rounded-lg p-1 animate-in fade-in">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onDeleteProfile(p.meta.id);
                                    setDeletingId(null);
                                  }}
                                  className="px-2 py-0.5 text-[11px] font-bold bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors"
                                >
                                  Delete
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setDeletingId(null)}
                                  className="px-1.5 py-0.5 text-[11px] text-[var(--text-muted)] hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDeletingId(p.meta.id)}
                                title="Delete Profile"
                                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Multi-Profile Master Actions */}
              <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onExportAllProfiles}
                  className="w-full sm:w-auto px-3.5 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export All Profiles Backup
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--border-subtle)] hover:bg-[var(--border-subtle)]/80 text-[var(--text-main)] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {(mode === 'create' || mode === 'edit') && (
            <form onSubmit={mode === 'create' ? handleCreateSubmit : handleEditSubmit} className="space-y-4">
              {/* Display Name Input */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Profile Name / Callsign
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alastair, Commander 01, Hangar Alt"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              {/* AC Profile Code */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Airport City Profile Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={12}
                    placeholder="e.g. 207ZK0GJT or 20HALQZDW"
                    value={formAcCode}
                    onChange={e => setFormAcCode(e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] font-mono text-sm tracking-wider uppercase text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)] transition-colors"
                  />
                  <div className="absolute right-3 top-2.5 text-[10px] text-[var(--text-muted)]">
                    In-Game Code
                  </div>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-1">
                  Your 9-character Airport City friend & commander code
                </p>
              </div>

              {/* Emoji Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Pilot Avatar Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AVATARS.map(em => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setFormEmoji(em)}
                      className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition-all ${
                        formEmoji === em
                          ? 'border-2 border-[var(--accent)] bg-[var(--accent)]/20 scale-105'
                          : 'border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)]/40'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent Color Selector */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                  Accent Color Tag
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {DEFAULT_ACCENT_COLORS.map(col => (
                    <button
                      key={col}
                      type="button"
                      onClick={() => setFormColor(col)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        formColor === col ? 'scale-125 border-white shadow-md' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: col }}
                    />
                  ))}
                  <input
                    type="color"
                    value={formColor}
                    onChange={e => setFormColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                    title="Custom Color"
                  />
                </div>
              </div>

              {/* Clone Option (Only in Create Mode) */}
              {mode === 'create' && profileList.length > 0 && (
                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
                    Starting Data Template
                  </label>
                  <select
                    value={cloneSourceId}
                    onChange={e => setCloneSourceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)]"
                  >
                    <option value="blank">✨ Blank Profile (Fresh flight records & fleet)</option>
                    {profileList.map(p => (
                      <option key={p.meta.id} value={p.meta.id}>
                        📋 Clone flights & hangar from "{p.meta.name}"
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMode('manage')}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-[var(--border-subtle)] hover:bg-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:brightness-110 shadow-lg active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {mode === 'create' ? 'Create Profile' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

// First-load Migration Modal for existing users
interface MigrationModalProps {
  isOpen: boolean;
  onMigrate: (name: string, emoji: string, accentColor: string, acCode: string) => void;
}

export const MigrationModal: React.FC<MigrationModalProps> = ({ isOpen, onMigrate }) => {
  const [name, setName] = useState('Commander');
  const [emoji, setEmoji] = useState('✈️');
  const [acCode, setAcCode] = useState('');
  const [accentColor, setAccentColor] = useState('#00e5ff');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMigrate(name, emoji, accentColor, acCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-[var(--bg-card)] border border-[var(--accent)]/40 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/50 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center text-2xl">
            {emoji}
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 mb-1">
              <Sparkles className="w-3 h-3" />
              NEW MULTI-PROFILE UPGRADE
            </div>
            <h2 className="text-lg font-bold font-heading text-[var(--text-main)]">
              Welcome to AC-Tracker Multi-Profile!
            </h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Existing flight logs and aircraft hangar data were detected on this browser. Let's create your primary pilot profile to safely migrate all your progress into the new multi-profile system.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Pilot Name / Callsign
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alastair, Commander One"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-sm text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Airport City Code (Optional)
            </label>
            <input
              type="text"
              maxLength={12}
              placeholder="e.g. 207ZK0GJT"
              value={acCode}
              onChange={e => setAcCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] font-mono text-sm tracking-wider uppercase text-[var(--text-main)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Choose Avatar
            </label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_AVATARS.slice(0, 8).map(em => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setEmoji(em)}
                  className={`w-9 h-9 rounded-xl text-base flex items-center justify-center transition-all ${
                    emoji === em
                      ? 'border-2 border-[var(--accent)] bg-[var(--accent)]/20 scale-105'
                      : 'border border-[var(--border-subtle)]'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              {DEFAULT_ACCENT_COLORS.slice(0, 6).map(col => (
                <button
                  key={col}
                  type="button"
                  onClick={() => setAccentColor(col)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    accentColor === col ? 'scale-125 border-white' : 'border-transparent hover:scale-110'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-end">
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-bold bg-[var(--accent)] text-white hover:brightness-110 shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              Migrate & Launch AC-Tracker
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
