import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchReportData, generateCustomerReport, clearError } from '../redux/actions/reportActions';
import { Bar } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportGenerator = () => {
    const dispatch = useDispatch();
    const { report, generatedReport, error } = useSelector((state) => state.report);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            dispatch(fetchReportData(dateRange));
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
        doc.save('report.pdf');
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
