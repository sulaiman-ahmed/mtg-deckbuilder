import React, { useState } from "react";
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
} from "@mui/material";
import { Card } from "./types";
import DeckList from "./DeckList";
import { useNavigate } from 'react-router-dom';
import ImportModal from "./modals/ImportModal";
import AddMultipleModal from "./modals/AddMultipleModal";
import { useCardManager } from './hooks/useCardManager';


const CardSearch: React.FC = () => {
    const {
        searchQuery,
        setSearchQuery,
        cards,
        selectedCards,
        loadingMore,
        hasMore,
        handleSearch,
        handleLoadMoreResults,
        handleAddCard,
        handleAddMultipleCards,
        handleRemoveCard,
        handleImportCards,
    } = useCardManager();

    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    
    // ADD BACK IN THIS FUNCTIONALITY
    const [totalCards, setTotalCards] = useState<number>(0);
    // ADD BACK IN ABOVE FUNCTIONALITY

    const navigate = useNavigate();
    const [selectedColors, setSelectedColors] = useState<{ [color: string]: boolean }>({
        W: false,
        U: false,
        B: false,
        R: false,
        G: false
    });

    const [addModalOpen, setAddModalOpen] = useState(false);
    const [currCard, setCurrCard] = useState<Card | null>(null);
    const [multipleCount, setMultipleCount] = useState(1);
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importText, setImportText] = useState('');

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedColors({
            ...selectedColors,
            [event.target.name]: event.target.checked
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

    return (
        <>
            <Box
                component="form"
                m={2}
                onSubmit={(event) => {
                    event.preventDefault();
                    handleSearch(searchQuery);
                }}
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
            </Box>

            <Grid container spacing={2} p={1}>
                {cards && cards.map((card, index) => (
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
                                <Button variant="contained" color="success" style={{ fontSize: 10 }} onClick={(e) => { e.stopPropagation(); handleAddCard(card) }}>
                                    Add to Deck
                                </Button>
                                <Button variant="contained" color="primary" style={{ fontSize: 10 }} onClick={() => handleOpenModal(card)}>
                                    Add Multiple
                                </Button>
                            </Box>
                        </div>
                    </Grid>
                ))}
            </Grid>

            {hasMore && !loadingMore && (
                <Button onClick={handleLoadMoreResults} variant="contained" color="primary" disabled={loadingMore}
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
            <AddMultipleModal
                open={addModalOpen}
                onClose={handleCloseModal}
                onAddMultipleSubmit={handleAddMultipleSubmit}
                multipleCount={multipleCount}
                setMultipleCount={setMultipleCount}
            />
            <ImportModal
                open={importModalOpen}
                onClose={handleCloseImportModal}
                importText={importText}
                setImportText={setImportText}
                onImportSubmit={() => handleImportCards(importText)}
            />

        </>

    )
}

export default CardSearch;