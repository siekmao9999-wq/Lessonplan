'use client';

import React, { useState } from 'react';
import {
  X,
  UserCheck,
  Shield,
  GraduationCap,
  Plus,
  Check,
  School,
  Phone,
  Mail,
  BookOpen,
  ArrowRightLeft,
} from 'lucide-react';
import { UserProfile, UserRole } from '@/types/auth';

interface UserRoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onAddNewUser: (newUser: Omit<UserProfile, 'id' | 'createdAt'>) => void;
}

export function UserRoleSwitcherModal({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onAddNewUser,
}: UserRoleSwitcherModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('user');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newSchool, setNewSchool] = useState(currentUser.schoolName || 'វិទ្យាល័យ ហ៊ុន សែន ស្គន់ (ជំនាន់ថ្មី)');
  const [newSubjects, setNewSubjects] = useState('រូបវិទ្យា, គណិតវិទ្យា');
  const [newGrades, setNewGrades] = useState('ថ្នាក់ទី១០, ថ្នាក់ទី១១');

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    onAddNewUser({
      name: newName.trim(),
      role: newRole,
      email: newEmail.trim() || `${Date.now()}@krouplan.edu.kh`,
      phoneNumber: newPhone.trim(),
      schoolName: newSchool.trim(),
      subjects: newSubjects.split(',').map((s) => s.trim()).filter(Boolean),
      grades: newGrades.split(',').map((g) => g.trim()).filter(Boolean),
      status: 'active',
    });

    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/75 backdrop-blur-xs overflow-y-auto no-print">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 text-slate-900 dark:text-slate-100 animate-in fade-in duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-moul text-sm sm:text-base text-white">
                គ្រប់គ្រងតួនាទី និងគណនី (Admin & User Switcher)
              </h3>
              <p className="text-xs text-sky-200 mt-0.5">
                ជ្រើសរើស ឬប្តូរគណនីរវាង នាយកសាលា (Admin) និង គ្រូបង្រៀន (User)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5 text-xs">
          {/* Role Comparison Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Admin Role Card */}
            <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/60 dark:bg-purple-950/30">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="font-bold text-xs text-purple-950 dark:text-purple-200">
                  តួនាទី Admin (នាយកសាលា/រដ្ឋបាល)
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li>ត្រួតពិនិត្យ និងអនុម័តកិច្ចតែងការរបស់គ្រូ</li>
                <li>ផ្តល់មតិកែលម្អលើកិច្ចតែងការ</li>
                <li>គ្រប់គ្រងបញ្ជីគ្រូបង្រៀន និងកំណត់តួនាទី</li>
                <li>មើលស្ថិតិ និងរបាយការណ៍បង្រៀនទូទាំងសាលា</li>
              </ul>
            </div>

            {/* User Role Card */}
            <div className="p-3.5 rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span className="font-bold text-xs text-sky-950 dark:text-sky-200">
                  តួនាទី User (លោកគ្រូ-អ្នកគ្រូបង្រៀន)
                </span>
              </div>
              <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc list-inside">
                <li>បង្កើត និងកែសម្រួលកិច្ចតែងការ ៥ ជំហាន</li>
                <li>បង្កើតសន្លឹកកិច្ចការ និងសម្ភារឧបទេស</li>
                <li>ដាក់ស្នើកិច្ចតែងការជូននាយកសាលាអនុម័ត</li>
                <li>ទាញយកជា Word / HTML / បោះពុម្ព PDF</li>
              </ul>
            </div>
          </div>

          {/* Current Active Profile Indicator */}
          <div className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-xs ${
                  currentUser.role === 'admin' ? 'bg-purple-600' : 'bg-sky-600'
                }`}
              >
                {currentUser.role === 'admin' ? '👑' : '👨‍🏫'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">
                    {currentUser.name}
                  </span>
                  {currentUser.isPermanentAdmin ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                      <span>👑</span>
                      <span>Admin អចិន្ត្រៃយ៍</span>
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
                          : 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'Admin (អ្នកគ្រប់គ្រង)' : 'User (គ្រូបង្រៀន)'}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {currentUser.schoolName} {currentUser.phoneNumber ? `• ${currentUser.phoneNumber}` : ''}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>កំពុងប្រើ</span>
            </span>
          </div>

          {/* User List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-xs text-slate-800 dark:text-slate-200">
                ជ្រើសរើសគណនីដើម្បីប្តូរ (Available Accounts)៖
              </label>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-lg transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddForm ? 'បិទបែបបទ' : 'បន្ថែមគ្រូ/គណនីថ្មី'}</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {allUsers.map((user) => {
                const isCurrent = user.id === currentUser.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => {
                      onSelectUser(user);
                      onClose();
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isCurrent
                        ? 'bg-sky-50/80 dark:bg-sky-950/50 border-sky-400 dark:border-sky-600 ring-1 ring-sky-400'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                          user.role === 'admin' ? 'bg-purple-600' : 'bg-sky-600'
                        }`}
                      >
                        {user.role === 'admin' ? '👑' : '👨‍🏫'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {user.name}
                          </span>
                          {user.isPermanentAdmin ? (
                            <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700 flex items-center gap-1">
                              <span>👑</span>
                              <span>Admin អចិន្ត្រៃយ៍</span>
                            </span>
                          ) : (
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                                user.role === 'admin'
                                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300'
                                  : 'bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300'
                              }`}
                            >
                              {user.role === 'admin' ? 'Admin' : 'User'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          មុខវិជ្ជា៖ {user.subjects.join(', ')} ({user.grades.join(', ')})
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                        isCurrent
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {isCurrent ? 'កំពុងប្រើ' : 'ជ្រើសរើស'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add New Teacher Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddSubmit}
              className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in duration-150"
            >
              <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                ✍️ បន្ថែមគណនីគ្រូបង្រៀន ឬអ្នកគ្រប់គ្រងថ្មី
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    ឈ្មោះគ្រូបង្រៀន / នាយក <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="ឧ. លោកគ្រូ វ៉ាន់ សារិទ្ធ"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    តួនាទី (Role) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs font-semibold focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="user">👨‍🏫 User (គ្រូបង្រៀន)</option>
                    <option value="admin">👑 Admin (នាយកសាលា / រដ្ឋបាល)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    លេខទូរស័ព្ទ
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="ឧ. 012 345 678"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    មុខវិជ្ជាបង្រៀន (ខណ្ឌដោយក្បៀស)
                  </label>
                  <input
                    type="text"
                    value={newSubjects}
                    onChange={(e) => setNewSubjects(e.target.value)}
                    placeholder="ឧ. រូបវិទ្យា, គណិតវិទ្យា"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-semibold"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold shadow-xs transition"
                >
                  រក្សាទុកគណនី
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-bold text-xs"
          >
            បិទផ្ទាំង
          </button>
        </div>
      </div>
    </div>
  );
}
