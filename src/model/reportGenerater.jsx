import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReportDataByRange, generateCustomerReport, clearError } from '../redux/actions/reportActions';
import { sendFileData } from '../redux/actions/fileActions';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportGenerator = () => {
    const dispatch = useDispatch();
    const { report, generatedReport, error } = useSelector((state) => state.report);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    console.log("Customers state dubugging:", generatedReport);  // Debugging

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            dispatch(fetchReportDataByRange(dateRange));
        }
    }, [dateRange, dispatch]);

    const handleGenerateReport = () => {
        dispatch(generateCustomerReport(report));
    };

    const handleDownloadPDF = () => {
        if (!generatedReport) {
            alert('No report data to download.');
            return;
        }

        const doc = new jsPDF();
        doc.text('Customer Interaction Report', 20, 10);
        doc.autoTable({
            head: [['Metric', 'Value']],
            body: [
                ['Total Requests', generatedReport.totalRequests],
                ['Completed Requests', generatedReport.completedRequests],
                ['Average Response Time (hours)', generatedReport.averageResponseTime],
                ['Customer Retention Rate (%)', generatedReport.retentionRate],
            ],
        });

        // Generate Blob for the PDF
        const pdfBlob = doc.output('blob');
        const fileName = `report_${new Date().toISOString()}.pdf`;

        // Save PDF to user's device
        doc.save(fileName);

        // Send PDF Blob to the server
        const pdfFile = new File([pdfBlob], fileName, { type: 'application/pdf' });
        dispatch(sendFileData(pdfFile));
    };

    return (
        <div>
            <div>
                <label>
                    Start Date: <input type="date" onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                </label>
                <label>
                    End Date: <input type="date" onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                </label>
            </div>
            <button onClick={handleGenerateReport}>Generate Report</button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
            {generatedReport && (
                <div>
                    <h3>Generated Report</h3>
                    <p>Total Requests: {generatedReport.totalRequests}</p>
                    <p>Completed Requests: {generatedReport.completedRequests}</p>
                    <p>Average Response Time: {generatedReport.averageResponseTime}</p>
                    <p>Customer Retention Rate: {generatedReport.retentionRate}%</p>
                    <button onClick={handleDownloadPDF}>Download PDF</button>
                </div>
            )}
        </div>
    );
};

export default ReportGenerator;
