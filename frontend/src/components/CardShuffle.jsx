import "./CardShuffle.css";

export default function CardShuffle({ message = "Reading the stars..." }) {
  const cards = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="shuffle-overlay">
      <div className="shuffle-container">
        <div className="shuffle-cards">
          {cards.map((i) => (
            <div
              key={i}
              className="shuffle-card"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="shuffle-card__inner">
                <div className="shuffle-card__back">
                  <div className="shuffle-card__pattern">✦</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="shuffle-text">
          <div className="shuffle-spinner"></div>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
