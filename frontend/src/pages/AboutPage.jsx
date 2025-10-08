import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <div className="page">
      <section>
        <h1 className="title">About ProjectClean</h1>
      </section>

      <section className="about-context">
        <h2 className="title2">What is ProjectClean</h2>
        <p className="texts">ProjectClean is a student-developed web application that helps students and professors quickly report issues they notice on campus — from messy bathrooms to broken lights. Our goal is to make our school cleaner, safer, and more efficient for everyone.</p>
      </section>

      <section className="about-context">
        <h2 className="title2">Why We Built It</h2>
        <p className="texts">We noticed that small issues like spills, damaged equipment, or overflowing trash often go unreported simply because there’s no fast and easy way to report them. ProjectClean solves this by making it simple for anyone to:</p>
        <ul className="about-ul">
          <li>Log in with their school identity</li>
          <li>Submit a report with a message, photo, and location</li>
          <li>Automatically notify the right staff (janitor or maintenance)</li>
        </ul>
      </section>

      <section className="about-context">
        <h2 className="title2">Our Mission</h2>
        <p className="texts">To empower our campus community to take part in keeping shared spaces clean and functional — through fast, transparent, and actionable reporting.</p>
      </section>

      <section className="about-two-column">
        <section className="about-two-column-context">
          <h2 className="title2">Meet the Team</h2>
          <ul className="hide-disc">
            <li>Yi Li – Frontend Developer & Figma Designer.</li>
            <li>Albert – Backend API & Database Integration, Firebase Authentication, React developer.</li>
            <li>Frankie – Frontend</li>
            <li>Shahriar – Frontend</li>
          </ul>
        </section>

        <section className="about-two-column-context">
          <h2 className="title2">Technologies We Use</h2>
          <ul className="hide-disc">
            <li>Frontend: HTML, CSS, Tailwindcss, JavaScript, React</li>
            <li>Backend: Node.js, Express</li>
            <li>Database: Mongodb</li>
            <li>Authentication: Firebase</li>
            <li>Version Control: Git & GitHub</li>
          </ul>
        </section>
      </section>
    </div>
  );
}

export default AboutPage;
