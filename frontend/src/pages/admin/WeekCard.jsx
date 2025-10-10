import React from 'react';
import { useTranslation } from 'react-i18next';
import { Edit, Trash2 } from 'lucide-react';

const WeekCard = ({ week, onEdit, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-black/20 border border-brand-border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:border-brand-primary/50 hover:-translate-y-1">
      <div>
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold text-brand-primary flex-1 min-w-0 break-words">{week.title}</h3>
          <div className="flex items-center gap-3 flex-shrink-0">
            <button onClick={() => onEdit(week)} className="text-brand-secondary hover:text-brand-primary transition-colors">
              <Edit size={18} />
            </button>
            <button onClick={() => onDelete(week.id)} className="text-brand-secondary hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        <div className="mt-2 space-y-2 text-sm">
          <div className="flex items-center gap-2 text-brand-secondary">
            <span>{t('weekManagement.table.weekNo')}: {week.week_number}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${!week.is_locked ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {!week.is_locked ? t('weekManagement.status.unlocked') : t('weekManagement.status.locked')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeekCard;