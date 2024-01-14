'use client'
import React, { useEffect, useState, useRef, useContext } from 'react';
import { io } from "socket.io-client";

let socket;

const ChatButton = () => {

    const userId = 'test-user-id';

    useEffect(() => {
        socket = io('https://localhost:3001');

        socket.emit('register', userId);

        socket.on('newMessage', (data) => {
            console.log('--------------------------------');
            console.log('--------------------------------');
            console.log('--------------------------------');
            console.log('--------------------------------');
            console.log('New message for user:', data.userId);
            console.log('--------------------------------');
            console.log('--------------------------------');
            console.log('--------------------------------');

            // Handle new message event here
        });

        return () => {
            socket.disconnect();
        };
    }, [userId]);


    const sendTestEvent = async () => {

        try {
            const response = await fetch('http://localhost:3001/insertEvent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: userId }), // Adjusted to send user ID
            });

            const data = await response?.json();
            console.log(data);
            if (response.ok) {
                console.log(data);
                triggerAlert('success');
                // // Create a new message entry with the required data
                // const newMessage = {
                //     from: 'user',
                //     user_id: user._id,
                //     user_name: user.name,
                //     content: message,
                //     _id: '', // You can assign a unique ID if needed
                //     createdAt: '2024-01-09T11:18:28.369Z', // Set the desired timestamp
                //     updatedAt: '2024-01-09T11:18:28.369Z', // Set the desired timestamp
                // };

                // // Update the state with the new message
                // setMessages([...messages, newMessage]);
                // console.log(data?.message);
            } else {
                triggerAlert('An Error has occurred');
                console.error('Message Send Failed');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            // setMessage('');
            // setIsLoading(false);
        }
    }

    ////////////////////////////////////////////////////////////////////////

    return (
        <div className="fixed bottom-4 right-4">
            <button onClick={sendTestEvent} >Click Test Socketio</button>
        </div>
    );
};

export default ChatButton;