import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Typography, Container, Box, Grid, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-query';
import { addProduct } from '../services/product';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Must be at least 3 characters').required('Required'),
    price: Yup.number().positive('Must be positive').required('Required'),
    quantity: Yup.number().integer('Must be an integer').positive('Must be positive').required('Required'),
});

const AddProduct = () => {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const mutation = useMutation(addProduct);

    const onDrop = (acceptedFiles) => {
        if (images.length + acceptedFiles.length > 6) {
            alert('You can only upload a maximum of 6 images');
            return;
        }
        setImages([...images, ...acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) }))]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop,
        maxFiles: 6 - images.length,
    });

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const uploadImages = async () => {
        setUploading(true);
        const uploadedUrls = await Promise.all(
            images.map(async (image) => {
                const storageRef = ref(storage, `products/${Date.now()}_${image.name}`);
                await uploadBytes(storageRef, image);
                return getDownloadURL(storageRef);
            })
        );
        setUploading(false);
        return uploadedUrls;
    };

    const formik = useFormik({
        initialValues: {
            name: '',
            price: '',
            quantity: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const imageUrls = await uploadImages();
                await mutation.mutateAsync({ ...values, images: imageUrls });
                toast.success('Product added successfully!')
                navigate('/');
            } catch (error) {
                console.error('Failed to add product:', error);
                toast.error('Failed to add product. Please try again.')
            } finally {
                setUploading(false)
            }
        },
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Add New Product
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Product Name"
                        name="name"
                        autoFocus
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        type="number"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="quantity"
                        label="Quantity"
                        name="quantity"
                        type="number"
                        value={formik.values.quantity}
                        onChange={formik.handleChange}
                        error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                        helperText={formik.touched.quantity && formik.errors.quantity}
                    />
                    <Box {...getRootProps()} sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                        <input {...getInputProps()} accept='image/*' />
                        <Typography>Drag &apos;n&apos; drop some images here, or click to select images</Typography>
                    </Box>
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {images.map((image, index) => (
                            <Grid item key={index} xs={4}>
                                <Box sx={{ position: 'relative' }}>
                                    <img src={image.preview} alt="preview" style={{ width: '100%', height: 'auto' }} />
                                    <IconButton
                                        sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.7)' }}
                                        onClick={() => removeImage(index)}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                    <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        loading={uploading || mutation.isLoading}
                        loadingPosition="start"
                        startIcon={<CloudUploadIcon />}
                    >
                        Add Product
                    </LoadingButton>
                </Box>
            </Box>
        </Container>
    );
};

export default AddProduct;