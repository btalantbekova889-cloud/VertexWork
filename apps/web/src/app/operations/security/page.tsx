'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import { LogIn, LogOut as LogOutIcon, Shield, Eye, FileText, Plus, X } from 'lucide-react';

interface Pass { id: number; time: string; vehicle: string; driver: string; type: string; order: string; weight: string; approved: string; }
interface Visitor { id: number; name: string; company: string; purpose: string; in: string; out: string | null; pass: string; }

const INIT_PASSES: Pass[] = [
  { id: 1, time: '09:45', vehicle: 'A 147 KG', driver: 'Нурланов Е.',    type: 'exit',  order: 'ОРД-2847', weight: '53.4 т', approved: 'Байжанов С.' },
  { id: 2, time: '09:30', vehicle: 'D 456 KG', driver: 'Сатыбалдиев О.',type: 'entry', order: 'ОРД-2845', weight: '24.2 т', approved: 'Байжанов С.' },
  { id: 3, time: '09:15', vehicle: 'B 234 KG', driver: 'Жаксыбеков А.', type: 'entry', order: 'ОРД-2846', weight: '24.6 т', approved: 'Байжанов С.' },
  { id: 4, time: '09:00', vehicle: 'C 089 KG', driver: 'Темиров К.',     type: 'exit',  order: 'ОРД-2848', weight: '58.1 т', approved: 'Байжанов С.' },
  { id: 5, time: '08:45', vehicle: 'F 321 KG', driver: 'Алиев Р.',       type: 'exit',  order: 'ОРД-2844', weight: '55.2 т', approved: 'Байжанов С.' },
  { id: 6, time: '08:30', vehicle: 'A 147 KG', driver: 'Нурланов Е.',    type: 'entry', order: 'ОРД-2847', weight: '24.2 т', approved: 'Байжанов С.' },
];

const INIT_VISITORS: Visitor[] = [
  { id: 1, name: 'Петров А.В.',   company: 'ТОО "АлтайСтрой"',   purpose: 'Проверка груза', in: '09:00', out: null,    pass: 'ВП-0445' },
  { id: 2, name: 'Иванова М.С.', company: 'Налоговая инспекция', purpose: 'Проверка',       in: '10:30', out: null,    pass: 'ВП-0446' },
  { id: 3, name: 'Сидоров К.П.', company: 'АО "СтройКонсалт"',  purpose: 'Самовывоз',      in: '08:15', out: '08:55', pass: 'ВП-0444' },
];

const EMPTY_PASS = { vehicle: '', driver: '', type: 'entry', order: '', weight: '' };
const EMPTY_VIS  = { name: '', company: '', purpose: '' };

