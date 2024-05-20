import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Card } from './types';

interface ColorBreakdownChartProps {
    cards: Card[];
}

const COLORS = ['#FFD700', '#1E90FF', '#000000', '#FF4500', '#32CD32', "#808080"];

const getColorBreakdown = (cards: Card[]) => {
    const colorCount: { [color: string]: number } = {
        W: 0,
        U: 0,
        B: 0,
        R: 0,
        G: 0,
        C: 0,
    };

    cards.forEach(card => {
        if (card.colors.length == 0) {
            colorCount["C"] += 1;
        } else {
            card.colors.forEach((color: string) => {
                colorCount[color] += card.count;
            });
        }
    });
    
    return Object.entries(colorCount).map(([color, count]) => ({
        name: color.charAt(0).toUpperCase() + color.slice(1),
        value: count
    }));
};

const ColorBreakdownChart: React.FC<ColorBreakdownChartProps> = ({ cards }) => {
    const data = getColorBreakdown(cards);

    return (
        <PieChart width={400} height={400}>
            <Legend />
            <Pie
                data={data}
                cx={200}
                cy={200}
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip />
        </PieChart>
    );
};

export default ColorBreakdownChart;