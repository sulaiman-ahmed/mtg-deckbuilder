import React from 'react';
import { Modal, Box, Typography, TextareaAutosize, Button } from "@mui/material";
import { ImportModalProps } from "../types";


const ImportModal: React.FC<ImportModalProps> = ({ open, onClose, importText, setImportText, onImportSubmit }) => {
    return (
        <Modal open={open} onClose={onClose}>
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
                <Button onClick={onImportSubmit} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Import
                </Button>
            </Box>
        </Modal>

    );
};

export default ImportModal;