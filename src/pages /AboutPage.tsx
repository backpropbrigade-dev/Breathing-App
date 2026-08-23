import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBreathingStore } from '../store/breathingStore';

const ABOUT_STYLES = {
  container: "min-h-screen relative overflow-y-auto",
  content: "relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-8",
  header: "mb-6 text-center relative",
  title: "text-xl md:text-2xl font-bold mb-2",
  subtitle: "text-xs md:text-sm opacity-80",
  backButton: "fixed top-4 md:top-6 left-4 md:left-6 px-3 md:px-4 py-1.5 md:py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 backdrop-blur-lg cursor-pointer z-50",
  section: "mb-6",
  sectionTitle: "text-base md:text-lg font-semibold mb-3",
  card: "p-3 md:p-4 rounded-xl backdrop-blur-lg transition-all duration-300 mb-4",
  patternGrid: "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4",
  patternCard: "p-3 md:p-4 rounded-xl backdrop-blur-lg transition-all duration-300",
  patternName: "text-sm md:text-base font-semibold mb-2",
  patternTiming: "text-xs md:text-sm opacity-80 mb-2",
  patternDescription: "text-xs md:text-sm mb-2",
  scienceSection: "text-xs md:text-sm mb-2",
  colorSection: "text-xs md:text-sm",
  colorBox: "w-3 h-3 md:w-4 md:h-4 rounded-full inline-block mr-2 align-middle",
  gridContainer: "grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4",
  infoCard: "p-3 md:p-4 rounded-xl backdrop-blur-lg transition-all duration-300",
  infoTitle: "text-xs md:text-sm font-semibold mb-2",
  infoContent: "text-xs md:text-sm leading-relaxed",
  patternHeader: "flex items-center justify-between mb-2",
  patternStats: "text-xs md:text-sm opacity-80",
  patternContent: "space-y-1.5 md:space-y-2"
} as const;

