import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card } from './types';

interface CardTypeBarChartProps {
  cards: Card[];
}

const CardTypeBarChart: React.FC<CardTypeBarChartProps> = ({ cards }) => {
  const typeCategories = {
    Land: 0,
    Creature: 0,
    Artifact: 0,
    Enchantment: 0,
    Planeswalker: 0,
    Battle: 0,
    Instant: 0,
    Sorcery: 0,
  };

  cards.forEach((card) => {
    const types = card.details?.type_line.split(' — ')[0].split(' ');
    types?.forEach((type) => {
      switch (type) {
        case 'Land':
          typeCategories.Land++;
          break;
        case 'Creature':
          typeCategories.Creature++;
          break;
        case 'Artifact':
          typeCategories.Artifact++;
          break;
        case 'Enchantment':
          typeCategories.Enchantment++;
          break;
        case 'Planeswalker':
          typeCategories.Planeswalker++;
          break;
        case 'Battle':
          typeCategories.Battle++;
          break;
        case 'Instant':
          typeCategories.Instant++;
          break;
        case 'Sorcery':
          typeCategories.Sorcery++;
          break;
        default:
          break;
      }
    });
  });

  const data = Object.keys(typeCategories).map((type) => ({
    type,
    count: typeCategories[type as keyof typeof typeCategories],
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="type" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CardTypeBarChart;
