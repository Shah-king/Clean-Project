import "../styles/HomePage.css";
import { Link } from "react-router-dom";
function HomePage() {
  return (
    <div className="page">
      <section className="home-section1">
        <h1 className="title">Keep Our Campus Clean and Safe</h1>
        <h2 className="subtitle">Report maintenance and cleaning issues with just a few clicks</h2>
        <Link to="/create"> <button className="button">Report an Issue</button></Link>
       
      </section>

      <section className="home-section2">
        <h3 className="title23">How It Works</h3>
        <div className="home-cards-container">
          <div className="home-cards">
            <img src="/avatar.svg" alt="avatar icon" />
            <h3 className="title2">Login</h3>
            <p className="texts">Choose your role as student or professor</p>
          </div>
          <div className="home-cards">
            <img src="/report.svg" alt="report icon" />
            <h3 className="title2">Report an Issue</h3>
            <p className="home-texts">Describe the problem, upload media, and mark location</p>
          </div>
          <div className="home-cards">
            <img src="/clean.svg" alt="cleaning icon" />
            <h3 className="title2">Staff Fix It</h3>
            <p className="home-texts">Janitors or staff resolve it quickly</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
