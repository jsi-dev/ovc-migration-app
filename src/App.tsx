import React from 'react';
import {AppShell, Button, Header, Space, Title, Burger, MediaQuery, useMantineTheme} from "@mantine/core";
import {ChatBubbleIcon, Share1Icon} from "@modulz/radix-icons";
import {BrowserRouter as Router, Link, Route, Routes} from "react-router-dom";
import Migration from "./pages/Migration";
import Help from "./pages/Help";

const buttonStyles = {
    root: {
        textDecoration: "none",
        color: "white"
    }
}

function App() {
    const [opened, setOpened] = React.useState(true);
    const theme = useMantineTheme();
    return (
        <Router>
            <AppShell
                padding="xs"
                header={<Header height={50} padding="xs" fixed>
                    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                            <Burger
                                opened={opened}
                                onClick={() => setOpened((o) => !o)}
                                size="sm"
                                color={theme.colors.gray[6]}
                                mr="xl"
                            />
                        </MediaQuery>
                        {/*<Text color="blue" size="xl" mr="xl" transform="uppercase"></Text>*/}
                        <Title order={2}>OVC - DATA MIGRATION TOOL</Title>
                        <Space w="xl" />
                        <Space w="xl" />

                        <Button leftIcon={<Share1Icon/>} style={buttonStyles.root} color={theme.colors.green[8]}
                                component={Link} to="/" mr="xs">
                            Migration
                        </Button>
                        <Button leftIcon={<ChatBubbleIcon/>} style={buttonStyles.root} color={theme.colors.green[8]}
                                component={Link} to="/help" mr="xs">
                            Help
                        </Button>

                    </div>
                </Header>}
                styles={(theme) => ({
                    main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
                })}
            >
                <Routes>
                    <Route path="/" element={<Migration/>}/>
                    <Route path="/help" element={<Help/>}/>
                </Routes>
            </AppShell>
        </Router>
    );
}

export default App;
