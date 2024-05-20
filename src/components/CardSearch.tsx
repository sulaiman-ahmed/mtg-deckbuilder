import React, { useEffect, useState } from "react";
import axios from 'axios';
import Cookies from "js-cookie";
import {
    Button,
    TextField,
    Box,
    Typography,
    Grid,
    Drawer,
    Backdrop,
    Checkbox,
    FormControlLabel,
    FormGroup
} from "@mui/material";
import { Card } from "./types";
import DeckList from "./DeckList";
import { useNavigate } from 'react-router-dom';


const CardSearch: React.FC = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [cards, setCards] = useState<Card[]>([]);
    const [selectedCards, setSelectedCards] = useState<Card[]>([]);
    const [error, setError] = useState<string>('');
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const [totalCards, setTotalCards] = useState<number>(0);
    const navigate = useNavigate();
    const [selectedColors, setSelectedColors] = useState<{ [color: string]: boolean }>({
        W: false,
        U: false,
        B: false,
        R: false,
        G: false
    });
    const [nextPage, setNextPage] = useState<string | null>(null);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);

    useEffect(() => {
        const savedQuery = Cookies.get('searchQuery');
        const savedResults = Cookies.get('cards');
        const savedScrollPos = Cookies.get('scrollPosition');
        if (savedQuery) {
            setSearchQuery(savedQuery);
        }
        if (savedResults) {
            setCards(JSON.parse(savedResults));
        }
        if (savedScrollPos) {
            window.scrollTo(0, parseInt(savedScrollPos, 10));
        }
    }, []);


    useEffect(() => {
        Cookies.set('searchQuery', searchQuery, { expires: 1 });
        Cookies.set('cards', JSON.stringify(cards), { expires: 1 });
    }, [searchQuery, cards]);


    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColors({
            ...selectedColors,
            [event.target.name]: event.target.checked
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setNextPage(null);
        setLoadingMore(false);
        let query = "";

        const isPlainCardName = /^[a-zA-Z\s]+$/.test(searchQuery.trim());
        query = isPlainCardName
            ? `name:"${encodeURIComponent(searchQuery.trim())}"`
            : encodeURIComponent(searchQuery.trim());

        const colors = Object.keys(selectedColors).filter(color => selectedColors[color]);
        if (colors.length > 0) {
            query += `+color=${colors.join('')}`;
        }
        try {
            const response = await axios.get(`https://api.scryfall.com/cards/search?q=${query}`);
            const cardResults: Card[] = response.data.data.filter((card: any) => !card.digital).map((card: any) => ({
                name: card.name,
                imageUrl: card.card_faces ? card.card_faces.map((face: any) => face.image_uris?.normal || face.image_uris?.small || '') : [card.image_uris?.normal] || [card.image_uris?.small] || [],
                details: card,
                colors: card.color_identity,
                cmc: card.cmc
            }));

            setCards(cardResults);
            setNextPage(response.data.next_page || null);
            setError('');
        } catch (error: any) {
            setCards([]);
            //setError('Error fetching card data. Please try again.');
            setError(error.toString());
        }
    }

    const loadMoreResults = async () => {
        if (!nextPage) return;
        setLoadingMore(true);
        try {
            const response = await axios.get(nextPage);
            const fetchedCards: Card[] = response.data.data.filter((card: any) => !card.digital).map((card: any) => ({
                name: card.name,
                imageUrl: card.card_faces ? card.card_faces.map((face: any) => face.image_uris?.normal || face.image_uris?.small || '') : [card.image_uris?.normal] || [card.image_uris?.small] || [],
                details: card,
                count: 1,
                colors: card.color_identity,
                cmc: card.cmc,
            }));
            setCards((prevResults) => [...prevResults, ...fetchedCards]);
            setNextPage(response.data.next_page || null);
        } catch (error) {
            setError('Error fetching more card data. Please try again.');
        } finally {
            setLoadingMore(false);
        }
    };

    const handleAddCard = (card: Card) => {
        setSelectedCards((prevCards) => {
            const existingCardIndex = prevCards.findIndex(c => c.name === card.name);
            if (existingCardIndex !== -1) {
                const updatedCards = [...prevCards];
                updatedCards[existingCardIndex].count += 1;
                return updatedCards;
            } else {
                card.count = 1;
                return [...prevCards, card];
            }
        });

        setTotalCards(totalCards + 1);
    };

    const handleRemoveCard = (index: number) => {
        setSelectedCards((prevCards) => {
            const updatedCards = [...prevCards];
            if (updatedCards[index].count > 1) {
                updatedCards[index].count -= 1;
            } else {
                updatedCards.splice(index, 1);
            }
            return updatedCards;
        });

        setTotalCards(totalCards - 1);
    };

    const handleCardClick = (cardName: string) => {
        Cookies.set('scrollPosition', window.scrollY.toString(), { expires: 1 });
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
                    <FormGroup row>
                        {['W', 'U', 'B', 'R', 'G'].map((color) => (
                            <FormControlLabel
                                control={<Checkbox checked={selectedColors[color]} onChange={handleColorChange} name={color} />}
                                label={color.charAt(0).toUpperCase() + color.slice(1)}
                                key={color}
                            />
                        ))}
                    </FormGroup>
                    <Button variant="contained" type="submit">Search</Button>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
            </Box>

            <Grid container spacing={2} m={2}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <div>
                            <img
                                src={card.imageUrl[0]}
                                alt={card.name}
                                style={{ width: '80%', height: 'auto', cursor: "pointer" }}
                                onClick={() => handleCardClick(card.name)}
                            />


                            <Typography variant="subtitle1">{card.name}</Typography>
                            <Button variant="contained" color="success" onClick={(e) => { e.stopPropagation(); handleAddCard(card) }}>
                                Add to Deck
                            </Button>
                        </div>
                    </Grid>
                ))}
            </Grid>

            {nextPage && (
                <Button onClick={loadMoreResults} variant="contained" color="primary" disabled={loadingMore}
                    style={{ position: 'fixed', bottom: 60, right: 16 }}>
                    {loadingMore ? 'Loading...' : 'Load More'}
                </Button>
            )}

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
                    <DeckList cards={selectedCards} onRemoveCard={handleRemoveCard} totalCards={totalCards} />
                </div>
            </Drawer>
        </>

    )
}

export default CardSearch;