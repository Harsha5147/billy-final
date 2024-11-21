import React, { useState } from 'react';
import { addReport } from '../utils/db';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const Report: React.FC = () => {
  const [formData, setFormData] = useState({
    incidentType: '',
    description: '',
    evidence: '',
    date: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    const fullName = localStorage.getItem('fullName');

    if (!userId || !fullName) {
      navigate('/login');
      return;
    }

    try {
      await addReport({
        userId: parseInt(userId),
        reporterName: fullName,
        incidentType: formData.incidentType,
        description: formData.description,
        evidence: formData.evidence,
        date: formData.date,
        status: 'Pending',
      });

      setFormData({
        incidentType: '',
        description: '',
        evidence: '',
        date: '',
      });

      alert('Thank you for your report. It has been submitted successfully.');
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-10">
      <div className="p-8 rounded-2xl shadow-2xl bg-gradient-to-br from-gray-800/70 to-gray-900/70 backdrop-blur-md border border-gray-700">
        <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500">
          Report Cyberbullying Incident
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/40 border border-red-600/40 text-red-300 rounded-lg flex items-center gap-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="incidentType"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Incident Type
            </label>
            <select
              id="incidentType"
              name="incidentType"
              value={formData.incidentType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              required
            >
              <option value="">Select incident type</option>
              <option value="harassment">Harassment</option>
              <option value="threats">Threats</option>
              <option value="impersonation">Impersonation</option>
              <option value="stalking">Stalking</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              rows={4}
              required
              placeholder="Please describe the incident in detail..."
            ></textarea>
          </div>

          <div>
            <label
              htmlFor="evidence"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Evidence (URLs, screenshots)
            </label>
            <input
              type="text"
              id="evidence"
              name="evidence"
              value={formData.evidence}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="Paste links or describe evidence"
            />
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-300 mb-2"
            >
              Date of Incident
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-transform transform hover:scale-105"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default Report;
