'use client';

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { apiFetch } from '@/lib/api';
import { Plus, X, Building2, Package, CreditCard, DollarSign, Globe } from 'lucide-react';

interface Client { id: number; name: string; contact: string; phone: string; city: string; debt: number; status: string; }
interface Employee { id: number; fullName: string; position: string; dept: string; baseSalary: string; }

const NOMENCLATURE = [
  { code: 'ЩБ-001', name: 'Щебень фракция 5-20 мм',  unit: 'тонна', price: 1200, type: 'Продукция' },
  { code: 'ЩБ-002', name: 'Щебень фракция 20-40 мм', unit: 'тонна', price: 1400, type: 'Продукция' },
  { code: 'ЩБ-003', name: 'Щебень фракция 40-70 мм', unit: 'тонна', price: 1600, type: 'Продукция' },
  { code: 'ЩБ-004', name: 'Отсев (0-5 мм)',           unit: 'тонна', price: 600,  type: 'Продукция' },
  { code: 'МТ-001', name: 'Дизельное топливо',        unit: 'литр',  price: 84,   type: 'Материал'  },
  { code: 'МТ-002', name: 'Масло гидравлическое',     unit: 'литр',  price: 380,  type: 'Материал'  },
  { code: 'МТ-003', name: 'Взрывчатые вещества',      unit: 'кг',    price: 1800, type: 'Материал'  },
  { code: 'УС-001', name: 'Транспортные услуги',       unit: 'рейс',  price: 8500, type: 'Услуга'    },
  { code: 'УС-002', name: 'Услуги по дроблению',       unit: 'час',   price: 15000,type: 'Услуга'    },
];

const ACCOUNTS_PLAN = [
  { code: '1010', name: 'Денежные средства в кассе',           cat: 'Активы' },
  { code: '1030', name: 'Деньги на счетах в банках',           cat: 'Активы' },
  { code: '1210', name: 'Дебиторская задолженность покупателей',cat: 'Активы' },
  { code: '1310', name: 'Сырьё и материалы',                   cat: 'Активы' },
  { code: '2410', name: 'Основные средства',                   cat: 'Активы' },
  { code: '3010', name: 'Краткосрочная кредиторская задолженность',cat:'Обязательства'},
  { code: '3350', name: 'Задолженность по оплате труда',        cat: 'Обязательства' },
  { code: '5110', name: 'Уставный капитал',                    cat: 'Капитал' },
  { code: '6010', name: 'Доход от реализации продукции',       cat: 'Доходы' },
  { code: '7010', name: 'Себестоимость реализованной продукции',cat: 'Расходы' },
  { code: '7210', name: 'Административные расходы',            cat: 'Расходы' },
];

const ORG = {
  name: 'ОсОО "Vertex Plus KG"', bin: '220840037412',
  address: 'Кыргызская Республика, Чуйская обл., г. Бишкек, ул. Ибраимова 15',
  phone: '+996 312 44-55-66', email: 'info@vertexplus.kg',
  bank: 'KICB — Кыргызский инвестиционно-кредитный банк',
  account: 'KG123 KICB 0000 1234 5678 90', bik: 'KICBKG22',
  director: 'Алиев Нурлан Бакытович', accountant: 'Мусаканова Адиля',
};

type Tab = 'org'|'clients'|'employees'|'nomenclature'|'accounts';

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'org',         label: 'Организации',    icon: <Building2 size={12}/> },
  { key: 'clients',     label: 'Контрагенты',    icon: <Globe size={12}/> },
  { key: 'employees',   label: 'Сотрудники',     icon: <Building2 size={12}/> },
  { key: 'nomenclature',label: 'Номенклатура',   icon: <Package size={12}/> },
  { key: 'accounts',    label: 'План счетов',    icon: <CreditCard size={12}/> },
];

