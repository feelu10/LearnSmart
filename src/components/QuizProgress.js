import React from 'react';
import './QuizProgress.css';

const QuizProgress = () => {
  const data = [
    { value: 32, height: 120, label: 'Class A' },
    { value: 23, height: 90, label: 'Class B' },
    { value: 45, height: 160, label: 'Class C' },
    { value: 20, height: 80, label: 'Class D' },
    { value: 55, height: 200, label: 'Class E' }
  ];

  return (
    <div className="quiz-progress-container">
      <div className="quiz-progress-header">
        <h2>Quiz Progress Summary</h2>
        <div className="controls">
          <button className="nav-button prev">‹</button>
          <span className="date">Aug 2025</span>
          <button className="nav-button next">›</button>
          <div className="avg-indicator">
            <span className="dot"></span>
            <span>Avg no.</span>
          </div>
        </div>
      </div>

      <div className="chart">
        {/* Y-axis labels */}
        <div className="y-axis">
          {['60%', '50%', '40%', '30%', '20%', '10%'].map((label, i) => (
            <span key={i} className="y-label">{label}</span>
          ))}
        </div>

        {/* Grid lines */}
        <div className="grid-lines">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="grid-line"></div>
          ))}
        </div>

        {/* Bars */}
        <div className="bars">
          {data.map((item, index) => (
            <div key={index} className="bar-group">
              <div 
                className="bar"
                style={{ height: `${item.height}px` }}
              ></div>
              <span className="label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Trend line */}
        <svg className="trend-line" viewBox="0 0 400 200" preserveAspectRatio="none">
          <path
            d="M0,180 C100,140 200,120 300,160 S400,120 500,80"
            stroke="#373A3D"
            strokeWidth="2"
            fill="none"
          />
        </svg>

        {/* Average point with tooltip */}
        <div className="avg-point-container">
          <div className="tooltip">
            <span>Avg</span>
            <span>Point</span>
          </div>
          <div className="point"></div>
        </div>
      </div>
    </div>
  );
};

export default QuizProgress; 