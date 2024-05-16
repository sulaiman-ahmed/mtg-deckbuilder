import React, { useState } from "react";
import axios from 'axios';

import { Button, TextField, Box, Typography, Grid, Drawer, Backdrop, IconButton } from "@mui/material";
import { Card } from "./types";
import DeckList from "./DeckList";
import { useNavigate } from 'react-router-dom';


const CardSearch: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [error, setError] = useState<string>('');
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const navigate = useNavigate();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isPlainCardName = /^[a-zA-Z\s]+$/.test(searchQuery.trim());

        const query = isPlainCardName
            ? `name:"${encodeURIComponent(searchQuery.trim())}"`
            : encodeURIComponent(searchQuery.trim());

        try {
            const response = await axios.get(`https://api.scryfall.com/cards/search?q=${query}`);
            const cardResults: Card[] = response.data.data.map((card: any) => ({
                name: card.name,
                imageUrl: card.image_uris?.normal || card.image_uris?.small || '',
            }));
            console.log(response);
            setCards(cardResults);
            setError('');
        } catch (error) {
            setCards([]);
            setError('Error fetching card data. Please try again.');
        }
    }

    const handleAddCard = (card: Card) => {
        setSelectedCards([...selectedCards, card]);
    };

    const handleRemoveCard = (index: number) => {
        setSelectedCards((prevCards) => prevCards.filter((_, i) => i !== index));
    };

    const handleCardClick = (cardName: string) => {
        navigate(`/card/${encodeURIComponent(cardName)}`);
    };

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };

    const stopPropagation = (event: React.MouseEvent) => {
        event.stopPropagation();
    };


    return (
        <>
            <Box
                component="form"
                m={2}
                onSubmit={handleSubmit}
            >
                <Typography variant="h4" gutterBottom>
                    Search for a card
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    m={2}
                    gap={4}
                >
                    <TextField
                        id="outlined-basic"
                        label="Search for a card"
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="contained" type="submit">Search</Button>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
            </Box>

            <Grid container spacing={2} m={2}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <div>
                            <img
                                src={card.imageUrl}
                                alt={card.name}
                                style={{ width: '80%', height: 'auto', cursor: "pointer" }}
                                onClick={() => handleCardClick(card.name)}
                            />
                            <Typography variant="subtitle1">{card.name}</Typography>
                            <Button variant="contained" color="success" onClick={() => handleAddCard(card)}>
                                Add to Deck
                            </Button>
                        </div>
                    </Grid>
                ))}
            </Grid>

            <Button onClick={toggleDrawer(true)}
                style={{ position: 'fixed', bottom: 16, right: 16 }}
                variant="contained"
            >
                Current DeckList
            </Button>

            <Backdrop
                open={drawerOpen}
                sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
                onClick={toggleDrawer(false)}
            />

            <Drawer
                anchor="bottom"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                variant="persistent"
                PaperProps={{ sx: { maxHeight: '80vh' } }}
            >
                <div
                    role="presentation"
                    onClick={stopPropagation}
                    onKeyDown={toggleDrawer(false)}
                >
                    <DeckList cards={selectedCards} onRemoveCard={handleRemoveCard} />
                </div>
            </Drawer>
        </>

    )
}

export default CardSearch;