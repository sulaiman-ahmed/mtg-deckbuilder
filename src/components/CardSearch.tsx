import React, { useState } from "react";
import axios from 'axios';

import {Button, TextField, Box, Typography} from "@mui/material";


const CardSearch: React.FC = () => {

    const [cardName, setCardName] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(cardName)}`);
            const imageUrl = response.data.image_uris.normal;
            setImageUrl(imageUrl);
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
                    value={cardName} 
                    onChange={(e) => setCardName(e.target.value)} 
                />
                <Button variant="contained" type="submit">Search</Button>
            </Box>
            {imageUrl && <img src={imageUrl} alt="MTG Card" />}
        </Box>
        
    )
}

export default CardSearch;