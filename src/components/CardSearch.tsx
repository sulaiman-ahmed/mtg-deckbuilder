import React, { useState } from "react";
import axios from 'axios';

import {Button, TextField, Box, Typography} from "@mui/material";

interface CardData {
    name?: string;
    imageUrl?: string;
    colors?: [string];
}

const CardSearch: React.FC = () => {

    const [searchValue, setSearchValue] = useState<string>("");
    const [cardData, setCardData] = useState<CardData>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(searchValue)}`);
            setCardData({
                name: response.data.name,
                imageUrl: response.data.image_uris.normal,
                colors: response.data.colors
            });
        } catch (error) {
            console.error('Error fetching card image: ', error)
        }
    }


    return (
        <Box 
            component="form"
            m = {2}
            onSubmit={handleSubmit}
        >
            <Typography variant="h4" gutterBottom>
                Search for a card
            </Typography>
            <Box         
                display="flex"
                alignItems="center"
                m = {2}
                gap = {4}
            >
                <TextField 
                    id="outlined-basic" 
                    label="Card name..." 
                    variant="outlined" 
                    value={searchValue} 
                    onChange={(e) => setSearchValue(e.target.value)} 
                />
                <Button variant="contained" type="submit">Search</Button>
            </Box>
            {cardData && 
                <Box>
                    <img src={cardData.imageUrl} alt={cardData.name} />
                </Box>
            }
        </Box>
        
    )
}

export default CardSearch;