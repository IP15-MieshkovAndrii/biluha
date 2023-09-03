import Head from 'next/head';
import {Avatar, Button, CssBaseline, TextField, FormControlLabel, Link, Grid, Box, Typography, Container, FormControl, FormLabel, RadioGroup, Radio} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import {useForm, Controller } from 'react-hook-form';
import { signup } from '@/auth';
import { useRouter } from 'next/router';

interface SignupProps {
    handleChange: (event: any, newValue: number) => void; 
}

interface SignupFormInputs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}



export default function Signup({ handleChange }: SignupProps) {
    const [selectedProfileType, setSelectedProfileType] = useState('author');

    const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm<SignupFormInputs>({
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        }
    });
    
    const signupSubmit = async (data: SignupFormInputs) => {
        const flag = await signup(data, selectedProfileType)
        const event = new Event('event')
        if(flag)handleChange(event, 0);
    };
    return (
        <div>
        <Head>
            <title>Biluha</title>
        </Head>
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
            sx={{
                marginTop: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: '#574AE2' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign up
            </Typography>
            <Box component="form" onSubmit={handleSubmit(signupSubmit)} noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name='firstName'
                            control={control}
                            rules={{ 
                                required: 'First name is required',
                                minLength: {
                                  value: 1,
                                  message: 'First name must be at least 8 characters long',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'First name must not exceed 20 characters',
                                },
                              }}
                            render={({field}) => (
                                <TextField
                                autoComplete="given-name"
                                id="firstName"
                                label="First name"
                                required
                                fullWidth
                                {...field}
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                autoFocus
                                />
                            )}
                        />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="lastName"
                            control={control}
                            rules={{ 
                                required: 'Last name is required',
                                minLength: {
                                  value: 1,
                                  message: 'Last name must be at least 8 characters long',
                                },
                                maxLength: {
                                  value: 20,
                                  message: 'Last name must not exceed 20 characters',
                                },
                              }}
                            render={({field}) => (
                                <TextField
                                autoComplete="family-name"
                                id="lastName"
                                label="Last name"
                                required
                                fullWidth
                                {...field}
                                error={!!errors.firstName}
                                helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item sx={{mt: 2}}>
                        <FormControl>
                            <FormLabel id="radio-buttons-group-label">Profile Type</FormLabel>
                            <RadioGroup
                                aria-labelledby="radio-buttons-group-label"
                                value={selectedProfileType}
                                name="radio-buttons-group"
                                onChange={(e) => setSelectedProfileType(e.target.value)}
                            >
                                <FormControlLabel value="author" control={<Radio />} label="Author" />
                                <FormControlLabel value="commentator" control={<Radio />} label="Commentator" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name="email"
                            rules={{
                                required: true, 
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,  
                                    message: 'Invalid email format',}
                            }}
                        render={({field}) => (
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            {...field}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                            autoComplete="email"
                            />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller
                            control={control}
                            name="password"
                            rules={{ 
                            required: 'Password is required',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long',
                            },
                            maxLength: {
                                value: 20,
                                message: 'Password must not exceed 20 characters',
                            },
                            }}
                            render={({field}) => (
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    {...field}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            )}
                        />
                    </Grid>
                </Grid>
                <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                >
                Sign up
                </Button>
                <Grid container justifyContent="flex-end">
                <Grid item>
                    <Link href="#" variant="body2" onClick={(event) => handleChange(event, 0)}>
                    {" Already have an account? Log in"}
                    </Link>
                </Grid>
                </Grid>
            </Box>
            </Box>
        </Container>
        </div>
    )
}
