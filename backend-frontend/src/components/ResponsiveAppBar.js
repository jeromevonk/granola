import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import { useRouter } from 'next/router'

// import { useEffect } from 'react';
import { userService } from 'src/services';

const pages = [
  {
    title: 'Expenses',
    url: '/expenses'
  },
  {
    title: 'Stats',
    url: '/stats'
  },
  {
    title: 'New Expense',
    url: '/new-expense'
  },
];

const settings = [
  {
    title: 'Logout',
  }
]

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

const ResponsiveAppBar = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const subscription = userService.user.subscribe(x => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function logout() {
    userService.logout();
  }

  const router = useRouter();

  // only show app bar when logged in
  if (!user) return null;

  // ----------------------------------------------------------
  // handleOpenNavMenu
  // when screen is mobile, user clicks on the menu button
  // and nav menu opens
  // ----------------------------------------------------------
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // ----------------------------------------------------------
  // handleOpenUserMenu
  // when user clicks on the avatar and user menu opens
  // ----------------------------------------------------------
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // ----------------------------------------------------------
  // handleCloseNavMenu
  // closes the nav menu, either when:
  // - nav menu was open, menu button was clicked to close it
  // - navmenu was open, and an inside item was clicked
  // ----------------------------------------------------------
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // ----------------------------------------------------------
  // handleCloseUserMenu
  // closes the user menu, either when:
  // - user menu was open, avatar button was clicked to close it
  // - user menu was open, and an inside item was clicked
  // ----------------------------------------------------------
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // ----------------------------------------------------------
  // handleNavMenuClick
  // call handleCloseNavMenu and redirect to page
  // ----------------------------------------------------------
  const handleNavMenuClick = (page) => {
    handleCloseNavMenu();

    // Go to page
    router.push(page.url)
  }

  // ----------------------------------------------------------
  // handleUserMenuClick
  // call handleCloseUserMenu and logout
  // ----------------------------------------------------------
  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu();
    
    // For now, there's only one action on the user menu
    if ( setting.title === 'Logout') logout();
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AttachMoneyOutlined sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GRANOLA
          </Typography>

          {/* 
            // ----------------------------------------
            // Nav Menu
            //----------------------------------------
            // Show only for xs - extra small devices
            // (portrait phones, less than 576px)
            // https://mui.com/system/display/
            //----------------------------------------
            */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={() => handleNavMenuClick(page)}>
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <AttachMoneyOutlined sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GRANOLA
          </Typography>
          
          {/* 
            // ----------------------------------------
            // Pages on the app bar
            //----------------------------------------
            // Show for md (medium devices) and bigger
            // https://mui.com/system/display/
            //----------------------------------------
            */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleNavMenuClick(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.title}
              </Button>
            ))}
          </Box>

          {/* 
            // ----------------------------------------
            // Search fields
            //----------------------------------------
            // TODO https://mui.com/material-ui/react-app-bar/
            //----------------------------------------
            */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>

          {/* 
          // ----------------------------------------
          // User menu - always show
          //----------------------------------------
          */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar/>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={() => handleUserMenuClick(setting)}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
