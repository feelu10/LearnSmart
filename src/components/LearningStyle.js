import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './LearningStyle.css';

const LearningStyle = () => {
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form reload
    navigate('/vark-results'); // Navigate to VarkResults page
  };

  return (
    <div className="vark-container">
      <div className="vark-left">
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

      <div className="vark-right">
        <form className="vark-form" onSubmit={handleSubmit}>
          <p className="instructions">
            Choose the answer which best explains your preference and click the box next to it.
            Please click more than one if a single answer does not match your perception.
            Leave blank any question that does not apply.
          </p>

          {[
            {
              q: "I want to learn how to play a new board game or card game. I would:",
              options: [
                "listen to somebody explaining it and ask questions.",
                "watch others play the game before joining in.",
                "use the diagrams that explain the various stages, moves and strategies in the game.",
                "read the instructions."
              ]
            },
            {
              q: "When learning from the internet I like:",
              options: [
                "audio channels where I can listen to podcasts or interviews.",
                "interesting written descriptions, lists and explanations.",
                "videos showing how to do or make things.",
                "interesting design and visual features."
              ]
            },
            {
              q: "I want to learn to do something new on a computer. I would:",
              options: [
                "talk with people who know about the program.",
                "start using it and learn by trial and error.",
                "follow the diagrams in a manual or online.",
                "read the written instructions that came with the program."
              ]
            },
            {
              q: "After reading a play, I need to do a project. I would prefer to:",
              options: [
                "write about the play.",
                "read a speech from the play.",
                "draw or sketch a scene from the play.",
                "act out a scene from the play."
              ]
            },
            {
              q: "When choosing my subjects to study, these are important for me:",
              options: [
                "Working with designs, maps or charts.",
                "Using words well in written communications.",
                "Communicating with others through discussion.",
                "Applying my knowledge in real situations."
              ]
            },
            {
              q: "I prefer a presenter or a teacher who uses:",
              options: [
                "diagrams, charts, maps or graphs.",
                "question and answer, talk, group discussion, or guest speakers.",
                "handouts, books, or readings.",
                "demonstrations, models or practical sessions."
              ]
            },
            {
              q: "I want to find out more about a tour that I am going on. I would:",
              options: [
                "watch videos to see if there are things I like.",
                "read about the tour on the itinerary.",
                "use a map and see where the places are.",
                "talk with the person who planned the tour or others who are going on the tour."
              ]
            },
            {
              q: "When I am learning I:",
              options: [
                "read books, articles and handouts.",
                "see patterns in things.",
                "like to talk things through.",
                "use examples and applications."
              ]
            }
          ].map((item, i) => (
            <div key={i} className="question-block">
              <p>{item.q}</p>
              {item.options.map((opt, j) => (
                <label key={j}>
                  <input type="checkbox" name={`q${i}`} />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <div className="submit-container">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LearningStyle;
