'use client'

import React, { useState, useEffect } from 'react';
import { Box, Modal, Typography, Stack, TextField, Button, InputAdornment } from "@mui/material";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, query } from "firebase/firestore";
import { firestore } from '@/firebase';

// Custom search icon component
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [updateItem, setUpdateItem] = useState({ name: '', quantity: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const updateItemQuantity = async () => {
    const docRef = doc(collection(firestore, 'inventory'), updateItem.name);
    await setDoc(docRef, { quantity: updateItem.quantity });
    await updateInventory();
    setUpdateOpen(false);
  };

  const filterInventory = (searchTerm) => {
    const filtered = inventory.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    filterInventory(searchTerm);
  }, [searchTerm, inventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleUpdateOpen = (item) => {
    setUpdateItem(item);
    setUpdateOpen(true);
  };
  const handleUpdateClose = () => setUpdateOpen(false);

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
      sx={{ backgroundColor: '#f0f8ff' }}
    >
      {/* Add Item Modal */}
      <Modal open={open} onClose={handleClose}>
        <Box 
          position='absolute' 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant='outlined'
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button 
              variant="contained" 
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Update Item Modal */}
      <Modal open={updateOpen} onClose={handleUpdateClose}>
        <Box 
          position='absolute' 
          top="50%" 
          left="50%" 
          width={400}
          bgcolor="white"
          borderRadius={2}
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Update Item: {updateItem.name}</Typography>
          <TextField
            variant='outlined'
            fullWidth
            type="number"
            value={updateItem.quantity}
            onChange={(e) => setUpdateItem({ ...updateItem, quantity: parseInt(e.target.value) })}
          />
          <Button 
            variant="contained" 
            onClick={updateItemQuantity}
          >
            Update
          </Button>
        </Box>
      </Modal>

      <Button 
        variant="contained" 
        onClick={handleOpen}
        sx={{ mb: 2, backgroundColor: '#2196f3', '&:hover': { backgroundColor: '#1976d2' } }}
      >
        ADD NEW ITEM
      </Button>
      <Box 
        width="800px"
        border="1px solid #ccc"
        borderRadius={2}
        overflow="hidden"
        sx={{ backgroundColor: 'white' }}
      >
        <Box 
          width="100%" 
          height="100px" 
          bgcolor="#e3f2fd" 
          display="flex" 
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h4" color="#333" fontWeight="bold">
            Inventory Items
          </Typography>
        </Box>
        <Box p={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Stack width="100%" spacing={2} p={2} sx={{ maxHeight: '400px', overflowY: 'auto' }}>
          {filteredInventory.map((item) => (
            <Box
              key={item.name}
              width="100%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f5f5f5"
              borderRadius={1}
              p={2}
            >
              <Typography variant="h6" color="#333" flexGrow={1}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="h6" color="#333" mr={2}>
                {item.quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button 
                  variant="contained"
                  size="small"
                  onClick={() => addItem(item.name)}
                  sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#45a049' } }}
                >
                  ADD
                </Button>
                <Button 
                  variant="contained"
                  size="small"
                  onClick={() => removeItem(item.name)}
                  sx={{ backgroundColor: '#f44336', '&:hover': { backgroundColor: '#d32f2f' } }}
                >
                  REMOVE
                </Button>
                <Button 
                  variant="contained"
                  size="small"
                  onClick={() => handleUpdateOpen(item)}
                  sx={{ backgroundColor: '#ffa726', '&:hover': { backgroundColor: '#fb8c00' } }}
                >
                  UPDATE
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}