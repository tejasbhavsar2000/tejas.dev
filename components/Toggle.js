import Image from 'next/image';
import { useEffect, useState } from 'react';
export default function Toogle(){
    const [currentMode, setCurrentMode] = useState();
    useEffect(() => {
        setCurrentMode(myFunction_get('--bg-dark'))
    },[])
    function myFunction_get(name) {
        const r = document.querySelector(':root');
        const rs = getComputedStyle(r);
        return rs.getPropertyValue(name);
    }
    const CurrentMode= ()=>{
        if(currentMode == 'white')
            return <Image src="/dark_mode.svg" height={30} width={30} onClick={toogle} />
        else    
            return <Image src="/light_mode.svg" height={30} width={30} onClick={toogle} />
    }
    const toogle = () => {
        console.log("hello");
        const mode = myFunction_get('--bg-dark');
        const r = document.querySelector(':root');
        const scheme = 'white' == mode ? 'black' : 'white'
        setCurrentMode(scheme);
        r.style.setProperty('--bg-dark', scheme);
        r.style.setProperty('--color-primary-light', 'black' == myFunction_get('--color-primary-light')? 'white' : 'black');
    }
    return(
            <CurrentMode/>
    )     
}