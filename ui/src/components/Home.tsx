import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, Container, Grid, Paper, List, ListItem, IconButton, Icon, Slide } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Dashboard, ExpandCircleDown, MonitorHeart, Settings, Slideshow } from '@mui/icons-material';

const FeatureBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}));

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'left', mr: "160px" }}>
        <img src="/goldfinch-logo.svg" alt="Goal Finch Logo" style={{
            width: '160px', height: 'auto', float: 'right',
            backgroundColor: 'white',
            border: '4px solid #F4B942',
            borderRadius: '50%'
        }} />
        <Typography variant="h3" component="h2" gutterBottom>
          Goal Finch
        </Typography>
        <hr style={{ height: '4px', backgroundColor: '#F4B942', border: 'none' }}></hr>
        <Typography variant="h5" color="text.secondary" paragraph>
          A simple, flexible progress tracker for personal goals.
        </Typography>
        <List sx={{
            mb: 2,
            listStyleType: 'disc',
            pl: 2,
            '& .MuiListItem-root': {
                display: 'list-item',
                p: 0,
            },            
        }}>
            <ListItem>Low-key visual reminders to help you stay on track.</ListItem>
            <ListItem>Simple setup, with a ton of flexibility.</ListItem>
            <ListItem>You can track virtually anything.</ListItem>
            <ListItem>Complete control of personal data</ListItem>
            <ListItem>Open source and extensible</ListItem>
        </List>
        <Typography variant="h4" component="h3" gutterBottom sx={{ mt: 4 }}>
          Quick start
        </Typography>
        <p>Click the <ExpandCircleDown sx={{ position: "relative", top: "10px", fontSize: "32px", rotate: "-90deg" }}></ExpandCircleDown> button in the lower left corner to expand the menu and see your options.</p>
        <p style={{ margin: "0px 0px 0px 40px" }}>Check out the dashboard here: <a href="/dashboard"><Slideshow sx={{ position: "relative", top: "10px", fontSize: "32px" }}/></a></p>
        <p style={{ margin: "0px 0px 0px 40px" }}>Set up your dashboard here: <a href="/goals"><MonitorHeart sx={{ position: "relative", top: "10px", fontSize: "32px" }}/></a></p>
        <p style={{ margin: "0px 0px 0px 40px" }}>Configure connections here: <a href="/settings"><Settings sx={{ position: "relative", top: "10px", fontSize: "32px" }}/></a></p>
        <p style={{ marginTop: "20px" }}>Your data is private. In quickstart mode, all data stays in your browser.</p>
        <p style={{ marginTop: "20px" }}>You can read more in the <a href="https://docs.goalfinch.com" target="_blank" rel="noopener noreferrer">Goal Finch documentation</a>.</p>

        {/* <Typography variant="h4" component="h3" gutterBottom sx={{ mt: 4 }}>
          Self-hosting
        </Typography> */}
      </Box>

    </Container>
  );
};

export default Home;
