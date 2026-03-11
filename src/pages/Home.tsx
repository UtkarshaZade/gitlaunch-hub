import { awsConfig } from '../aws-config';
import { useState, useEffect } from 'react';
import '../App.css';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LiveRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
  stargazers_count: number;
}

interface LiveJob {
  id: string;
  title: string;
  company: string;
  date?: string;
  bullets?: string[];
}

interface PortfolioData {
  projects?: LiveRepo[];
  experience?: LiveJob[];
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const [isDarkMode, setIsDarkMode]       = useState(true);
  const [isMenuOpen, setIsMenuOpen]       = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [_dataLoading, setDataLoading]     = useState(true);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    fetch(`${awsConfig.apiGatewayUrl}/portfolio`)
      .then(res => res.json())
      .then(data => {
        setPortfolioData(data);
        setDataLoading(false);
      })
      .catch(err => {
        console.error('Error fetching portfolio data:', err);
        setDataLoading(false);
      });
  }, []);

  return (
    <div id="portfolio-root" className={isDarkMode ? '' : 'light-mode'}>

      {/* ── HEADER ──────────────────────────────────────────────── */}
      <header>
        <div className="container">
          <nav className="navbar">
            <a className="logo" href="#">Utkarsha Zade</a>
            <ul className={`nav-links${isMenuOpen ? ' active' : ''}`}>
              <li><a href="#about"        onClick={closeMenu}>About</a></li>
              <li><a href="#education"    onClick={closeMenu}>Education</a></li>
              <li><a href="#skills"       onClick={closeMenu}>Skills</a></li>
              <li><a href="#projects"     onClick={closeMenu}>Projects</a></li>
              <li><a href="#experience"   onClick={closeMenu}>Experience</a></li>
              <li><a href="#achievements" onClick={closeMenu}>Achievements</a></li>
              <li><a href="#learning"     onClick={closeMenu}>Current Learning</a></li>
            </ul>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'} />
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <i className="fas fa-bars" />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                Utkarsha <span style={{ color: 'var(--primary)' }}>Zade</span>
              </h1>
              <p>
                Computer Science undergraduate interested in data analysis,
                applied machine learning, and practical problem solving.
                Curious, disciplined, and motivated to learn through hands-on
                work and collaboration.
              </p>
              <div className="contact-info">
                <a href="tel:+917517516165" className="contact-item">
                  <i className="fas fa-phone" />
                  <span>+91 75175 16165</span>
                </a>
                <a href="mailto:zadeutkarsha2@gmail.com" className="contact-item">
                  <i className="fas fa-envelope" />
                  <span>zadeutkarsha2@gmail.com</span>
                </a>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt" />
                  <span>Pune, Maharashtra, India</span>
                </div>
              </div>
              <div className="social-links">
                <a href="https://linkedin.com/in/utkarsha-zade" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-linkedin-in" />
                </a>
                <a href="https://github.com/utkarshazade" target="_blank" rel="noreferrer" className="social-icon">
                  <i className="fab fa-github" />
                </a>
                <a href="mailto:zadeutkarsha2@gmail.com" className="social-icon">
                  <i className="fas fa-envelope" />
                </a>
              </div>
            </div>
            <div className="hero-image-container">
              <img src="/profile.jpeg" alt="Utkarsha Zade" className="profile-photo" />
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ───────────────────────────────────────────────── */}
      <section id="about">
        <div className="container">
          <h2 className="section-title">About Me</h2>
          <div className="about-content">
            <p>
              I'm a Computer Science undergraduate with a passion for data
              analysis, applied machine learning, and practical problem-solving.
              My approach combines curiosity with discipline, and I'm highly
              motivated to learn through hands-on work and collaboration.
            </p>
            <p>
              I believe in the power of technology to solve real-world problems
              and am constantly expanding my skill set through projects,
              internships, and continuous learning. My current focus is on
              strengthening backend development, database concepts, and machine
              learning fundamentals through applied projects.
            </p>
          </div>
        </div>
      </section>

      {/* ── EDUCATION ───────────────────────────────────────────── */}
      <section id="education" style={{ background: 'rgba(96,165,250,0.05)' }}>
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">Expected 2027</div>
              <div className="timeline-content">
                <h3>Bachelor of Technology in Computer Science</h3>
                <p>Pimpri Chinchwad College of Engineering, Pune</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2021 – 2023</div>
              <div className="timeline-content">
                <h3>Higher Secondary Certificate (HSC)</h3>
                <p>Raj Junior College, Yavatmal</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-date">2020 – 2021</div>
              <div className="timeline-content">
                <h3>Secondary School Certificate (SSC)</h3>
                <p>Sanskar English Medium School, Yavatmal</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ──────────────────────────────────────────────── */}
      <section id="skills">
        <div className="container">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-container">
            <div className="skill-category">
              <h3><i className="fas fa-code" /> Programming</h3>
              <ul className="skill-list">
                <li>Python         <span className="skill-level">Intermediate</span></li>
                <li>C++            <span className="skill-level">Intermediate</span></li>
                <li>JavaScript     <span className="skill-level">Intermediate</span></li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><i className="fas fa-globe" /> Web Development</h3>
              <ul className="skill-list">
                <li>HTML5</li><li>CSS3</li><li>JavaScript</li><li>Bootstrap</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><i className="fas fa-database" /> Databases</h3>
              <ul className="skill-list">
                <li>MongoDB</li><li>SQL</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><i className="fas fa-chart-line" /> Data &amp; ML</h3>
              <ul className="skill-list">
                <li>Pandas &amp; NumPy</li><li>Scikit-learn</li>
                <li>Matplotlib</li><li>Power BI</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3><i className="fas fa-tools" /> Tools</h3>
              <ul className="skill-list">
                <li>Git &amp; GitHub</li><li>VS Code</li><li>Jupyter Notebook</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJECTS ─────────────────────────────────────────────
          LOGIC:
          • GitHub repos toggled ON in dashboard → shown at TOP
          • Your 6 hardcoded projects → ALWAYS shown below
      ────────────────────────────────────────────────────────── */}
      <section id="projects" style={{ background: 'rgba(167,139,250,0.05)' }}>
        <div className="container">
          <h2 className="section-title">Projects</h2>

          <div className="projects-container">

            {/* ── DYNAMIC: GitHub repos toggled ON — shown at top ── */}
            {portfolioData?.projects && portfolioData.projects.length > 0 && (
              <>
                {portfolioData.projects.map((repo: LiveRepo) => (
                  <div key={repo.id} className="project-card">
                    <div className="project-image-container" style={{
                      background: 'linear-gradient(135deg,rgba(56,189,248,0.1),rgba(167,139,250,0.1))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160,
                    }}>
                      <div style={{ textAlign: 'center' }}>
                        <i className="fab fa-github" style={{ fontSize: '2.5rem', color: 'var(--primary)', opacity: 0.7 }} />
                        <div style={{ fontSize: '0.65rem', color: '#38bdf8', marginTop: 8, letterSpacing: '0.1em', fontWeight: 600 }}>
                          LIVE FROM GITHUB
                        </div>
                      </div>
                    </div>
                    <div className="project-content">
                      <h3>{repo.name}</h3>
                      <div className="project-tech">
                        <span className="tech-tag">{repo.language || 'Software'}</span>
                      </div>
                      <p className="project-description">
                        {repo.description || 'No description provided.'}
                      </p>
                      <a
                        href={repo.html_url} target="_blank" rel="noreferrer"
                        style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}
                      >
                        View on GitHub →
                      </a>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── STATIC: hardcoded projects — always visible ── */}
            <div className="project-card">
              <div className="project-image-container">
                <img src="/Dashboard1.png" className="project-img" alt="AI DPR Assessment" />
              </div>
              <div className="project-content">
                <h3>AI-Powered DPR Quality Assessment System</h3>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Machine Learning</span>
                  <span className="tech-tag">NLP</span>
                </div>
                <p className="project-description">
                  Designed an AI-based system to assess quality and risk factors of
                  Detailed Project Reports across multiple sectors. Implemented NLP
                  techniques to generate automated summaries and risk indicators.
                </p>
                <p><strong>Event:</strong> Smart India Hackathon (College Level)</p>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image-container">
                <img src="/kisanvikas.jpeg" className="project-img" alt="KisanVikas Platform" />
              </div>
              <div className="project-content">
                <h3>KisanVikas — Farmers' Support Web Platform</h3>
                <div className="project-tech">
                  <span className="tech-tag">HTML</span>
                  <span className="tech-tag">CSS</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">MongoDB</span>
                </div>
                <p className="project-description">
                  Developed a centralized platform providing government scheme
                  information, crop guidance through video tutorials for farmers
                  with multiple language support.
                </p>
                <p><strong>Award:</strong> Copyright for originality and implementation</p>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image-container">
                <img src="/music.jpeg" className="project-img" alt="Music Analysis" />
              </div>
              <div className="project-content">
                <h3>Music Listening Habits and Mental Health Analysis</h3>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Pandas</span>
                  <span className="tech-tag">Matplotlib</span>
                  <span className="tech-tag">Scikit-learn</span>
                </div>
                <p className="project-description">
                  Analyzed a public survey dataset containing demographics, music
                  preferences, and mental health indicators. Applied classification,
                  regression, and clustering algorithms to identify patterns.
                </p>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image-container">
                <img src="/Dashboard1.png" className="project-img" alt="Podcast Analytics" />
              </div>
              <div className="project-content">
                <h3>Podcast Analytics Dashboard</h3>
                <div className="project-tech">
                  <span className="tech-tag">Python</span>
                  <span className="tech-tag">Power BI</span>
                  <span className="tech-tag">Machine Learning</span>
                </div>
                <p className="project-description">
                  Preprocessed podcast engagement data using Python and created
                  interactive Power BI dashboards. Visualized listener trends and
                  performance metrics to support analytical reporting.
                </p>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image-container">
                <img src="/rjgf.png" className="project-img" alt="NGO Website" />
              </div>
              <div className="project-content">
                <h3>RJGF NGO Website Development</h3>
                <div className="project-tech">
                  <span className="tech-tag">HTML</span>
                  <span className="tech-tag">CSS</span>
                  <span className="tech-tag">JavaScript</span>
                  <span className="tech-tag">Bootstrap</span>
                </div>
                <p className="project-description">
                  Designed and developed the official website for RJGF Foundation
                  to showcase initiatives and social impact. Improved content
                  structure and user accessibility for public outreach.
                </p>
              </div>
            </div>

            <div className="project-card">
              <div className="project-image-container" style={{
                background: 'linear-gradient(135deg,rgba(56,189,248,0.15),rgba(167,139,250,0.1))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <i className="fas fa-rocket" style={{ fontSize: '3rem', color: 'var(--primary)', opacity: 0.6 }} />
              </div>
              <div className="project-content">
                <h3>DevSphere — Serverless Innovation Hub</h3>
                <div className="project-tech">
                  <span className="tech-tag">React</span>
                  <span className="tech-tag">AWS Bedrock</span>
                  <span className="tech-tag">Lambda</span>
                  <span className="tech-tag">DynamoDB</span>
                </div>
                <p className="project-description">
                  Open developer discovery platform — AI auto-generates portfolio
                  from GitHub, community feed by category, and personalised
                  "What to Build Next" recommendations.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ──────────────────────────────────────────── */}
      <section id="experience">
        <div className="container">
          <h2 className="section-title">Experience</h2>

          {portfolioData?.experience && portfolioData.experience.length > 0 && (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <span style={{
                fontSize: '0.75rem', padding: '4px 12px', borderRadius: 99,
                background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.25)',
                color: '#38bdf8', letterSpacing: '0.08em', fontWeight: 600,
              }}>
                ● LIVE FROM AWS
              </span>
            </div>
          )}

          <div className="timeline">
            {portfolioData?.experience && portfolioData.experience.length > 0 ? (
              portfolioData.experience.map((job: LiveJob) => (
                <div key={job.id} className="timeline-item">
                  <div className="timeline-date">{job.date || 'Current'}</div>
                  <div className="timeline-content">
                    <h3>{job.title}</h3>
                    <p><strong>{job.company}</strong></p>
                    {job.bullets && job.bullets.length > 0 && (
                      <ul>{job.bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="timeline-item">
                  <div className="timeline-date">Dec 2025 – Jan 2026</div>
                  <div className="timeline-content">
                    <h3>Market and Data Analyst Intern</h3>
                    <p><strong>Raymond Ltd.</strong></p>
                    <ul>
                      <li>Conducted customer satisfaction study for Raymond's fashion wear using structured questionnaires and surveys.</li>
                      <li>Collected and analyzed primary data from approximately 100 respondents.</li>
                      <li>Performed data interpretation using charts and summary statistics.</li>
                      <li>Prepared analytical findings, conclusions, and business recommendations.</li>
                    </ul>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-date">Jun 2025 – Aug 2025</div>
                  <div className="timeline-content">
                    <h3>Web Development Intern</h3>
                    <p><strong>RJGF Foundation</strong></p>
                    <ul>
                      <li>Developed and integrated 5+ content sections to present NGO initiatives.</li>
                      <li>Used HTML and CSS with focus on responsiveness and accessibility.</li>
                      <li>Collaborated in a team of four to design and deploy the official website.</li>
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── ACHIEVEMENTS ────────────────────────────────────────── */}
      <section id="achievements" style={{ background: 'rgba(14,165,233,0.05)' }}>
        <div className="container">
          <h2 className="section-title">Achievements &amp; Activities</h2>
          <div className="cards-container">
            <div className="card">
              <h3><i className="fas fa-trophy" /> Achievements</h3>
              <ul>
                <li>Community Engagement Project (KisanVikas) awarded copyright for originality.</li>
                <li>Selected for Smart India Hackathon (SIH) for AI-based DPR evaluation solution.</li>
                <li>Advanced to Round 2 of Indradhanush International Hackathon.</li>
                <li>Two short stories accepted for publication in college-published book.</li>
              </ul>
            </div>
            <div className="card">
              <h3><i className="fas fa-users" /> Extracurricular &amp; Leadership</h3>
              <ul>
                <li>Coordinator and Registration Head for national-level Baby Conference.</li>
                <li>Co-Secretary of ACM-W Student Chapter.</li>
                <li>Contributed to organisation of technical events and workshops.</li>
              </ul>
            </div>
            <div className="card">
              <h3><i className="fas fa-certificate" /> Certifications</h3>
              <ul>
                <li>AWS Cloud Practitioner — in progress.</li>
                <li>Python for Data Analysis — NPTEL.</li>
              </ul>
            </div>
            <div className="card">
              <h3><i className="fas fa-bullseye" /> Current Focus</h3>
              <ul>
                <li>Strengthening backend development and database concepts using Python.</li>
                <li>Practicing machine learning fundamentals through applied datasets.</li>
                <li>Working on a Women Empowerment Web Platform focused on career guidance.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── CURRENT LEARNING ────────────────────────────────────── */}
      <section id="learning">
        <div className="container">
          <h2 className="section-title">Current Learning &amp; Work</h2>
          <div className="learning-container">
            <div className="learning-item">
              <div className="learning-icon"><i className="fas fa-server" /></div>
              <div>
                <h3>Backend Development</h3>
                <p>Strengthening backend development and database concepts using Python, focusing on building scalable applications.</p>
              </div>
            </div>
            <div className="learning-item">
              <div className="learning-icon"><i className="fas fa-brain" /></div>
              <div>
                <h3>Machine Learning Fundamentals</h3>
                <p>Practicing machine learning fundamentals through applied datasets and mini-projects to solve real-world problems.</p>
              </div>
            </div>
            <div className="learning-item">
              <div className="learning-icon"><i className="fas fa-female" /></div>
              <div>
                <h3>Women Empowerment Platform</h3>
                <p>Currently working on a Women Empowerment Web Platform focused on career guidance, mentorship, and skill development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <p>Let's connect and discuss opportunities in data analysis, machine learning, and web development!</p>
            <div className="footer-links">
              <a href="mailto:zadeutkarsha2@gmail.com">Email</a>
              <a href="https://linkedin.com/in/utkarsha-zade" target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="https://github.com/utkarshazade" target="_blank" rel="noreferrer">GitHub</a>
              <a href="/admin" style={{ color: 'var(--primary)', fontWeight: 600 }}>Admin Dashboard</a>
            </div>
            <p className="copyright">© 2026 Utkarsha Zade. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}