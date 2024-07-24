import { useQuery } from 'react-query'
import { Typography, Container, Grid } from '@mui/material'
import { getProducts } from '../services/product'

const ProductList = () => {
    const { isLoading, error, data: products } = useQuery('products', getProducts)

    if (isLoading) return <div className="text-center">Loading...</div>
    if (error) return <div className="text-center">An error has occurred: {error.message}</div>

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
                            <div className="card">
                                <Typography variant="h6">{product.name}</Typography>
                                <Typography>Price: PKR {product.price}</Typography>
                                <Typography>Quantity: {product.quantity}</Typography>
                                {product.images && product.images[0] && (
                                    <img src={product.images[0]} alt={product.name} className="mt-2" style={{ maxWidth: '100%', height: 'auto' }} />
                                )}
                            </div>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    )
}

export default ProductList