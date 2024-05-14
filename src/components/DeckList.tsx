import React from "react";
import { DeckListProps } from "./types";
import { Box, Button, Grid, Typography } from "@mui/material";

const DeckList: React.FC<DeckListProps> = ({ cards, onRemoveCard }) => {
    return (
        <Box m={2}>
            <Typography variant="h5">Current Decklist</Typography>
            <Grid container spacing={2}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Box>
                            <img src={card.imageUrl} alt={card.name} style={{ maxWidth: '100%', height: 'auto' }} />
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