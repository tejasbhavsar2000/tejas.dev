import Style from '@styles/Toogle.module.css'
export default function Toogle(){
    
    function myFunction_get(name) {
        var r = document.querySelector(':root');
        var rs = getComputedStyle(r);
        return rs.getPropertyValue(name);
      }
    const toogle= ()=>{
        var r = document.querySelector(':root');
        r.style.setProperty('--bg-dark', 'black' == myFunction_get('--bg-dark')? 'white' : 'black');
        r.style.setProperty('--color-primary-light', 'white' == myFunction_get('--color-primary-light')? 'black' : 'white');
    }
    return(
        <button type="button" onClick={toogle} title="Toggle dark/light mode">🌛</button>
    )     
}