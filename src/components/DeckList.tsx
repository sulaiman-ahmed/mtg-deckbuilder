import React from "react";
import { DeckListProps } from "./types";
import { Box, Button, Grid, Typography } from "@mui/material";

const DeckList: React.FC<DeckListProps> = ({ cards, onRemoveCard }) => {

    const exportDeck = () => {
        const deckListText = cards.map(card => card.name).join('\n');
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
        <Box m={2}>
            <Typography variant="h5">
                Current Decklist
                <Button onClick={exportDeck} variant="outlined" color="primary" style={{ marginLeft: '10px' }}>
                    Export
                </Button></Typography>
            <Typography variant="subtitle1">Total cards: {cards.length}</Typography>
            <Grid container spacing={2}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Box>
                            <img src={card.imageUrl} alt={card.name} style={{ maxWidth: '80%', height: 'auto' }} />
                            <Typography variant="subtitle1">{card.name}</Typography>
                            <Button variant="contained" color="error" onClick={() => onRemoveCard(index)}>Remove</Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default DeckList