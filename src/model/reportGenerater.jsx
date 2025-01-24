import { useEffect, useState, useRef } from "react";
import { customerInteractions } from "../controller/customerDump";
import { generateReportData, calculateCustomerRetention } from "../controller/generateReports";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar } from 'react-chartjs-2';
// import ChartJS from 'chart.js/auto';
// import html2canvas from 'html2canvas';


export default function ReportGenerater() {
    const [report, setReport] = useState(customerInteractions);
    const [click, setClick] = useState(false);
    const [id, setId] = useState(0);
    const [generatedReport, setGeneratedReport] = useState(null);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [error, setError] = useState('');
    const chartRef = useRef(null); // Use ref to reference the chart

    useEffect(() => {
        if (dateRange.start && dateRange.end) {
            const filteredData = customerInteractions.filter(interaction => {
                const interactionDate = new Date(interaction.requestDate);
                return interactionDate >= new Date(dateRange.start) && interactionDate <= new Date(dateRange.end);
            });
            setReport(filteredData);
        }
    }, [dateRange]);

    function HandleClick() {
        setClick(true);
    }

    function generateCustomerReport() {
        try {
            const data = generateReportData(report);
            const retentionRate = calculateCustomerRetention(report);
            setGeneratedReport({ ...data, retentionRate });
            setError('');
        } catch (e) {
            setError("Error generating report: " + e.message);
        }
    }
    const downloadPDF = async () => {
        if (!generatedReport) {
            setError("No report data available to download.");
            return;
        }
    
        try {
            const doc = new jsPDF();
            doc.text("Customer Interaction Report", 20, 10);
    
            doc.autoTable({
                head: [['Metric', 'Value']],
                body: [
                    ['Total Requests', generatedReport.totalRequests],
                    ['Completed Requests', generatedReport.completedRequests],
                    ['Average Response Time (hours)', generatedReport.averageResponseTime.toFixed(2)],
                    ['Customer Retention Rate (%)', generatedReport.retentionRate],
                ],
            });
    
            doc.text("Service Categorization", 20, 60);
            Object.keys(generatedReport.servicesCategorized).forEach((service, index) => {
                const serviceData = generatedReport.servicesCategorized[service];
                doc.autoTable({
                    startY: 70 + index * 20,
                    head: [['Service', 'Requests', 'Average Satisfaction']],
                    body: [
                        [service, serviceData.count, serviceData.averageSatisfaction],
                    ],
                });
            });
    
            // Add the chart to the PDF
            if (chartRef.current) {
                const chart = chartRef.current;
                const chartCanvas = chart.canvas;
                
                if (chartCanvas) {
                    // Wait for the chart to finish rendering
                    await new Promise(resolve => setTimeout(resolve, 1000));
    
                    const chartDataURL = chartCanvas.toDataURL('image/png');
                    
                    // Calculate the position to add the chart
                    const yPosition = doc.lastAutoTable.finalY + 10;
                    
                    // Add the chart image to the PDF
                    doc.addImage(chartDataURL, 'PNG', 20, yPosition, 160, 90);
                    console.log("Image added to PDF");
                } else {
                    console.warn('Chart canvas is not available');
                }
            } else {
                console.warn('Chart reference is not valid.');
            }
    
            doc.save("report.pdf");
            setError('');
        } catch (e) {
            setError("Error downloading PDF: " + e.message);
            console.error(e);
        }
    };
    

    return (
        <>
            {click ? (
                <>
                    {error ? (
                        <div style={{ color: 'red' }}>{error}</div>
                    ) : (
                        <>
                            <ShowDocument id={id} generatedReport={generatedReport} chartRef={chartRef} />
                            <button onClick={downloadPDF}>Download PDF</button>
                        </>
                    )}
                </>
            ) : (
                <>
                    <div>
                        <label>
                            Start Date: <input type="date" onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
                        </label>
                        <label>
                            End Date: <input type="date" onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
                        </label>
                    </div>
                    <button onClick={generateCustomerReport}>Generate Report</button>
                    {report.map((item, index) => (
                        <div key={index}>
                            <button
                                className="listItem"
                                onClick={() => {
                                    setId(item.customerId);
                                    HandleClick();
                                }}
                            >
                                {item.serviceRequest}
                            </button>
                        </div>
                    ))}
                </>
            )}
            <hr />
        </>
    );
}

export function ShowDocument({ id, generatedReport, chartRef }) {
    const match = customerInteractions.findIndex((i) => i.customerId === id);
    console.log("find index: " + match);

    if (match >= 0) {
        return (
            <div>
                <>
                    <h4>{customerInteractions[match].status}</h4>
                    {generatedReport && (
                        <>
                            <h4>Generated Report</h4>
                            <p>Total Requests: {generatedReport.totalRequests}</p>
                            <p>Completed Requests: {generatedReport.completedRequests}</p>
                            <p>Average Response Time: {generatedReport.averageResponseTime} hours</p>
                            <p>Customer Retention Rate: {generatedReport.retentionRate}%</p>
                            <h4>Service Categorization:</h4>
                            {Object.keys(generatedReport.servicesCategorized).map((service, index) => (
                                <div key={index}>
                                    <h5>{service}</h5>
                                    <p>Requests: {generatedReport.servicesCategorized[service].count}</p>
                                    <p>Average Satisfaction: {generatedReport.servicesCategorized[service].averageSatisfaction}</p>
                                </div>
                            ))}
                            <ServiceChart generatedReport={generatedReport} chartRef={chartRef} />
                        </>
                    )}
                </>
            </div>
        );
    } else {
        return <p>nothing</p>;
    }
}

function ServiceChart({ generatedReport, chartRef }) {
    const chartData = {
        labels: Object.keys(generatedReport.servicesCategorized),
        datasets: [{
            label: 'Service Requests',
            data: Object.values(generatedReport.servicesCategorized).map(s => s.count),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: true },
            title: { display: true, text: 'Service Requests by Type' }
        }
    };

    return <Bar ref={chartRef} data={chartData} options={chartOptions} />;
}
