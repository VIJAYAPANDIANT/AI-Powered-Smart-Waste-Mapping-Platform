import React from 'react';
import { Calendar, MapPin, Tag, Award } from 'lucide-react';

const WasteReportCard = ({ report, onAction, isAdmin }) => {
  const { _id, location, wasteType, description, status, photoUrl, assignedTeam, createdAt } = report;

  const statusStyles = {
    pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    approved: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    resolved: 'bg-neon-teal/10 text-neon-teal border-neon-teal/20',
  };

  return (
    <div className="glass hover:neon-border rounded-xl overflow-hidden border border-dark-border transition-all duration-300 flex flex-col justify-between h-full bg-dark-card">
      <div>
        {photoUrl ? (
          <img src={photoUrl} alt={wasteType} className="w-full h-44 object-cover border-b border-dark-border" />
        ) : (
          <div className="w-full h-44 bg-dark-bg flex items-center justify-center border-b border-dark-border text-gray-600 text-xs uppercase tracking-wider font-semibold">
            No Image Uploaded
          </div>
        )}

        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <span className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded-full border ${statusStyles[status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'}`}>
              {status}
            </span>
            <span className="text-[10px] text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-1.5">
            <Tag className="h-4 w-4 text-neon-blue" /> {wasteType}
          </h3>

          <p className="text-gray-400 text-xs line-clamp-3 leading-relaxed mb-4">
            {description || 'No description provided.'}
          </p>

          <div className="flex items-start gap-1 text-[11px] text-gray-400">
            <MapPin className="h-3.5 w-3.5 text-neon-pink shrink-0 mt-0.5" />
            <span className="line-clamp-2">{location?.address}</span>
          </div>

          {assignedTeam && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-neon-purple font-semibold">
              <Award className="h-4 w-4" /> Team: {assignedTeam}
            </div>
          )}
        </div>
      </div>

      {isAdmin && status !== 'resolved' && status !== 'rejected' && (
        <div className="p-5 border-t border-dark-border flex gap-2">
          {status === 'pending' && (
            <>
              <button 
                onClick={() => onAction(_id, 'approve')}
                className="flex-1 bg-neon-blue/15 hover:bg-neon-blue/25 text-neon-blue font-bold py-2 rounded-lg text-xs transition-all border border-neon-blue/25 cursor-pointer"
              >
                Approve
              </button>
              <button 
                onClick={() => onAction(_id, 'reject')}
                className="flex-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-bold py-2 rounded-lg text-xs transition-all border border-red-500/25 cursor-pointer"
              >
                Reject
              </button>
            </>
          )}
          {status === 'approved' && (
            <button 
              onClick={() => onAction(_id, 'resolve')}
              className="w-full bg-neon-teal/15 hover:bg-neon-teal/25 text-neon-teal font-bold py-2 rounded-lg text-xs transition-all border border-neon-teal/25 cursor-pointer"
            >
              Mark Resolved
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default WasteReportCard;
