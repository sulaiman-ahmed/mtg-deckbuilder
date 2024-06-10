import React from 'react';
import { Modal, Box, Typography, Button, TextField } from '@mui/material';
import { AddMultipleModalProps } from '../types';


const AddMultipleModal: React.FC<AddMultipleModalProps> = ({ open, onClose, onAddMultipleSubmit, multipleCount, setMultipleCount }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
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
                    onClick={onAddMultipleSubmit}
                    style={{ marginTop: '20px' }}
                >
                    Add to Deck
                </Button>
            </Box>
        </Modal>
    );
};

export default AddMultipleModal;