import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from '../theme';
import createEmotionCache from '../createEmotionCache';

import { userService, categoryService, alertService } from 'src/services';
import { CustomAlert } from 'src/components/CustomAlert';
import { getMainCategories } from 'src/helpers'

import ResponsiveAppBar from 'src/components/ResponsiveAppBar';

export const AppContext = React.createContext();

// Thresholds in pixels for detecting large screen
const WIDTH_TRESHOLD = 940;
const HEIGT_TRESHOLD = 900;

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export default function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const router = useRouter();

  // authorized does not mean authenticated - it means authorized for the current page
  const [authorized, setAuthorized] = useState(false);
  const [largeScreen, setLargeScreen] = useState({ width: true, height: true });
  const [visibility, setVisibility] = useState(true);

  // ----------------------------------------
  // Set listeners for screen change
  // ----------------------------------------
  React.useEffect(() => {
    // Set initial
    setLargeScreen({
      width: window.matchMedia(`(min-width: ${WIDTH_TRESHOLD}px)`).matches,
      height: window.matchMedia(`(min-height: ${HEIGT_TRESHOLD}px)`).matches
    });

    // Handlers
    const handleWidthResize = e => {
      setLargeScreen(prev => ({
        ...prev,
        width: e.matches
      }))
    };

    const handleHeigthResize = e => {
      setLargeScreen(prev => ({
        ...prev,
        height: e.matches
      }))
    };

    // Set listeners
    window
      .matchMedia(`(min-width: ${WIDTH_TRESHOLD}px)`)
      .addEventListener('change', handleWidthResize);

    window
      .matchMedia(`(min-height: ${HEIGT_TRESHOLD}px)`)
      .addEventListener('change', handleHeigthResize);

    // Cleanup
    return () => {
      window.removeEventListener('change', handleWidthResize);
      window.removeEventListener('change', handleHeigthResize);
    }
  }, []);

  // ----------------------------------------
  // Set callbacks for router events
  // ----------------------------------------
  React.useEffect(() => {
    // on initial load - run auth check 
    authCheck(router.asPath);

    // on route change start - hide page content by setting authorized to false  
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);

    // on route change complete - run auth check 
    router.events.on('routeChangeComplete', authCheck)

    // unsubscribe from events in useEffect return function
    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------
  // Get the categories list only once
  // ----------------------------------------
  const [categories, setCategories] = React.useState(null);
  React.useEffect(() => {
    if (categories !== null) return;

    if (userService.userValue) {
      // Get categories, save on state
      let isSubscribed = true;
      categoryService.getCategories()
        .then(cat => {
          if (isSubscribed) {
            setCategories({
              all: cat,
              mainCategories: getMainCategories(cat),
            });
          }
        })
        .catch(err => alertService.error('Error fetching categories'));
      return () => isSubscribed = false
    }
  });

  function authCheck(url) {
    // redirect to login page if accessing a private page and not logged in 
    const publicPaths = ['/account/login', '/account/register'];
    const path = url.split('?')[0];
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false);
      router.push({
        pathname: '/account/login',
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Granola</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <AppContext.Provider value={{
          largeScreen,
          categories: {
            all: categories?.all || [],
            mainCategories: categories?.mainCategories || [],
            setCategories: setCategories
          },
          visibility: [
            visibility,
            setVisibility
          ]
        }}>
          <div>
            <ResponsiveAppBar />
            <CustomAlert />
            {authorized &&
              <Component {...pageProps} />
            }
          </div>
        </AppContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};