export default function SecurityPage() {
  const [passes,   setPasses]   = useState<Pass[]>(INIT_PASSES);
  const [visitors, setVisitors] = useState<Visitor[]>(INIT_VISITORS);
  const [showPass, setShowPass] = useState(false);
  const [showVis,  setShowVis]  = useState(false);
  const [passForm, setPassForm] = useState(EMPTY_PASS);
  const [visForm,  setVisForm]  = useState(EMPTY_VIS);
  const [saving,   setSaving]   = useState(false);

  useEffect(() => {
    fetch('/api/passes').then(r => r.json()).then(d => { if (Array.isArray(d.passes) && d.passes.length) setPasses(d.passes); }).catch(() => {});
    fetch('/api/visitors').then(r => r.json()).then(d => { if (Array.isArray(d.visitors) && d.visitors.length) setVisitors(d.visitors); }).catch(() => {});
  }, []);

  const handleAddPass = async () => {
    if (!passForm.vehicle.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/passes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passForm) });
      const data = await res.json();
      if (data.pass) setPasses(prev => [data.pass, ...prev]);
      setShowPass(false); setPassForm(EMPTY_PASS);
    } finally { setSaving(false); }
  };

  const handleAddVisitor = async () => {
    if (!visForm.name.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/visitors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visForm) });
      const data = await res.json();
      if (data.visitor) setVisitors(prev => [data.visitor, ...prev]);
      setShowVis(false); setVisForm(EMPTY_VIS);
    } finally { setSaving(false); }
  };

  const handleCheckout = async (id: number) => {
    const now = new Date();
    const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
    setVisitors(prev => prev.map(v => v.id === id ? { ...v, out: t } : v));
    await fetch(`/api/visitors/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ out: t }) }).catch(() => {});
  };

  return (
    <AppLayout title="Охрана" subtitle="Контроль территории и пропускной режим">
      {/* Pass modal */}
      {showPass && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowPass(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Ручной пропуск</h3>
              <button onClick={() => setShowPass(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Машина *</label>
                  <input value={passForm.vehicle} onChange={e => setPassForm(f => ({...f, vehicle: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500 uppercase" placeholder="A 000 KG" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Тип</label>
                  <select value={passForm.type} onChange={e => setPassForm(f => ({...f, type: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                    <option value="entry">Въезд</option>
                    <option value="exit">Выезд</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Водитель</label>
                <input value={passForm.driver} onChange={e => setPassForm(f => ({...f, driver: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Нурланов Е." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Заказ</label>
                  <input value={passForm.order} onChange={e => setPassForm(f => ({...f, order: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="ОРД-2847" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Вес</label>
                  <input value={passForm.weight} onChange={e => setPassForm(f => ({...f, weight: e.target.value}))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="28.5 т" />
                </div>
              </div>
              <button onClick={handleAddPass} disabled={saving || !passForm.vehicle.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Выдать пропуск'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visitor modal */}
      {showVis && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowVis(false)}>
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-gray-900">Регистрация посетителя</h3>
              <button onClick={() => setShowVis(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">ФИО *</label>
                <input value={visForm.name} onChange={e => setVisForm(f => ({...f, name: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Иванов И.И." />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Организация</label>
                <input value={visForm.company} onChange={e => setVisForm(f => ({...f, company: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder='ТОО "Название"' />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Цель визита</label>
                <input value={visForm.purpose} onChange={e => setVisForm(f => ({...f, purpose: e.target.value}))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-500" placeholder="Проверка груза" />
              </div>
              <button onClick={handleAddVisitor} disabled={saving || !visForm.name.trim()}
                className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                {saving ? 'Сохранение...' : 'Зарегистрировать'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatCard label="Въездов сегодня"    value={passes.filter(p => p.type === 'entry').length} icon={<LogIn size={16} />}      color="green" />
        <StatCard label="Выездов сегодня"    value={passes.filter(p => p.type === 'exit').length}  icon={<LogOutIcon size={16} />}  color="blue" />
        <StatCard label="Посетителей сейчас" value={visitors.filter(v => !v.out).length}           icon={<Eye size={16} />}         color="yellow" />
        <StatCard label="Пропусков выдано"   value={passes.length}                                  icon={<FileText size={16} />}    color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-700 font-semibold flex items-center gap-2">
              <Shield size={15} className="text-gray-600" /> Журнал транспорта
            </h3>
            <button onClick={() => setShowPass(true)}
              className="text-xs px-3 py-1.5 rounded bg-gray-900 text-white hover:bg-gray-800 transition-colors flex items-center gap-1">
              <Plus size={12} /> Ручной пропуск
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                  <th className="text-left pb-2 font-medium">Время</th>
                  <th className="text-left pb-2 font-medium">Машина</th>
                  <th className="text-left pb-2 font-medium">Водитель</th>
                  <th className="text-center pb-2 font-medium">Тип</th>
                  <th className="text-left pb-2 font-medium">Заказ</th>
                  <th className="text-right pb-2 font-medium">Вес</th>
                  <th className="text-left pb-2 font-medium">Охранник</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {passes.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 text-gray-400 text-xs font-mono">{p.time}</td>
                    <td className="py-2.5 text-gray-800 font-medium font-mono">{p.vehicle}</td>
                    <td className="py-2.5 text-gray-500 text-xs">{p.driver}</td>
                    <td className="py-2.5 text-center">
                      {p.type === 'entry'
                        ? <span className="inline-flex items-center gap-1 text-xs text-green-700"><LogIn size={11} /> Въезд</span>
                        : <span className="inline-flex items-center gap-1 text-xs text-blue-600"><LogOutIcon size={11} /> Выезд</span>}
                    </td>
                    <td className="py-2.5 text-gray-400 text-xs font-mono">{p.order}</td>
                    <td className="py-2.5 text-right text-gray-500 text-xs">{p.weight}</td>
                    <td className="py-2.5 text-gray-400 text-xs">{p.approved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
          <h3 className="text-gray-700 font-semibold mb-4 flex items-center gap-2">
            <Eye size={15} className="text-amber-500" /> Посетители
          </h3>
          <div className="space-y-3">
            {visitors.map(v => (
              <div key={v.id} className={`p-3 rounded-lg border ${v.out ? 'border-gray-100 bg-gray-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{v.name}</p>
                    <p className="text-gray-500 text-xs">{v.company}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{v.purpose}</p>
                  </div>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-mono border ${v.out ? 'text-gray-500 bg-gray-100 border-gray-200' : 'text-amber-700 bg-amber-100 border-amber-200'}`}>
                    {v.pass}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-3 text-xs">
                    <span className="text-green-600 flex items-center gap-1"><LogIn size={10} />{v.in}</span>
                    {v.out
                      ? <span className="text-gray-500 flex items-center gap-1"><LogOutIcon size={10} />{v.out}</span>
                      : <span className="text-amber-600">На территории</span>}
                  </div>
                  {!v.out && (
                    <button onClick={() => handleCheckout(v.id)}
                      className="text-xs px-2 py-0.5 rounded border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors">
                      Выход
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={() => setShowVis(true)}
              className="w-full text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-center gap-1">
              <Plus size={12} /> Зарегистрировать посетителя
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
