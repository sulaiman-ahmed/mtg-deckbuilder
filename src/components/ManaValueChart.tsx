import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Card } from './types';

interface ManaValueBarChartProps {
  cards: Card[];
}

const getManaValueBreakdown = (cards: Card[]) => {
  const manaValueCount: { [manaValue: string]: number } = {};

  cards.forEach(card => {
    const manaValue = card.cmc || 0;
    manaValueCount[manaValue] = (manaValueCount[manaValue] || 0) + card.count;
  });

  return Object.entries(manaValueCount).map(([manaValue, count]) => ({
    manaValue,
    count
  }));
};

const ManaValueChart: React.FC<ManaValueBarChartProps> = ({ cards }) => {
  const data = getManaValueBreakdown(cards);

  return (
    <BarChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="manaValue" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="count" fill="#8884d8" name="Mana Value"/>
    </BarChart>
  );
};

export default ManaValueChart;
