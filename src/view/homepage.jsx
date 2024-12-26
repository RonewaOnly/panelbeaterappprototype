import React, { useState } from "react";
import './style.css';
import Inbox from "./Inbox";
import MessageInbox from "../model/MessageInbox";
import Report from "./reports";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
export default function Homepage() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  return (
    <div className="homepage">
      <header>
        <h2>Welcome to we panel beaters</h2>
        <p>We connect all of them to you with a simple click</p>
      </header>
      <div className="Main">
        <div>
        <div className="showcharts">
          <h4>It will be displaying charts of users that searched them</h4>
          <MyChart />
        </div>
        </div>
        <>
        {!selectedMessage ? (
          <div>
            <h4>Messages</h4>
            <Inbox onMessageSelect={handleSelectMessage} />
          </div>
        ) : (
          <div>
            <h4>Chat with {selectedMessage.sender}</h4>
            <MessageInbox selectedMessage={selectedMessage} />
          </div>
        )}
        </>
        <div>
          <h4>Report Summary</h4>
          <Report />
        </div>
        <div>
          <h4>Package</h4>
          <p>we are working on it</p>
        </div>
      </div>
    </div>
  );
}

const MyChart = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart.js Bar Chart',
      },
    },
  };

  return <Bar data={data} options={options} />;
};
