import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';

const ChatPage = () => {
    const {user} = useChatState();

  return (
    <div style={{width: "100%" }}>
        {user && <SideDrawer />}
        <Box>
            {/* {user && <MyChats />} */}
            {/* {user && <ChatBox />} */}
        </Box>
    </div>
  )
}

export default ChatPage;