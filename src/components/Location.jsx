import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import React from 'react';

export default function Location({ stats }) {
  const cityCount = stats.reduce((acc, item) => {
    if (acc[item.city]) {
      acc[item.city] += 1;
    } else acc[item.city] = 1;
    return acc;
  }, {});

  const cities = Object.entries(cityCount).map(([city, count]) => ({
    city,
    count,
  }));

  return (
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart width={900} height={300} data={cities.slice(0, 5)}>
        <XAxis dataKey='city' />
        <YAxis />
        <Tooltip labelStyle={{ color: 'green' }} />
        <Legend />
        <Line type='monotone' dataKey='count' stroke='#8884d8' />
      </LineChart>
    </ResponsiveContainer>
  );
}