export default function DirectoriesPage() {
  const [tab, setTab] = useState<Tab>('org');
  const [clients, setClients] = useState<Client[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    apiFetch<{ clients: Client[] }>('/api/clients').then(d => setClients(d.clients)).catch(() => {});
    apiFetch<{ employees: Employee[] }>('/api/employees').then(d => setEmployees(d.employees)).catch(() => {});
  }, []);

  return (
    <AppLayout title="Справочники" subtitle="Нормативно-справочная информация">

      {/* Tab bar */}
      <div className="flex border-b mb-3" style={{ borderColor: '#ccc' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors"
            style={{
              borderBottomColor: tab === t.key ? '#f5821f' : 'transparent',
              color: tab === t.key ? '#1b3a6b' : '#666',
              background: tab === t.key ? '#fff' : 'transparent',
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Org */}
      {tab === 'org' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="border" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
              Реквизиты организации
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { label: 'Полное наименование', value: ORG.name },
                { label: 'ИНН (БИН)', value: ORG.bin },
                { label: 'Юридический адрес', value: ORG.address },
                { label: 'Телефон', value: ORG.phone },
                { label: 'E-mail', value: ORG.email },
                { label: 'Руководитель', value: ORG.director },
                { label: 'Главный бухгалтер', value: ORG.accountant },
              ].map(r => (
                <div key={r.label}>
                  <div className="text-xs" style={{ color: '#888' }}>{r.label}</div>
                  <div className="text-sm font-medium mt-0.5" style={{ color: '#333' }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="border" style={{ background: '#fff', borderColor: '#ccc' }}>
            <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
              Банковские реквизиты
            </div>
            <div className="p-4 space-y-2.5">
              {[
                { label: 'Банк', value: ORG.bank },
                { label: 'Расчётный счёт', value: ORG.account },
                { label: 'БИК', value: ORG.bik },
              ].map(r => (
                <div key={r.label}>
                  <div className="text-xs" style={{ color: '#888' }}>{r.label}</div>
                  <div className="text-sm font-medium font-mono mt-0.5" style={{ color: '#1b3a6b' }}>{r.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clients */}
      {tab === 'clients' && (
        <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-1.5 border-b font-semibold text-xs flex items-center justify-between"
            style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
            Контрагенты ({clients.length})
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f5f5f5', color: '#666' }}>
                {['Наименование','Контактное лицо','Телефон','Город','Задолженность','Статус'].map((h,i) => (
                  <th key={i} className="px-3 py-2 border-b text-left font-semibold" style={{ borderColor: '#ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c,i) => (
                <tr key={c.id} style={{ background: i%2===0?'#fff':'#fafafa' }} className="hover:bg-blue-50">
                  <td className="px-3 py-1.5 border-b font-medium" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{c.name}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{c.contact}</td>
                  <td className="px-3 py-1.5 border-b font-mono" style={{ borderColor:'#eee', color:'#555', fontSize:10 }}>{c.phone}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{c.city}</td>
                  <td className="px-3 py-1.5 border-b font-bold" style={{ borderColor:'#eee', color: c.debt>0?'#c03030':'#4a9c2c' }}>
                    {c.debt > 0 ? c.debt.toLocaleString('ru-RU') : '—'}
                  </td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee' }}>
                    <span className="px-1.5 py-0.5 text-xs"
                      style={{
                        background: c.status==='active'?'#f0f7e8':'#fdf0f0',
                        color: c.status==='active'?'#4a9c2c':'#c03030',
                        border: `1px solid ${c.status==='active'?'#c5e0a0':'#e0a0a0'}`,
                      }}>
                      {c.status==='active'?'Активный':'Заблокирован'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Employees */}
      {tab === 'employees' && (
        <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
            Сотрудники ({employees.length})
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f5f5f5', color: '#666' }}>
                {['№','ФИО','Подразделение','Должность','Оклад (сом)'].map((h,i) => (
                  <th key={i} className={`px-3 py-2 border-b font-semibold ${i===4?'text-right':'text-left'}`} style={{ borderColor:'#ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e,i) => (
                <tr key={e.id} style={{ background: i%2===0?'#fff':'#fafafa' }} className="hover:bg-blue-50">
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#aaa' }}>{i+1}</td>
                  <td className="px-3 py-1.5 border-b font-medium" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{e.fullName}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{e.dept}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{e.position}</td>
                  <td className="px-3 py-1.5 border-b text-right font-bold" style={{ borderColor:'#eee', color:'#333' }}>
                    {Number(e.baseSalary).toLocaleString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nomenclature */}
      {tab === 'nomenclature' && (
        <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
            Номенклатура — Товары и услуги ({NOMENCLATURE.length})
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f5f5f5', color: '#666' }}>
                {['Код','Наименование','Ед. изм.','Цена (сом)','Тип'].map((h,i) => (
                  <th key={i} className={`px-3 py-2 border-b font-semibold ${i===3?'text-right':'text-left'}`} style={{ borderColor:'#ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NOMENCLATURE.map((n,i) => (
                <tr key={n.code} style={{ background: i%2===0?'#fff':'#fafafa' }} className="hover:bg-blue-50">
                  <td className="px-3 py-1.5 border-b font-mono font-bold" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{n.code}</td>
                  <td className="px-3 py-1.5 border-b font-medium" style={{ borderColor:'#eee', color:'#333' }}>{n.name}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#555' }}>{n.unit}</td>
                  <td className="px-3 py-1.5 border-b text-right font-bold" style={{ borderColor:'#eee', color:'#333' }}>{n.price.toLocaleString('ru-RU')}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee' }}>
                    <span className="px-1.5 py-0.5 text-xs"
                      style={{
                        background: n.type==='Продукция'?'#dde8f5':n.type==='Материал'?'#fff8e8':'#f0f7e8',
                        color: n.type==='Продукция'?'#1b3a6b':n.type==='Материал'?'#b07000':'#4a9c2c',
                        border: `1px solid ${n.type==='Продукция'?'#bcd':n.type==='Материал'?'#e0c080':'#c5e0a0'}`,
                      }}>
                      {n.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Accounts plan */}
      {tab === 'accounts' && (
        <div className="border overflow-hidden" style={{ background: '#fff', borderColor: '#ccc' }}>
          <div className="px-3 py-1.5 border-b font-semibold text-xs" style={{ background: '#dde8f5', borderColor: '#bcd', color: '#1b3a6b' }}>
            План счетов бухгалтерского учёта
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f5f5f5', color: '#666' }}>
                {['Счёт','Наименование','Категория'].map((h,i) => (
                  <th key={i} className="px-3 py-2 border-b text-left font-semibold" style={{ borderColor:'#ddd' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS_PLAN.map((a,i) => (
                <tr key={a.code} style={{ background: i%2===0?'#fff':'#fafafa' }} className="hover:bg-blue-50">
                  <td className="px-3 py-1.5 border-b font-mono font-bold" style={{ borderColor:'#eee', color:'#1b3a6b' }}>{a.code}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee', color:'#333' }}>{a.name}</td>
                  <td className="px-3 py-1.5 border-b" style={{ borderColor:'#eee' }}>
                    <span className="px-1.5 py-0.5 text-xs"
                      style={{
                        background: a.cat==='Активы'?'#dde8f5':a.cat==='Обязательства'?'#fdf0f0':a.cat==='Доходы'?'#f0f7e8':a.cat==='Расходы'?'#fff8e8':'#f5f0ff',
                        color: a.cat==='Активы'?'#1b3a6b':a.cat==='Обязательства'?'#c03030':a.cat==='Доходы'?'#4a9c2c':a.cat==='Расходы'?'#b07000':'#7b2cbf',
                        border:'1px solid #ddd',
                      }}>
                      {a.cat}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </AppLayout>
  );
}
