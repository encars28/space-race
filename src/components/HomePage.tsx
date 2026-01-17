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
        <p className="home-description">La carrera espacial fue una pugna entre Estados Unidos y la Unión Soviética por la conquista del espacio. Constituyó uno de los ejes principales de rivalidad cultural y tecnológica entre la URSS y los Estados Unidos durante la Guerra Fría</p>
        <button className="start-button" onClick={onStart}>
          Empezar
        </button>
      </div>
    </div>
  );
}
