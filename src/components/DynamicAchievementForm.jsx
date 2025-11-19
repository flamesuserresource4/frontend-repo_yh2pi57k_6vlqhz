import React, { useState } from 'react';
import api from '../services/api';
import { AchievementStatus } from '../types';

const commonInput = 'w-full px-3 py-2 bg-slate-800/60 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500';
const label = 'text-sm text-slate-200';

export default function DynamicAchievementForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    location: '',
    organizer: '',
    achievementType: 'Competition',
    attachments: [],
  });
  const [dynamic, setDynamic] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleDynamicChange = (e) => {
    const { name, value } = e.target;
    setDynamic((p) => ({ ...p, [name]: value }));
  };

  const handleAuthorsChange = (i, value) => {
    setDynamic((p) => {
      const authors = Array.isArray(p.authors) ? [...p.authors] : [];
      authors[i] = value;
      return { ...p, authors };
    });
  };

  const addAuthor = () => {
    setDynamic((p) => ({ ...p, authors: [...(p.authors || []), ''] }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...form,
        ...dynamic,
        status: AchievementStatus.DRAFT,
      };
      await api.post('/achievements', payload);
      onCreated && onCreated();
      setForm({
        title: '', description: '', eventDate: '', location: '', organizer: '', achievementType: 'Competition', attachments: []
      });
      setDynamic({});
    } catch (err) {
      setError(err?.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setLoading(false);
    }
  };

  const type = form.achievementType;

  return (
    <form onSubmit={submit} className="space-y-4">
      {error && <div className="text-red-400 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={label}>Title</label>
          <input className={commonInput} name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div>
          <label className={label}>Event Date</label>
          <input type="date" className={commonInput} name="eventDate" value={form.eventDate} onChange={handleChange} required />
        </div>
        <div>
          <label className={label}>Location</label>
          <input className={commonInput} name="location" value={form.location} onChange={handleChange} />
        </div>
        <div>
          <label className={label}>Organizer</label>
          <input className={commonInput} name="organizer" value={form.organizer} onChange={handleChange} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Description</label>
          <textarea className={commonInput} name="description" value={form.description} onChange={handleChange} rows={3} />
        </div>
        <div className="md:col-span-2">
          <label className={label}>Type</label>
          <select className={commonInput} name="achievementType" value={form.achievementType} onChange={handleChange}>
            <option>Competition</option>
            <option>Publication</option>
            <option>Organization</option>
            <option>Certification</option>
          </select>
        </div>
      </div>

      {type === 'Competition' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Competition Name</label>
            <input className={commonInput} name="competitionName" value={dynamic.competitionName || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Competition Level</label>
            <select className={commonInput} name="competitionLevel" value={dynamic.competitionLevel || ''} onChange={handleDynamicChange}>
              <option value="">Pilih level</option>
              <option>International</option>
              <option>National</option>
              <option>Regional</option>
              <option>Local</option>
            </select>
          </div>
          <div>
            <label className={label}>Rank</label>
            <input className={commonInput} name="rank" value={dynamic.rank || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Medal Type</label>
            <input className={commonInput} name="medalType" value={dynamic.medalType || ''} onChange={handleDynamicChange} />
          </div>
        </div>
      )}

      {type === 'Publication' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Publication Type</label>
            <select className={commonInput} name="publicationType" value={dynamic.publicationType || ''} onChange={handleDynamicChange}>
              <option value="">Pilih tipe</option>
              <option>Journal</option>
              <option>Conference</option>
              <option>Book</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className={label}>Publication Title</label>
            <input className={commonInput} name="publicationTitle" value={dynamic.publicationTitle || ''} onChange={handleDynamicChange} />
          </div>
          <div className="md:col-span-2">
            <label className={label}>Authors</label>
            <div className="space-y-2">
              {(dynamic.authors || ['']).map((a, i) => (
                <input key={i} className={commonInput} value={a} onChange={(e) => handleAuthorsChange(i, e.target.value)} placeholder={`Author ${i+1}`} />
              ))}
              <button type="button" onClick={addAuthor} className="text-sm text-blue-400 hover:underline">+ Tambah Author</button>
            </div>
          </div>
          <div>
            <label className={label}>Publisher</label>
            <input className={commonInput} name="publisher" value={dynamic.publisher || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>ISSN</label>
            <input className={commonInput} name="issn" value={dynamic.issn || ''} onChange={handleDynamicChange} />
          </div>
        </div>
      )}

      {type === 'Organization' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Organization Name</label>
            <input className={commonInput} name="organizationName" value={dynamic.organizationName || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Position</label>
            <input className={commonInput} name="position" value={dynamic.position || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Period Start</label>
            <input type="date" className={commonInput} name="periodStart" value={dynamic.periodStart || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Period End</label>
            <input type="date" className={commonInput} name="periodEnd" value={dynamic.periodEnd || ''} onChange={handleDynamicChange} />
          </div>
        </div>
      )}

      {type === 'Certification' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={label}>Certification Name</label>
            <input className={commonInput} name="certificationName" value={dynamic.certificationName || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Issued By</label>
            <input className={commonInput} name="issuedBy" value={dynamic.issuedBy || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Certification Number</label>
            <input className={commonInput} name="certificationNumber" value={dynamic.certificationNumber || ''} onChange={handleDynamicChange} />
          </div>
          <div>
            <label className={label}>Valid Until</label>
            <input type="date" className={commonInput} name="validUntil" value={dynamic.validUntil || ''} onChange={handleDynamicChange} />
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <button disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50">{loading ? 'Menyimpan...' : 'Submit'}</button>
      </div>
    </form>
  );
}
