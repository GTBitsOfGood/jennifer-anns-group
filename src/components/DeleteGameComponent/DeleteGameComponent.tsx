import { gameSchema } from '@/utils/types';
import {
    ChakraProvider, 
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    AlertDialogCloseButton,
    useDisclosure,
    Box,
    HStack
  } from '@chakra-ui/react'
import React from 'react';
import { z } from 'zod';

interface Props {
    gameData: z.infer<typeof gameSchema>;
}

export default function DeleteGameDialog({ gameData }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = React.useRef();
    
    return (
        <ChakraProvider>
            <button onClick={onOpen} className="font-sans font-semibold bg-delete-red rounded-md text-white px-[17px] py-2 text-xl">
                Delete Page
            </button>
            <AlertDialog
                motionPreset='slideInBottom'
                leastDestructiveRef={cancelRef}
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay />

                <AlertDialogContent height="450" maxWidth="585">
                    <AlertDialogCloseButton />
                    <AlertDialogHeader>
                        <div className="text-blue-primary text-2xl font-bold mt-[114px] mx-[118px] text-center">
                            Are you sure you want to delete {gameData.name}?
                        </div>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <div className="font-normal font-sans text-center">
                            Deleting a game page is final and cannot be undone. 
                        </div>
                    </AlertDialogBody>
                    <AlertDialogFooter justifyContent="center">
                        <button className="text-white font-sans font-semibold bg-delete-red w-[198px] h-[47px] rounded-[10px] mr-[22px] mb-24">
                        Yes, delete page
                        </button>
                        <button ref={cancelRef} onClick={onClose} className="font-sans font-semibold w-[198px] h-[47px] rounded-[10px] border-solid border-black border-[1px] ml-[22px] mb-24">
                        No, return
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ChakraProvider>
    );
}