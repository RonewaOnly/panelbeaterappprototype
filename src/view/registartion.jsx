

export default function Registartion(){
    return(
        <div className="container-fluid" style={{marginTop:"100px", marginBottom:"100px"}}
        id="registration">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4 col-xl-3">
                    <div className="card text-center" style={{width:"100%", height:"100%"}}
                    id="card">
                        <div className="card-body">
                            <h5 className="card-title">Registration</h5>
                            <form className="form-group" action="/register" method="POST">
                            <input type="text" className="form-control" name="name" placeholder="Name"
                            required="required" />
                            <input type="text" className="form-control" name="email" placeholder="Email"
                            required="required" />
                            <input type="password" className="form-control" name="password" placeholder="Password"
                            required="required" />
                            <button type="submit" className="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}