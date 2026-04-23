// src/pages/AboutPage.js
import DebugDefender from '../components/DebugDefender';

const AboutPage = () => {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <section>
        <h2>About Me & My Topic</h2>
        
        <div className="two-column">
          <div className="flex-1">
            <h3>What I Love About Programming</h3>
            <p>I chose this field because I am curious about how the internet works. Right now, I am in the learning phase-figuring out how to position elements on a page and make them look good.</p>
            <p>It can be challenging when the code doesn't work as expected, but I enjoy the feeling of finally fixing an error and seeing the webpage display correctly.</p>
            <p>My goal is to keep practicing until I can build complex websites from scratch, Hahahahaha:{'>'}</p>
            <blockquote>
              "Programming isn't about what you know; it's about what you can figure out." - Chris Pine
            </blockquote>
          </div>
          <div className="flex-1">
            <img src="/assets/ongoingproject.png" alt="Developer working on a laptop" />
          </div>
        </div>

        <div className="mt-2">
          <h3>My Journey (Timeline)</h3>
          <p>My path to becoming a Computer Science student:</p>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
            <ol>
              <li><strong>2017:</strong> Graduated Elementary School.</li>
              <li><strong>2023:</strong> I started taking interest about computers. Then I Graduated High School as an ICT student.</li>
              <li><strong>2023:</strong> Enrolled in BS Computer Science at University.</li>
              <li><strong>2026:</strong> Creating my first Web Portfolio.</li>
            </ol>
          </div>
        </div>

        <section style={{ marginBottom: '3rem' }}>
          <h2>Mini-Project: Debug Defender</h2>
          <p style={{ maxWidth: '760px', lineHeight: '1.75', color: 'var(--muted)', margin: '0 auto' }}>
            DebugDefender is an interactive project built with HTML5 Canvas and JavaScript, showing how I structure reusable components and practice game logic alongside the main portfolio.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <DebugDefender />
          </div>
        </section>

        <div className="mt-2">
          <img src="/assets/codinginschool.png" alt="Screenshot of HTML/CSS code and layout" className="img-cover" />
        </div>
        <h3>How I Learn</h3>
        <p>I learn by following tutorials, reading class materials, and trying to replicate simple website layouts. I use resources like W3Schools to look up tags I don't remember.</p>
        <p>I treat every error as a lesson, and I try to organize my code better with every new assignment.</p>
      </section>
    </main>
  );
};

export default AboutPage;