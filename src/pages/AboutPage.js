// src/pages/AboutPage.js
import DebugDefender from '../components/DebugDefender';

const AboutPage = () => {
  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      <section style={{ marginBottom: '3rem' }}>
        <h2>About the Platform</h2>
        <p style={{ maxWidth: '760px', lineHeight: '1.8', color: 'var(--muted)', margin: '0 auto' }}>
          This platform is designed to highlight modern full-stack web development in action. It blends polished visuals with real interaction, secure authentication, and a powerful AI writing assistant so users can explore, publish, and engage with confidence.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--muted)' }}>
            <h3>Interactive Particle Background</h3>
            <p style={{ color: 'var(--muted)' }}>A dynamic animated hero section adds motion and energy to the landing experience without sacrificing speed or clarity.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--muted)' }}>
            <h3>Reactions & Comments Engine</h3>
            <p style={{ color: 'var(--muted)' }}>Users can like posts, share reactions, and leave comments in a fluid social feed that encourages engagement.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--muted)' }}>
            <h3>Secure OTP Authentication</h3>
            <p style={{ color: 'var(--muted)' }}>The sign-in system uses OTP security to protect accounts and build trust for every user.</p>
          </div>
          <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--muted)' }}>
            <h3>Magic Polish Writing Assistant</h3>
            <p style={{ color: 'var(--muted)' }}>A custom AI feature helps users refine their writing instantly, making post creation faster and more polished.</p>
          </div>
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2>Mini-Project: Debug Defender</h2>
        <p style={{ maxWidth: '760px', lineHeight: '1.75', color: 'var(--muted)', margin: '0 auto' }}>
          DebugDefender is an interactive project built with HTML5 Canvas and JavaScript, showing how I structure reusable components and practice game logic alongside the main portfolio.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <DebugDefender />
        </div>
      </section>

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
            <img src="/assets/project.jpg" alt="Developer working on a laptop" />
          </div>
        </div>

        <div className="mt-2">
          <h3>My Journey (Timeline)</h3>
          <p>My path to becoming a Computer Science student:</p>
          <ol>
            <li><strong>2017:</strong> Graduated Elementary School.</li>
            <li><strong>2023:</strong> I started taking interest about computers. Then I Graduated High School as an ICT student.</li>
            <li><strong>2023:</strong> Enrolled in BS Computer Science at University.</li>
            <li><strong>2026:</strong> Creating my first Web Portfolio.</li>
          </ol>
        </div>

        <div className="mt-2">
          <img src="/assets/codingproject.jpg" alt="Screenshot of HTML/CSS code and layout" className="img-cover" />
        </div>
        <h3>How I Learn</h3>
        <p>I learn by following tutorials, reading class materials, and trying to replicate simple website layouts. I use resources like W3Schools to look up tags I don't remember.</p>
        <p>I treat every error as a lesson, and I try to organize my code better with every new assignment.</p>
      </section>
    </main>
  );
};

export default AboutPage;