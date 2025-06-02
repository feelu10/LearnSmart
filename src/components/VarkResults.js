import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VarkResults.css';

const VarkResults = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="results-container">
      <div className="results-left">
        <h2>Discover Your <span className="highlight">Learning Style!</span></h2>
        <p>
          The VARK questionnaire helps you understand how you learn best—whether through Visual, Auditory,
          Reading/Writing, or Kinesthetic methods.
        </p>
        <p>
          By identifying your preferred learning style, you can enhance your study techniques, improve retention,
          and make learning more effective. Answer the questions on the right to gain insights into your unique
          learning preferences!
        </p>
      </div>

      <div className="results-right">
        <h3>Your Results</h3>

        <div className="result-box">
          <label>Learning Style:</label>
          <div className="box-content"></div>
        </div>

        <p className="description">
          This learning style is Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore
        </p>

        <div className="result-box">
          <label>Learning Techniques:</label>
          <div className="box-content"></div>
        </div>

        <div className="button-container">
          <button onClick={handleContinue}>Click to continue</button>
        </div>
      </div>
    </div>
  );
};

export default VarkResults;
