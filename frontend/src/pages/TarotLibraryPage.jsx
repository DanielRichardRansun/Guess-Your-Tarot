import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { GiCardRandom } from "react-icons/gi";
import api from "../api";
import "./TarotLibraryPage.css";

export default function TarotLibraryPage() {
  const [tarots, setTarots] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedTarot, setSelectedTarot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTarots();
  }, []);

  const fetchTarots = async () => {
    try {
      const res = await api.get("/tarots");
      setTarots(res.data);
    } catch (err) {
      console.error("Failed to load tarots", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: "all", label: "All Cards" },
    { key: "major", label: "Major Arcana" },
    { key: "wands", label: "Wands" },
    { key: "cups", label: "Cups" },
    { key: "swords", label: "Swords" },
    { key: "pentacles", label: "Pentacles" },
  ];

  const filteredTarots = tarots.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || t.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="library">
      <div className="container">
        <div className="library__header">
          <GiCardRandom className="library__header-icon" />
          <h1>Tarot Library</h1>
          <p>Explore all 78 tarot cards and their mystical meanings</p>
        </div>

        <div className="library__filters">
          <div className="library__search">
            <FiSearch className="library__search-icon" />
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="library__search-input"
            />
          </div>
          <div className="library__categories">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`btn btn--sm ${category === cat.key ? "btn--primary" : "btn--ghost"}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="library__grid">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "280px", borderRadius: "12px" }}
              ></div>
            ))}
          </div>
        ) : (
          <>
            <p className="library__count">{filteredTarots.length} cards</p>
            <div className="library__grid">
              {filteredTarots.map((tarot, i) => (
                <div
                  key={tarot.id}
                  className="library__card card"
                  style={{ animationDelay: `${Math.min(i * 0.05, 0.5)}s` }}
                  onClick={() => setSelectedTarot(tarot)}
                >
                  <div className="library__card-img-wrapper">
                    <img
                      src={`/images/tarot/${tarot.image}`}
                      alt={tarot.name}
                      className="library__card-img"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="library__card-name">{tarot.name}</h3>
                  <span className="library__card-num">#{tarot.number}</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Modal */}
        {selectedTarot && (
          <div
            className="library__modal"
            onClick={() => setSelectedTarot(null)}
          >
            <div
              className="library__modal-content card"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="library__modal-close"
                onClick={() => setSelectedTarot(null)}
              >
                &times;
              </button>
              <div className="library__modal-body">
                <img
                  src={`/images/tarot/${selectedTarot.image}`}
                  alt={selectedTarot.name}
                  className="library__modal-img"
                />
                <div className="library__modal-info">
                  <span className="library__modal-num">
                    #{selectedTarot.number} • {selectedTarot.category}
                  </span>
                  <h2>{selectedTarot.name}</h2>
                  {selectedTarot.keywords && (
                    <div className="library__modal-keywords">
                      {selectedTarot.keywords.split(",").map((kw, i) => (
                        <span key={i} className="library__modal-keyword">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="library__modal-short">
                    {selectedTarot.short_description}
                  </p>
                  <p className="library__modal-long">
                    {selectedTarot.long_description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
