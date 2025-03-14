import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosConfig';

const Login = () => {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  
  const handleClick = () => setShow(!show);

  const submitHandler = async (e) => {
    setLoading(true);
    if(!email || !password) {
      toast({
        title: 'Please fill all the field.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {"Content-type": "application/json"},
      };

      const {data} = await axiosInstance.post(`/api/user/login`,
        {email, password },
        config
      );
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate('/chats');

    } catch (error) {
      toast({
        title: 'Error occured!',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  }

  return (
    <VStack spacing="10px">
      
      <FormControl id="logInEmail" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="logInPassword" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      
      <Button
        bg="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>

    </VStack>
  )
}

export default Login
