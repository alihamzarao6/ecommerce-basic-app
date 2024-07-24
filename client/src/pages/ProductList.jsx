import { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Typography, Container, Grid, IconButton, Menu, MenuItem, Card, CardContent } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { getProducts, deleteProduct } from '../services/product';
import { toast } from 'react-toastify';
import '../index.css';  // Ensure the CSS file is imported

const ProductList = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { isLoading, error, data: products } = useQuery('products', getProducts);

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleMenuOpen = (event, product) => {
        setAnchorEl(event.currentTarget);
        setSelectedProduct(product);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedProduct(null);
    };

    const handleEdit = () => {
        if (selectedProduct) {
            navigate(`/add-product`, { state: { product: selectedProduct } });
        }
        handleMenuClose();
    };

    const handleDelete = async () => {
        if (selectedProduct) {
            try {
                await deleteProduct(selectedProduct._id);
                toast.success('Product deleted successfully!');
                queryClient.invalidateQueries('products');
            } catch (error) {
                toast.error('Failed to delete product. Please try again.');
            }
        }
        handleMenuClose();
    };

    if (isLoading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center">An error has occurred: {error.message}</div>;

    return (
        <Container className="mt-4">
            <Typography variant="h4" component="h1" align="center" gutterBottom>
                Products
            </Typography>
            {products.length === 0 ? (
                <Typography variant="h6" align="center">
                    No products added yet.
                </Typography>
            ) : (
                <Grid container spacing={3}>
                    {products.map(product => (
                        <Grid item xs={12} sm={6} md={4} key={product._id}>
                            <Card className="product-card">
                                <CardContent>
                                    <div className="product-card-header">
                                        <Typography variant="h6">{product.name}</Typography>
                                        <IconButton
                                            onClick={(event) => handleMenuOpen(event, product)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </div>
                                    <Typography>Price: PKR {product.price}</Typography>
                                    <Typography>Quantity: {product.quantity}</Typography>
                                    {product.images && product.images[0] && (
                                        <img src={product.images[0]} alt={product.name} className="mt-2" style={{ maxWidth: '100%', height: 'auto' }} />
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </Container>
    );
};

export default ProductList;
