import Head from 'next/head';
import * as React from 'react';
import {Paper, Tabs, Tab, Typography, Box, Link} from '@mui/material';
import Login from '../components/Login'
import Signup from '../components/SignUp' 
import {createTheme, ThemeProvider} from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    buttons: Palette['primary'];
  }

  interface PaletteOptions {
    buttons?: PaletteOptions['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    buttons: true;
  }
}

const theme = createTheme({
  palette: {
    secondary:{
      main: '#EC53B0',
      light: '#574AE2',
    },
  }
})
function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Biluha
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{padding: 2}}>
          {children}
        </Box>
      )}
    </div>
  );
}


export default function Home() {
  const [value,setValue]=React.useState(0)
  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const paperStyle={width:450,margin:"20px auto"}

  return (
    <div>
      <Head>
        <title>Biluha</title>
      </Head>
      <ThemeProvider theme={theme}>
        <Box sx={{textAlign: 'center', width: 450, margin:"20px auto"}}>
          <Typography variant="h4" gutterBottom>
          Welcome to Biluha
          </Typography>
          <Typography variant="body1" paragraph>
            It`s your gateway to a simple yet powerful micro-blogging experience. In a world filled with noise and complexity, Biluha offers a refreshing, streamlined approach to sharing your thoughts, stories, and ideas with the world.
          </Typography>
        </Box>

        <Paper elevation={20} style={paperStyle}>
          <Tabs
            value={value}
            indicatorColor='secondary'
            textColor='secondary'
            onChange={handleChange}
            variant="fullWidth"
          >
            <Tab label="Log In" />
            <Tab label="Sign Up" />
          </Tabs>
          <CustomTabPanel value={value} index={0}>
            <Login handleChange={handleChange}/>
            <Copyright sx={{ mt: 4, mb: 4 }} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Signup handleChange={handleChange}/>
            <Copyright sx={{ mt: 4, mb: 4 }} />
          </CustomTabPanel>
        </Paper>
      </ThemeProvider>
    </div>
  )
}
