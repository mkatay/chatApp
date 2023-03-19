import React, { useEffect, useState } from 'react'
import {addDoc,collection, serverTimestamp,onSnapshot, query, where, orderBy} from 'firebase/firestore'
import { db,auth } from '../firebase-config'

export const Chat=({room})=> {
    const [newMsg,setNewMsg]=useState('')
    const [messages,setMessages]=useState([])
    //meg kell mondani h melyik táblába tároljuk az üzeneteket, 
    //ezért kell erre egy referenciát létrehozni
    const messagesRef=collection(db,'messages');

    useEffect(()=>{
        const queryMsg=query(messagesRef,where('room','==',room),orderBy('createdAt'))
        const unsubscribe=onSnapshot(queryMsg,(snapshot)=>{
            //console.log('új üzenet...')
            let messages=[]
            snapshot.forEach(doc=>messages.push({...doc.data(),id:doc.id}))
            setMessages(messages)
        }) 
        //amikor megtörtént az adatok lekérdezése, meg kell szüntetni a kapcsolatot az erőforrással
        return ()=>unsubscribe()//clean up useEffect  
    },[])

    const handleSubmit= async (e)=>{
        e.preventDefault()
        console.log(newMsg)
        if(newMsg==='') return;
        await addDoc(messagesRef,{
            text:newMsg,
            createdAt:serverTimestamp(),
            user: auth.currentUser.displayName,
            room//ha a kulcs neve megegyezik a változó nevével így is lehet
        });
        setNewMsg('')
    }

  return (
    <div className='chat-app'>
        <div className="header">
            <h1>Welcome to:{room.toUpperCase()}</h1>
        </div>
      <div className="messages">
        {messages.map(msg=>
            <div className='message' key={msg.id}>
                <span className='user'>{msg.user}</span>
                <span>{msg.text} </span>
            </div>)}
        </div>
      <form onSubmit={handleSubmit} className='new-msg-form'>
        <input type="text" className='new-msg-input' 
            placeholder='type your message here...' 
            onChange={(e)=>setNewMsg(e.target.value)}/>
        <button type='submit' className='send-btn'>send</button>
      </form>
    </div>
  )
}
