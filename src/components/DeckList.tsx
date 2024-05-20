import React from "react";
import { DeckListProps } from "./types";
import { Box, Button, Grid, Typography } from "@mui/material";
import ColorBreakdownChart from "./ColorBreakdownChart";
import ManaValueChart from "./ManaValueChart";

const DeckList: React.FC<DeckListProps> = ({ cards, onRemoveCard, totalCards }) => {

    const exportDeck = () => {
        const deckListText = cards.map(card => `${card.count} ${card.name}`).join('\n');
        const deckBlob = new Blob([deckListText], { type: 'text/plain' });
        const url = URL.createObjectURL(deckBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'decklist.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    return (
        <Box m={2} mb={5}>
            <Typography variant="h5" display="flex" justifyContent="space-between">
                Current Decklist
                <Button onClick={exportDeck} variant="contained" color="primary" style={{ marginLeft: "10px" }}>
                    Export
                </Button>
            </Typography>
            <Typography variant="subtitle1">Total cards: {totalCards}</Typography>
            <Box mb={3} display="flex" justifyContent="space-evenly">
                <ColorBreakdownChart cards={cards} />
                <ManaValueChart cards={cards} />

            </Box>
            <Grid container spacing={2}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Box>
                            <img src={card.imageUrl[0]} alt={card.name} style={{ maxWidth: '80%', height: 'auto' }} />

                            <Typography variant="subtitle1">{card.name} x{card.count}</Typography>
                            <Button variant="contained" color="error" onClick={() => onRemoveCard(index)}>Remove</Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default DeckList