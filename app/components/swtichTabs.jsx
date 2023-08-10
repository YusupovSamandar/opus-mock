import * as React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function FullWidthTabs({ mainPage, pendingCandidatePage, completeCandidatePage, pendingCandidatePageLabel, completeCandidatePageLabel }) {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    return (
        <Box sx={{ bgcolor: 'background.paper' }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant="fullWidth"
                    aria-label="full width tabs example"
                    centered
                >
                    <Tab label="Main" {...a11yProps(0)} />
                    <Tab icon={
                        <Badge badgeContent={pendingCandidatePageLabel} color="success">
                            <span style={{ paddingRight: "5px" }}>pending</span>
                        </Badge>
                    } {...a11yProps(1)} />
                    <Tab icon={
                        <Badge badgeContent={completeCandidatePageLabel} color="success">
                            <span style={{ paddingRight: "5px" }}>done</span>
                        </Badge>
                    } {...a11yProps(2)} />
                </Tabs>
            </AppBar>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}
            >
                <TabPanel value={value} index={0} dir={theme.direction}>
                    {mainPage}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction}>
                    {pendingCandidatePage}
                </TabPanel>
                <TabPanel value={value} index={2} dir={theme.direction}>
                    {completeCandidatePage}
                </TabPanel>
            </SwipeableViews>
        </Box>
    );
}