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
    FormGroup,
    Modal,
    TextareaAutosize
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
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [currCard, setCurrCard] = useState<Card | null>(null);
    const [multipleCount, setMultipleCount] = useState(1);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importText, setImportText] = useState('');



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

    const handleAddMultipleCards = (card: Card, count: number) => {
        setSelectedCards(prevCards => {
            const existingCardIndex = prevCards.findIndex(c => c.name === card.name);
            if (existingCardIndex !== -1) {
                const updatedCards = [...prevCards];
                updatedCards[existingCardIndex].count += count;
                return updatedCards;
            }
            return [...prevCards, { ...card, count }];
        });
    };

    const handleOpenModal = (card: Card) => {
        setCurrCard(card);
        setAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setAddModalOpen(false);
        setMultipleCount(1);
    };

    const handleAddMultipleSubmit = () => {
        if (currCard) {
            handleAddMultipleCards(currCard, multipleCount);
            handleCloseModal();
        }
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

    const handleOpenImportModal = () => {
        setImportModalOpen(true);
    };

    const handleCloseImportModal = () => {
        setImportModalOpen(false);
        setImportText('');
    };

    const handleImportSubmit = async () => {
        const lines = importText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        let totalImportedCards = 0;
        const newCards: { name: string; count: number }[] = lines.map(line => {
            const [count, ...nameParts] = line.split(' ');
            const name = nameParts.join(' ');
            totalImportedCards += parseInt(count, 10);
            console.log(totalImportedCards);
            return { name, count: parseInt(count, 10) };
        });
        setTotalCards(totalCards + totalImportedCards);

        const fetchedCards = await Promise.all(newCards.map(async ({ name, count }) => {
            try {
                const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}`);
                const card = response.data;
                return {
                    name: card.name,
                    imageUrl: card.card_faces ? card.card_faces.map((face: any) => face.image_uris?.normal || face.image_uris?.small || '') : [card.image_uris?.normal] || [card.image_uris?.small] || [],
                    details: card,
                    count,
                    colors: card.color_identity,
                    cmc: card.cmc,
                };
            } catch (error) {
                console.error(`Error fetching card ${name}:`, error);
                return null;
            }
        }));

        setSelectedCards(prevCards => {
            const updatedCards = [...prevCards];
            fetchedCards.forEach(card => {
                if (card) {
                    const existingCardIndex = updatedCards.findIndex(c => c.name === card.name);
                    if (existingCardIndex != -1) {
                        updatedCards[existingCardIndex].count += card.count;
                    } else {
                        updatedCards.push(card);
                    }
                }
            });

            return updatedCards;
        });

        handleCloseImportModal();
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
                    <Button variant="contained" color="primary" onClick={handleOpenImportModal}>
                        Import List
                    </Button>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
            </Box>

            <Grid container spacing={2} p={1}>
                {cards.map((card, index) => (
                    <Grid item xs={6} sm={4} md={3} lg={2} key={index}>
                        <div>
                            <img
                                src={card.imageUrl[0]}
                                alt={card.name}
                                style={{ width: '100%', height: 'auto', cursor: "pointer" }}
                                onClick={() => handleCardClick(card.name)}
                            />


                            <Typography variant="subtitle1">{card.name}</Typography>
                            <Box display="flex" justifyContent="space-between">
                                <Button variant="contained" color="success" onClick={(e) => { e.stopPropagation(); handleAddCard(card) }}>
                                    Add to Deck
                                </Button>
                                <Button variant="contained" color="primary" onClick={() => handleOpenModal(card)}>
                                    Add Multiple
                                </Button>
                            </Box>
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
            <Modal
                open={addModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="add-multiple-modal-title"
                aria-describedby="add-multiple-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography id="add-multiple-modal-title" variant="h6" component="h2">
                        Add Multiple Copies
                    </Typography>
                    <TextField
                        id="add-multiple-modal-description"
                        label="Number of Copies"
                        type="number"
                        value={multipleCount}
                        onChange={(e) => setMultipleCount(Number(e.target.value))}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMultipleSubmit}
                        style={{ marginTop: '20px' }}
                    >
                        Add to Deck
                    </Button>
                </Box>
            </Modal>
            <Modal open={importModalOpen} onClose={handleCloseImportModal}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6">Import Card List</Typography>
                    <TextareaAutosize
                        minRows={10}
                        maxRows={15}
                        placeholder="1 Arcane Signet&#10;1 Command Tower"
                        style={{ width: '100%', resize: 'none', overflowY: 'scroll' }}
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                    />
                    <Button onClick={handleImportSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Import
                    </Button>
                </Box>
            </Modal>
        </>

    )
}

export default CardSearch;