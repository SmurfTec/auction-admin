import { useContext, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
// material
import {
  Container,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  TextField,
  Box
} from '@mui/material';

// components
import Page from '../components/Page';
import { AuthContext } from 'contexts/AuthContext';
import { handleCatch, makeReq } from 'utils/makeReq';
import { toast } from 'react-toastify';
const PREFIX = 'Settings';

const classes = {
  root: `${PREFIX}-root`,
  Input: `${PREFIX}-Input`,
  CardContentBox: `${PREFIX}-CardContentBox`
};

const StyledPage = styled(Page)({
  [`& .${classes.root}`]: {
    minWidth: 275,
    maxWidth: 500,
    margin: 'auto'
  },
  [`& .${classes.Input}`]: {
    marginBottom: '2rem'
  },
  [`& .${classes.CardContentBox}`]: {
    maxWidth: 400,
    textAlign: 'center',
    margin: 'auto'
  }
});

export default function Settings() {
  const { user, setUser } = useContext(AuthContext);
  const initialState = {
    name: '',
    email: '',
    password: '',
    passwordCurrent: '',
    passwordConfirm: ''
  };
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (!!user === false) return;

    setState((st) => ({
      ...st,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    }));
  }, [user]);

  const handleTxtChange = (e) => {
    setState((st) => ({ ...st, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    try {
      console.log(`st`, state);
      const resData = await makeReq(
        '/users/me',
        { body: { name: state.name, email: state.email } },
        'PATCH'
      );
      console.log(`resData`, resData);
      toast.success('Profile Updated');
      setUser(resData.user);
    } catch (err) {
      handleCatch(err);
    }
  };
  const handleUpdatePass = async () => {
    try {
      console.log(`st`, state);
      await makeReq(
        '/auth//update-password',
        {
          body: {
            passwordCurrent: state.passwordCurrent,
            password: state.password,
            passwordConfirm: state.passwordConfirm
          }
        },
        'PATCH'
      );
      toast.success('Password Updated');
    } catch (err) {
      handleCatch(err);
    }
  };

  return (
    <StyledPage title="Settings">
      <Container>
        <Card className={classes.root}>
          <CardContent>
            <Box className={classes.CardContentBox}>
              <Typography variant="h4" textAlign="center" color="textprimary" gutterBottom>
                Settings
              </Typography>
              <Box display="flex" gap={'20px'}>
                <TextField
                  className={classes.Input}
                  variant="outlined"
                  value={state.firstName}
                  name="firstName"
                  label="First Name"
                  onChange={handleTxtChange}
                  type="text"
                />
                <TextField
                  className={classes.Input}
                  variant="outlined"
                  value={state.lastName}
                  name="lastName"
                  label="Last Name"
                  onChange={handleTxtChange}
                  type="text"
                />
              </Box>
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.email}
                name="email"
                label="Email"
                onChange={handleTxtChange}
                type="text"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.passwordCurrent}
                name="passwordCurrent"
                label="Current Password"
                onChange={handleTxtChange}
                type="password"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.password}
                name="password"
                label="New Password"
                onChange={handleTxtChange}
                type="password"
              />
              <TextField
                fullWidth
                className={classes.Input}
                variant="outlined"
                value={state.passwordConfirm}
                name="passwordConfirm"
                label="Password Confirm"
                onChange={handleTxtChange}
                type="password"
              />
            </Box>
          </CardContent>
          <CardActions
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingBottom: 30,
              paddingRight: 20
            }}
          >
            <Button size="medium" variant="contained" onClick={handleSubmit}>
              Save Changes
            </Button>
            <Button size="medium" variant="contained" color="secondary" onClick={handleUpdatePass}>
              Update Password
            </Button>
          </CardActions>
        </Card>
      </Container>
    </StyledPage>
  );
}
