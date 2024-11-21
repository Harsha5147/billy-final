import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllReports, type Report } from '../utils/db';
import { MessageCircle, AlertCircle, ThumbsUp, Share2 } from 'lucide-react';

const Community: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    fetchReports();
  }, [navigate]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const allReports = await getAllReports();
      // Only show reports that users have opted to share with the community
      const sharedReports = allReports
        .filter(report => report.evidence.includes('#shared'))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setReports(sharedReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load community posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = () => {
    navigate('/report', { state: { shareWithCommunity: true } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Community Support</h2>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
        >
          <MessageCircle size={20} />
          Share Your Story
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8 text-gray-400">Loading community posts...</div>
      ) : reports.length === 0 ? (
        <div className="glass-effect p-8 rounded-xl text-center">
          <MessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold mb-2 text-white">No Stories Shared Yet</h3>
          <p className="text-gray-400 mb-4">Be the first to share your story with the community</p>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
          >
            Share Your Experience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="glass-effect p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {report.incidentType.charAt(0).toUpperCase() + report.incidentType.slice(1)}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Shared by {report.reporterName} on {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  report.status === 'Resolved' 
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {report.status}
                </span>
              </div>
              
              <p className="text-gray-300 mb-4">{report.description}</p>
              
              <div className="flex items-center gap-4 text-gray-400">
                <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                  <ThumbsUp size={18} />
                  <span>Support</span>
                </button>
                <button className="flex items-center gap-1 hover:text-purple-400 transition-colors">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;