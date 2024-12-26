import ReportGenerater from "../model/reportGenerater";
import { customerInteractions } from "../controller/customerDump";
import { ReportChart } from "../controller/generateReports";

export default function Report(){
    return(
        <div className="report">
            <h1>Report</h1>
            <p>this process will be auto...</p>
            <div> 
                <ReportGenerater/>
            </div>
        </div>
    );
}