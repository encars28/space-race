import './HomePage.css';

interface HomePageProps {
  onStart: () => void;
}

export default function HomePage({ onStart }: HomePageProps) {
  return (
    <div className="home-page">
      <div className="home-content">
        <h1 className="home-title">Carrera espacial</h1>
        <p className="home-subtitle">1957-1975</p>
        <button className="start-button" onClick={onStart}>
          Empezar
        </button>
      </div>
    </div>
  );
}
