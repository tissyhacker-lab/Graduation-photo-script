import { useEffect, useState } from 'react';
import Hero from './components/Hero.jsx';
import Concept from './components/Concept.jsx';
import Timeline from './components/Timeline.jsx';
import ShotCard from './components/ShotCard.jsx';
import Moodboard from './components/Moodboard.jsx';
import Checklist from './components/Checklist.jsx';
import ImageLightbox from './components/ImageLightbox.jsx';
import { project, concept, timeline, shots, moodboard, checklist } from './data/shots.js';

function App() {
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (!previewImage) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setPreviewImage(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [previewImage]);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <Hero project={project} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-5 pb-20 pt-12 sm:px-8 lg:px-10 lg:pb-28">
        <Concept concept={concept} />
        <Timeline timeline={timeline} />
        <section aria-labelledby="shot-list-title">
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker">Shooting Location</p>
              <h2 id="shot-list-title" className="section-title">拍摄点位</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted">
              每张卡片对应一个拍摄点位，方便现场按地点、参考图、动作、构图和道具快速核对。
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            {shots.map((shot) => (
              <ShotCard key={shot.id} shot={shot} onImageOpen={setPreviewImage} />
            ))}
          </div>
        </section>
        <Moodboard items={moodboard} onImageOpen={setPreviewImage} />
        <Checklist checklist={checklist} />
      </div>
      <ImageLightbox image={previewImage} onClose={() => setPreviewImage(null)} />
    </main>
  );
}

export default App;
