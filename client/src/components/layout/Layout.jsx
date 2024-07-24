import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
    const { user, logoutUser } = useAuth();

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                            Product App
                        </RouterLink>
                    </Typography>
                    {user ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/add-product">
                                Add Product
                            </Button>
                            <Button color="inherit" onClick={logoutUser}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Toolbar>
            </AppBar>
            <Container component="main" maxWidth="lg" sx={{ mt: 4 }}>
                {children}
            </Container>
        </>
    );
};

export default Layout;