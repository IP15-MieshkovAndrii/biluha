import Head from 'next/head';
import {Avatar, Button, CssBaseline, TextField, Link, Grid, Box, Typography, Container} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {useForm, Controller } from 'react-hook-form';
import { login } from '@/auth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

interface LoginProps {
    handleChange: (event: React.SyntheticEvent, newValue: number) => void; 
  }

interface LoginFormInputs {
    email: string;
    password: string;
}

export default function Login({ handleChange }: LoginProps) {
    const router = useRouter();

  const loginSubmit = async(data: LoginFormInputs) => {
    const userData = await login(data)

    if(userData){
        Cookies.set('userData', JSON.stringify(userData));
    }
        router.push('/general');
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: {
        email: '',
        password: '',
    }
  });

  return (
    <>
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.light' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <Box component="form" onSubmit={handleSubmit(loginSubmit)} noValidate sx={{ mt: 3 }}>
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
                    autoFocus
                    />
                )}
            />
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Log In
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={(event) => handleChange(event, 1)}>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>

      </Container>
    </>
  )
}