const BREATHING_PATTERNS = [
  {
    name: 'Calm',
    inhale: 4,
    hold: 4,
    exhale: 6,
    color: '#3b82f6', // Blue
    description: 'Perfect for relaxation and stress relief',
    science: 'The 4-4-6 pattern activates the parasympathetic nervous system, reducing heart rate and blood pressure. The longer exhale (6 seconds) helps release tension and promotes relaxation.',
    colorPsychology: 'Blue is associated with calmness, peace, and tranquility. It has been shown to lower blood pressure and heart rate, making it perfect for relaxation exercises.'
  },
  {
    name: 'Focus',
    inhale: 4,
    hold: 7,
    exhale: 8,
    color: '#10b981', // Green
    description: 'Enhances concentration and mental clarity',
    science: 'The extended hold (7 seconds) increases oxygen levels in the brain, while the longer exhale (8 seconds) helps clear CO2. This pattern improves focus by optimizing brain oxygenation.',
    colorPsychology: 'Green represents growth, harmony, and balance. It\'s known to improve focus and concentration while reducing eye strain, making it ideal for mental clarity exercises.'
  },
  {
    name: 'Balance',
    inhale: 4,
    hold: 4,
    exhale: 4,
    color: '#8b5cf6', // Purple
    description: 'Promotes emotional balance and stability',
    science: 'The equal 4-4-4 ratio creates a balanced breathing rhythm that helps regulate the autonomic nervous system. This pattern is particularly effective for emotional regulation.',
    colorPsychology: 'Purple combines the calm of blue and the energy of red. It\'s associated with wisdom, creativity, and emotional balance, making it perfect for equilibrium exercises.'
  },
  {
    name: 'Deep',
    inhale: 6,
    hold: 2,
    exhale: 7,
    color: '#f59e0b', // Amber
    description: 'Deep breathing for energy and vitality',
    science: 'The longer inhale (6 seconds) maximizes oxygen intake, while the shorter hold (2 seconds) maintains energy levels. The extended exhale (7 seconds) helps release tension.',
    colorPsychology: 'Amber represents energy, warmth, and vitality. It\'s associated with increased energy levels and motivation, making it ideal for energizing breathing exercises.'
  }
];

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useBreathingStore();

  return (
    <div 
      className={ABOUT_STYLES.container}
      style={{ background: theme.background }}
    >
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#00000020] to-transparent z-40" />
      
      <button
        onClick={() => navigate('/')}
        className={ABOUT_STYLES.backButton}
        style={{ 
          background: `${theme.primary}40`,
          border: `1px solid ${theme.primary}40`,
          boxShadow: `0 4px 14px ${theme.primary}40`,
          color: theme.primary
        }}
      >
        ← Back
      </button>

      <div className={ABOUT_STYLES.content}>
        <div className={ABOUT_STYLES.header}>
          <h1 className={ABOUT_STYLES.title} style={{ color: theme.primary }}>
            The Science of Breathing
          </h1>
          <p className={ABOUT_STYLES.subtitle} style={{ color: theme.primary }}>
            Understanding the patterns and their effects
          </p>
        </div>

        <div className={ABOUT_STYLES.section}>
          <h2 className={ABOUT_STYLES.sectionTitle} style={{ color: theme.primary }}>
            Breathing Patterns
          </h2>
          <div className={ABOUT_STYLES.patternGrid}>
            {BREATHING_PATTERNS.map((pattern) => (
              <div 
                key={pattern.name}
                className={ABOUT_STYLES.patternCard}
                style={{ 
                  background: `${theme.primary}20`,
                  border: `2px solid ${theme.primary}40`,
                  boxShadow: `0 4px 14px ${theme.primary}40`
                }}
              >
                <div className={ABOUT_STYLES.patternHeader}>
                  <div className="flex items-center">
                    <div 
                      className={ABOUT_STYLES.colorBox}
                      style={{ background: pattern.color }}
                    />
                    <h3 className={ABOUT_STYLES.patternName} style={{ color: theme.primary }}>
                      {pattern.name}
                    </h3>
                  </div>
                  <div className={ABOUT_STYLES.patternStats} style={{ color: theme.primary }}>
                    {pattern.inhale}-{pattern.hold}-{pattern.exhale}
                  </div>
                </div>
                <div className={ABOUT_STYLES.patternContent}>
                  <p className={ABOUT_STYLES.patternDescription} style={{ color: theme.primary }}>
                    {pattern.description}
                  </p>
                  <div className={ABOUT_STYLES.scienceSection} style={{ color: theme.primary }}>
                    <strong>Science:</strong> {pattern.science}
                  </div>
                  <div className={ABOUT_STYLES.colorSection} style={{ color: theme.primary }}>
                    <strong>Color:</strong> {pattern.colorPsychology}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={ABOUT_STYLES.gridContainer}>
          <div className={ABOUT_STYLES.section}>
            <h2 className={ABOUT_STYLES.sectionTitle} style={{ color: theme.primary }}>
              The Science Behind Breathing
            </h2>
            <div 
              className={ABOUT_STYLES.infoCard}
              style={{ 
                background: `${theme.primary}20`,
                border: `2px solid ${theme.primary}40`,
                boxShadow: `0 4px 14px ${theme.primary}40`
              }}
            >
              <p className={ABOUT_STYLES.infoContent} style={{ color: theme.primary }}>
                Breathing exercises affect our autonomic nervous system, controlling involuntary bodily functions. 
                Different patterns trigger either the sympathetic (fight-or-flight) or parasympathetic (rest-and-digest) response.
              </p>
              <div className="mt-1.5">
                <h3 className={ABOUT_STYLES.infoTitle} style={{ color: theme.primary }}>Key Effects:</h3>
                <ul className="list-disc list-inside text-xs md:text-sm leading-relaxed" style={{ color: theme.primary }}>
                  <li>Heart rate variability</li>
                  <li>Blood pressure</li>
                  <li>Oxygen levels</li>
                  <li>Stress hormones</li>
                  <li>Mental clarity</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={ABOUT_STYLES.section}>
            <h2 className={ABOUT_STYLES.sectionTitle} style={{ color: theme.primary }}>
              Color Psychology
            </h2>
            <div 
              className={ABOUT_STYLES.infoCard}
              style={{ 
                background: `${theme.primary}20`,
                border: `2px solid ${theme.primary}40`,
                boxShadow: `0 4px 14px ${theme.primary}40`
              }}
            >
              <p className={ABOUT_STYLES.infoContent} style={{ color: theme.primary }}>
                Colors have a profound impact on our psychological and physiological responses. 
                Each pattern's color enhances its intended effect:
              </p>
              <div className="mt-1.5">
                <ul className="list-disc list-inside text-xs md:text-sm leading-relaxed" style={{ color: theme.primary }}>
                  <li>Blue (Calm): Reduces stress</li>
                  <li>Green (Focus): Enhances concentration</li>
                  <li>Purple (Balance): Promotes stability</li>
                  <li>Amber (Deep): Increases energy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
