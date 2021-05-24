import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputAdornment from '@material-ui/core/InputAdornment';
import EmailIcon from '@material-ui/icons/EmailOutlined';
import IconButton from '@material-ui/core/IconButton';
import VisibilityOutlinedIcon from '@material-ui/icons/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@material-ui/icons/VisibilityOffOutlined';
import validator from 'validator';
import { userSVC } from '@services';
import Helper from '@utils/Helper';
import Router from 'next/router';
import * as Cookie from 'universal-cookie';

const isBrowser = typeof window !== 'undefined';
const cookie = new Cookie.default();

let cachedToken = '';
declare let window: any;

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  signInText: {},
}));

interface State {
  email: {
    value: string;
    error?: string | undefined;
  };
  password: {
    value: string;
    error?: string | undefined;
    showPassword: boolean;
  };
  isSignin: boolean;
  disableLogin: boolean;
}

export default function SignIn() {
  const classes = useStyles();

  const [state, setState] = React.useState<State>({
    email: {
      value: '',
      error: undefined,
    },
    password: {
      value: '',
      error: undefined,
      showPassword: false,
    },
    isSignin: false,
    disableLogin: false,
  });

  React.useEffect(() => {
    if (!isBrowser) {
      setState({ ...state, isSignin: false });
    }
    if (cachedToken) {
      if (cachedToken !== null && cachedToken !== undefined) {
        Router.push('/').then(() => window.scrollTo(0, 0));
      }
    } else {
      cachedToken = cookie.get('userAuthToken');
      if (cachedToken !== null && cachedToken !== undefined) {
        Router.push('/').then(() => window.scrollTo(0, 0));
      }
    }
  }, [state.isSignin]);

  const handleChangeText = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (prop === 'password') {
      setState({
        ...state,
        password: {
          ...state.password,
          value: event.target.value,
          error: undefined,
        },
      });
    }

    if (prop === 'email') {
      setState({
        ...state,
        email: {
          ...state.email,
          value: event.target.value.trim(),
          error: undefined,
        },
      });
    }
  };

  const handleClickShowPassword = () => {
    setState({
      ...state,
      password: {
        ...state.password,
        showPassword: !state.password.showPassword,
      },
    });
  };

  const validateInputs = () => {
    let isValid = true;

    if (state.password.value.length === 0) {
      setState({
        ...state,
        password: { ...state.password, error: 'Required field' },
      });
      isValid = false;
    }

    if (!validator.isEmail(state.email.value)) {
      setState({
        ...state,
        email: { ...state.email, error: 'Invalid email' },
      });
      isValid = false;
    }

    if (state.email.value.length === 0) {
      setState({
        ...state,
        email: { ...state.email, error: 'Required field' },
      });
      isValid = false;
    }

    return isValid;
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleLogin = () => {
    if (validateInputs()) {
      setState({ ...state, disableLogin: true });
      userSVC
        .login({ email: state.email.value, password: state.password.value })
        .then((res: any) => {
          const userAuthToken = res.data.token;
          Helper.login(userAuthToken);

          Router.push('/').then(() => window.scrollTo(0, 0));
        })
        .catch((res: any) => {
          setState({ ...state, disableLogin: false });

          if (res === 'Network Error') {
            setState({
              ...state,
              password: {
                ...state.password,
                error: 'Something went wrong, check your internet connection',
              },
            });
          } else {
            setState({
              ...state,
              password: {
                ...state.password,
                error: 'User name or password incorrect',
              },
            });
          }
        });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            error={state.email.error === undefined ? false : true}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={state.email.value}
            onChange={handleChangeText('email')}
            helperText={state.email.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            error={state.password.error === undefined ? false : true}
            fullWidth
            name="password"
            label="Password"
            type={state.password.showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={state.password.value}
            onChange={handleChangeText('password')}
            helperText={state.password.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {state.password.showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            disabled={state.disableLogin}
            onClick={() => {
              handleLogin();
            }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forget_password" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/sign_up" variant="body2">
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
