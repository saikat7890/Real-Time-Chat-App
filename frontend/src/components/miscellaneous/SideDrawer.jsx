import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, IconButton, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import {ArrowBackIcon, BellIcon, ChevronDownIcon} from "@chakra-ui/icons";
import React, { useState } from 'react'
import { useChatState } from '../../context/ChatProvider';
import ProfileModel from './ProfileModel';
import ChatLoading from './ChatLoading';
import UserListItem from '../UsersAvatar/UserListItem';
// import axios from 'axios';
import {Spinner} from '@chakra-ui/spinner';
import { getSender } from '../../config/ChatLogics';
import axiosInstance from '../../config/axiosConfig';
import { useAuthCtx } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { setSelectedChat, chats, setChats, notification, setNotification } = useChatState();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast();
  // const URL = `https://real-time-chat-app-backend-kob0.onrender.com`;
  
  const {user, logout} = useAuthCtx()
  const navigate = useNavigate();

  const handleSearch = async () => {
    if(!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }

      // console.log(search);
      const {data} = await axiosInstance.get(`/api/user?search=${search}`, config);
      // console.log(data);
      
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the searc results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  }
  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const {data} = await axiosInstance.post("/api/chats", {userId}, config);
      
      setSelectedChat(data);
      setChats([data, ...chats]);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      
    }
  }

  return (
    <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      borderWidth="5px"
      >
        <Tooltip 
          label="Search Users to chat" 
          hasArrow 
          placement='bottom-end'
        >
          <Button variant='ghost' onClick={onOpen}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <Text display={{base:"none",md:'flex'}} px={4}>Search User</Text>
          </Button>
        </Tooltip>

        <Text fontSize="2xl" fontFamily="Work sans">
          My Chat App
        </Text>
        <div className='flex space-x-2'>
          <IconButton
            size={"sm"}
            m={1}
            background={"white"}
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
              <path d="M0 128C0 92.7 28.7 64 64 64l256 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2l0 256c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1l0-17.1 0-128 0-17.1 14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/>
              </svg>}
            onClick={() => window.open('/videochat', '_blank')}
          />
          <Menu>
            <MenuButton p={1} className='relative'>
               {notification.length!==0 ? <span className='absolute top-[-2px] right-[17px] h-[20px] w-[20px] text-[13px] text-white bg-[#f23a3a] rounded-xl text-center'>{notification.length}</span>
                  : <></>}
              <BellIcon fontSize="3xl" m={0} />
            </MenuButton>

            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>

          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>Search Users</DrawerHeader>
          <DrawerBody>
          <Box display='flex' pb={2}>
            <Input
              placeholder="Search by my name or email"
              mr={2}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch} >Go</Button>
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={()=>accessChat(user._id)}  
              />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex" />}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer;
