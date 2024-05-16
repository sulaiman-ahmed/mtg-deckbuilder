import React from 'react';
import { AppBar, Toolbar, Typography, Button, ThemeProvider, createTheme } from '@mui/material';
import { Link } from 'react-router-dom';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

const Navbar: React.FC = () => {
    return (
        <ThemeProvider theme={darkTheme}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        HELP I NEED A NAME SOMEONE NAME ME
                    </Typography>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                </Toolbar>
            </AppBar>
        </ThemeProvider>
    );
};

export default Navbar;
