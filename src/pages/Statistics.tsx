import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const Statistics: React.FC = () => {
  const data = [
    { name: 'Harassment', value: 150 },
    { name: 'Threats', value: 80 },
    { name: 'Impersonation', value: 40 },
    { name: 'Stalking', value: 30 },
    { name: 'Other', value: 20 },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Cyberbullying Statistics</h2>
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Incident Types Distribution</h3>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Key Findings</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Harassment remains the most prevalent form of cyberbullying, accounting for 47% of reported incidents.</li>
          <li>Threats constitute 25% of all reported cases, indicating a significant level of severe cyberbullying.</li>
          <li>Impersonation and stalking combined represent 22% of incidents, highlighting the need for improved online identity protection.</li>
          <li>Other forms of cyberbullying make up 6% of reports, showcasing the diverse nature of online harassment.</li>
        </ul>
      </div>
    </div>
  )
}

export default Statistics