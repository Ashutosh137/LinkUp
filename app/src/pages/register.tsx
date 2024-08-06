import { Fragment, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Stack, Typography, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleSignup, signup } from '../redux/slice/userdataSlice';
import InitialStateProps from '../redux/initialprops';
import { useAppDispatch } from '../redux/ḥooks';
import toast from 'react-hot-toast';

function Register() {
  const { error, isSignup } = useSelector((state: InitialStateProps) => state);
  const router = useNavigate();
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [name, setname] = useState('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    isSignup && router('/login');
  }, [isSignup]);

  return (
    <Fragment>
      <Typography
        variant="h4"
        textAlign={'center'}
        textTransform={'capitalize'}
        my={4}
        color="primary"
      >
        sign-up
      </Typography>
      <Stack
        mx="auto"
        direction={'row'}
        justifyContent={'center'}
        spacing={4}
        alignItems={'center'}
      >
        <Button variant="text" color="primary">
          <GoogleLogin
            onSuccess={(cradit) => {
              dispatch(GoogleSignup(cradit));
            }}
            onError={() => {
              toast.error('Register failed');
            }}
          />
        </Button>
        <Typography variant="body1" textAlign={'center'} color="primary">
          OR
        </Typography>
      </Stack>

      <Stack
        direction={'column'}
        justifyContent={'center'}
        maxWidth={800}
        mx="auto"
        component={'form'}
        onSubmit={async (e) => {
          e.preventDefault();
          dispatch(signup(email, pass, name));
        }}
        spacing={2}
        my={2}
      >
        <Typography
          variant="body1"
          textTransform={'capitalize'}
          textAlign={'center'}
          color="red"
        >
          {error}
        </Typography>

        <TextField
          fullWidth
          id="name"
          label="Name"
          sx={{ placeholder: { color: 'primary' } }}
          color="primary"
          InputLabelProps={{ style: { color: 'primary' } }}
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setname(e.target.value);
          }}
          required
        />
        <TextField
          fullWidth
          id="email"
          label="Email id"
          InputLabelProps={{
            style: { color: 'primary', borderColor: 'primary' },
          }}
          type="email"
          placeholder="Email id"
          sx={{ placeholder: { color: 'primary' } }}
          color="primary"
          value={email}
          onChange={(e) => {
            setemail(e.target.value);
          }}
          required
        />
        <TextField
          id="password"
          fullWidth
          type="password"
          sx={{ placeholder: { color: 'primary' } }}
          placeholder="Password"
          label="Password"
          color="primary"
          InputLabelProps={{ style: { color: 'primary' } }}
          value={pass}
          onChange={(e) => {
            setpass(e.target.value);
          }}
          required
        />

        <Box justifyContent={'center'}>
          <Button color="success" type="submit" variant="contained">
            sumbit
          </Button>
        </Box>
        <Box
          my={2}
          component={Link}
          sx={{ textDecoration: 'none' }}
          to={'/login'}
          color="initial"
        >
          <Typography variant="body2" color="initial">
            Already Registered ?
          </Typography>
        </Box>
      </Stack>
    </Fragment>
  );
}

export default Register;
