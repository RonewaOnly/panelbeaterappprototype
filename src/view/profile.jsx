import { useReducer, useState } from "react";
import { USERS } from "../model/user";

export default function Profile(){
    const [currentState,setCurrentState] = useState(USERS);//this will be checking if the user is logged-in
    const [edit,setEdit] = useReducer(""); //this reducer will be working on reading and updating the user's profile information
    
    function handleEdit(){
        return([
            ...currentState,
            setEdit(currentState)
        ]
        )
    }
    return(
        <div className="profile">
            <h1>Profile</h1>
            {
                currentState.map((user,index)=>(
                    <>
                        <div>
                            <button><i class="fa-solid fa-pen"></i></button>
                            <div>
                                <img src={user.profile.tumbtag} alt={user.name}/>
                                    {user.online? <span className="green">online</span>: <span className="gray">offline</span> }
                            </div>
                            <h3>{user.name}</h3>
                            <p>{user.email}</p>
                            <p>{user.online}</p>
                            <p>{user.role}</p>
                            <button type="button" onClick={()=>{
                                prompt("we are deleting an account ")
                            }}>Delete</button>|
                        <button type="button" onClick={()=>{setEdit(user)}}>Edit</button>|
                        <button type="button" onClick={false}>Pause</button>

                        </div>
                    </>
                ))
            }
        </div>
    );
}

