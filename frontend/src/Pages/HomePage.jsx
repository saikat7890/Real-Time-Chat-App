import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
import { useAuthCtx } from '../context/AuthContext';

const HomePage = () => {
    const {user} = useAuthCtx();
    const [fetchAgain, setFetchAgain] = useState(false);

  
  return (
    <div style={{width: "100%" }} className='bg-sky-500'>
        {user && <SideDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
        </Box>
    </div>
  )
}

export default HomePage;