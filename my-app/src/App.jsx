
import { useEffect, useMemo, useState } from "react";
import { fetchAllCourses, SUBJECTS } from "./api";
import "./App.css";

function App() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        setError("");

        const data = await fetchAllCourses("2026", "fall");
        setCourses(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.toLowerCase().trim();

    return courses.filter((course) => {
      const matchesSubject =
        subject === "ALL" || course.subject === subject;

      const matchesSearch =
        !query ||
        course.code.toLowerCase().includes(query) ||
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      return matchesSubject && matchesSearch;
    });
  }, [courses, search, subject]);

  return (
    <main className="coursecraft">
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">C</span>
          <span>CourseCraft</span>
        </div>

        <span className="term-label">UIUC · Fall 2026</span>
      </header>

      <section className="page-heading">
        <p className="eyebrow">UNIVERSITY OF ILLINOIS</p>
        <h1>Course Explorer</h1>
        <p className="subtitle">
          Find courses and start building your academic plan.
        </p>
      </section>

      <section className="search-section">
        <input
          type="text"
          placeholder="Search by course code, title, or keyword..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
        >
          <option value="ALL">All departments</option>
          {SUBJECTS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </section>

      <div className="results-heading">
        <h2>Available Courses</h2>
        {!loading && !error && (
          <span>{filteredCourses.length} courses found</span>
        )}
      </div>

      {loading && (
        <p className="status-message">Loading courses from UIUC...</p>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filteredCourses.length === 0 && (
        <p className="status-message">
          No courses match your search.
        </p>
      )}

      <section className="course-grid">
        {filteredCourses.map((course) => (
          <article className="course-card" key={course.id}>
            <div className="course-card-top">
              <span className="course-code">{course.code}</span>
              <span className="credit-hours">
                {course.creditHours
                  ? `${course.creditHours} credits`
                  : "Credits unavailable"}
              </span>
            </div>

            <h3>{course.title}</h3>

            <p className="course-description">
              {course.description || "No description available."}
            </p>

            <button
              className="details-button"
              onClick={() =>
                alert(`${course.code}\n${course.title}`)
              }
            >
              View course
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
