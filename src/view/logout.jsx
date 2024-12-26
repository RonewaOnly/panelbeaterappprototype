

export default  function Logout({action}){
    console.log("logout page",action);
    function logout(){
        if(action === true){
            alert("We are logging out");
            action = false;
            console.log(action)
        }
    }
    return(
        <div className="logout">
            <h1>Logout</h1>
            <p>Are you sure you want to logout?</p>
            <button onClick={()=>{
                action = false
                console.log(action)
            }}>logout</button>
        </div>
    );
}