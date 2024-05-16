import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardInformation } from './types';
import { Typography, CircularProgress, Box, Paper, styled } from '@mui/material';

const InfoPaper = styled(Paper) (({ theme }) => ({
    width: "40%",
    padding: theme.spacing(2),
    ...theme.typography.body2,
  }));{

}

const CardDetail: React.FC = () => {
    const { cardName } = useParams();
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchCard = async () => {
            try {
                const response = await axios.get(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName!)}`);
                const fetchedCardDetails: CardInformation = response.data;
                const fetchedCard: Card = {
                    name: response.data.name,
                    imageUrl: response.data.image_uris?.normal || response.data.image_uris?.small || '',
                    details: fetchedCardDetails
                };
                setCard(fetchedCard);
                setLoading(false);
            } catch (error) {
                setError('Error fetching card data. Please try again.');
                setLoading(false);
            }
        };

        fetchCard();
    }, [cardName]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!card) {
        return <Typography>No card data found</Typography>;
    }

    return (
        <div>
            <Box m={2}>
                <img src={card.imageUrl} alt={card.name} style={{ width: '20%', height: 'auto' }} />
                <Typography variant="h4">{card.name}</Typography>
                <InfoPaper>
                    {card.details?.oracle_text}
                     {/* Add more details from the card here */}
                </InfoPaper>
            </Box>
        </div>
    );
};

export default CardDetail;
