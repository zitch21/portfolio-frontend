// src/pages/AboutPage.js
import DebugDefender from '../components/DebugDefender';

const AboutPage = () => {
  return (
    <main className="container" style={{ marginTop: '2rem' }}>
      <section style={{ marginBottom: '3rem' }}>
        <h2>About the Platform</h2>
        <p style={{ maxWidth: '760px', lineHeight: '1.8', color: 'var(--muted)' }}>
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
        <p style={{ maxWidth: '760px', lineHeight: '1.75', color: 'var(--muted)' }}>
          DebugDefender is an interactive project built with HTML5 Canvas and JavaScript, showing how I structure reusable components and practice game logic alongside the main portfolio.
        </p>
        <div style={{ marginTop: '1.5rem' }}>
          <DebugDefender />
        </div>
      </section>

      <section>
        <h2>About Me</h2>
        <div style={{ background: 'rgba(96, 165, 250, 0.05)', padding: '1.75rem', borderRadius: '12px', border: '1px dashed var(--muted)' }}>
          <p style={{ color: 'var(--muted)', lineHeight: '1.75' }}>
            This space is reserved for the full-stack developer behind the platform. Share your background, passions, and what drives you to build elegant web experiences.
          </p>
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--muted)' }}>
            (Add your personal introduction here — your story, your technical strengths, and what you want visitors to remember.)
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;