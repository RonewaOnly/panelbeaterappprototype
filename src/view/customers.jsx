import { useState } from "react";
import { CUSTOMERS } from "../Customers";
import './style.css'



export default function Customers(){
    const [customers,setCustomers] = useState(CUSTOMERS)
    const [action,setACTION] = useState({
        clicked: false,
        id: 0,
        colNumber: 0
    })
    return(
        <>
        {
                                    action.clicked? <PopSelection id={action.id} customer={customers} colNum={action.colNumber}/>:
                                    <table>
                                    <tr>
                                        <th>Customer ID</th>
                                        <th>Customer Name</th>
                                        <th>Customer Address</th>
                                        <th>Problem</th>
                                        <th>Type</th>
                                        <th>Status </th>
                                    </tr>
                                    {
                                            customers.map((customer,index)=>(
                                                    <tr key={index} onClick={e=>setACTION({clicked:true,id: customer.id,colNumber: index})}>
                                                        <td>{customer.id}</td>
                                                        <td>{customer.firstname}</td>
                                                        <td>{customer.username}</td>
                                                        <td>{customer.problem}</td>
                                                        <td>{customer.typeOfCar}</td>
                                                        <td>{customer.username}</td>
                                                    </tr>
                                        ))
                                    
                                    }
                                </table>

        }
        </>
    );
}
export function PopSelection({id,customer,colNum}){
    const match = customer.findIndex( (customer) => customer.id === id );

   if(match >= 0){
    return(
        <p>
            {CUSTOMERS[match].firstname},{CUSTOMERS[match].lastname},column Number: { colNum}
        </p>
    )
   }else{
    return <p>No customer detail's </p>
   }

}