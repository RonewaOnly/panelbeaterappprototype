
import { useState } from 'react';
import './style.css';
import { USERS } from '../model/user';
export default function Login({action}){
    console.log("login page",action);
    const [user,setUser] = useState('');

    return(
        <div className="container">
            <form>
                <label>
                    Enter username/email: 
                    <input type="text" id="value" name="value" placeholder="enter username/email"/>
                </label><br/>

                <label>
                    Enter password: 
                    <input type="password" id='password' name="password" placeholder="enter password e.g 12345"/>
                </label><br/>
                
                <button type="button" className='btn' onClick={()=>{
                    action()
                    USERS[0].online = true;
                    }}>Login</button>
            </form>
            <hr/>
                <p>Don't have an account? <a href="/signup">Sign up</a></p>
        </div>
    );
}