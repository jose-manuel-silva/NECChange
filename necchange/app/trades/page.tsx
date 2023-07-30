'use client'

import StudentSchedule from '../components/trades/schedule/StudentSchedule'
import PopUp from '../components/trades/popUp/PopUp'
import { useSession} from "next-auth/react";
import { useState, useEffect } from 'react'
import axios from 'axios'

export interface Classes {
  title: string,
  uc_name: any
  shift: number,
  type: string,
  start: string,
  end: string,
}

function decript(number : any){
  const digits = number.slice(-(number.length - 2))
  let final = digits
  let splitted = final.split('')
  for(let i = 0; i < Math.floor(digits.length / 2); i++){
    splitted[i] = digits[digits.length-(1+i)]
    splitted[digits.length-(1+i)] = digits[i]
  }
  return "A9"+ splitted.join('')
}

export default function Home() {
    let student_nr = '';
    const [isTradesOpened, setIsTradesOpened] = useState(false);
    const [classes, setClasses] = useState([]);
    const {data: session} = useSession();
  
    const handleTradesPopUp = () => setIsTradesOpened(!isTradesOpened);
  
    // useEffect(() => {
    //   const getEvents = async () => {
    //     try {
    //       const response = await axios.get(`api/trades/student_schedule/${student_nr}`);
    //       setClasses(response.data.response);
    //     } catch (error) {
    //       console.error('Error fetching data:', error);
    //     }
    //   };
  
    //   getEvents();
    // }, []); 

    useEffect(() => {
      if(session){
        student_nr = decript(session.user?.email?.split("@")[0])
        const getEvents = async () => {
          try {
            const response = await axios.get(`api/trades/student_schedule/${student_nr}`);
            setClasses(response.data.response);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        getEvents();
      }
    }, [session]); 
    

    return (
      <div className='bg-white h-screen pt-24 '>
        <div className='ml-auto mr-auto px-8 md:px-16'>
          <StudentSchedule events={classes} handleTradesPopUp={handleTradesPopUp} />
        </div>
        <PopUp handleTradesPopUp={handleTradesPopUp} isTradesOpened={isTradesOpened} classes={classes} student_nr={student_nr}/>
      </div>
    );
}