import { useEffect, useMemo, useState } from "react";
import { fetchAllCourses, SUBJECTS } from "./api";
import { isLoggedIn, logout } from "./auth";
import { semesterLabel } from "./data";
import { loadPlan, savePlan, toPlanCourse } from "./planStorage";
import AddToPlanModal from "./AddToPlanModal";
import Login from "./Login";
import Planner from "./Planner";
import "./App.css";

function AppHeader({ currentPage, onNavigate, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="brand">
          <span className="brand-icon">C</span>
          <span>CourseCraft</span>
        </div>

        <nav className="main-nav" aria-label="Primary">
          <button
            type="button"
            className={
              currentPage === "explorer" ? "nav-link active" : "nav-link"
            }
            onClick={() => onNavigate("explorer")}
          >
            Course Explorer
          </button>
          <button
            type="button"
            className={
              currentPage === "planner" ? "nav-link active" : "nav-link"
            }
            onClick={() => onNavigate("planner")}
          >
            My Planner
          </button>
        </nav>
      </div>

      <div className="topbar-actions">
        <span className="term-label">UIUC · Fall 2026</span>
        <button type="button" className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

function CourseExplorer({
  onOpenAddToPlan,
  targetSemesterLabel,
}) {
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
      <section className="page-heading">
        <p className="eyebrow">UNIVERSITY OF ILLINOIS</p>
        <h1>Course Explorer</h1>
        <p className="subtitle">
          Find courses and start building your academic plan.
        </p>
        {targetSemesterLabel && (
          <p className="target-semester-banner">
            Adding courses to <strong>{targetSemesterLabel}</strong>. Choose a
            course and click Add to Plan.
          </p>
        )}
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

            <div className="course-card-actions">
              <button
                className="details-button"
                onClick={() =>
                  alert(`${course.code}\n${course.title}`)
                }
              >
                View course
              </button>
              <button
                type="button"
                className="add-to-plan-button"
                onClick={() => onOpenAddToPlan(course)}
              >
                Add to Plan
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

function App() {
  // Prototype auth: sessionStorage-backed gate. Replace with real auth later.
  const [authenticated, setAuthenticated] = useState(() => isLoggedIn());
  const [currentPage, setCurrentPage] = useState("explorer");
  const [plan, setPlan] = useState(() => loadPlan());
  const [courseToAdd, setCourseToAdd] = useState(null);
  const [preselectedSemesterId, setPreselectedSemesterId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    savePlan(plan);
  }, [plan]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function handleLoginSuccess() {
    setAuthenticated(true);
  }

  function handleLogout() {
    logout();
    setAuthenticated(false);
    setCurrentPage("explorer");
    setCourseToAdd(null);
    setPreselectedSemesterId(null);
  }

  function handleNavigate(page) {
    setCurrentPage(page);
    if (page === "planner") {
      setPreselectedSemesterId(null);
    }
  }

  function handleOpenAddToPlan(course) {
    setCourseToAdd(course);
  }

  function handleConfirmAdd(semesterId) {
    if (!courseToAdd) return;

    const planCourse = toPlanCourse(courseToAdd);
    const semester = plan.semesters.find((item) => item.id === semesterId);

    setPlan((current) => ({
      ...current,
      semesters: current.semesters.map((item) => {
        if (item.id !== semesterId) return item;
        if (item.courses.some((course) => course.id === planCourse.id)) {
          return item;
        }
        return {
          ...item,
          courses: [...item.courses, planCourse],
        };
      }),
    }));

    setToast(
      `${planCourse.code} added to ${
        semester ? semesterLabel(semester) : "your plan"
      }.`
    );
    setCourseToAdd(null);
  }

  function handleRemoveCourse(courseId, semesterId) {
    setPlan((current) => ({
      ...current,
      semesters: current.semesters.map((semester) => {
        if (semester.id !== semesterId) return semester;
        return {
          ...semester,
          courses: semester.courses.filter((course) => course.id !== courseId),
        };
      }),
    }));
  }

  function handleMoveCourse(courseId, fromSemesterId, toSemesterId) {
    if (fromSemesterId === toSemesterId) return;

    const fromSemester = plan.semesters.find(
      (semester) => semester.id === fromSemesterId
    );
    const course = fromSemester?.courses.find((item) => item.id === courseId);
    if (!course) return;

    const target = plan.semesters.find(
      (semester) => semester.id === toSemesterId
    );
    if (target?.courses.some((item) => item.id === courseId)) {
      setToast(
        `${course.code} is already in ${semesterLabel(target)}.`
      );
      return;
    }

    setPlan((current) => ({
      ...current,
      semesters: current.semesters.map((semester) => {
        if (semester.id === fromSemesterId) {
          return {
            ...semester,
            courses: semester.courses.filter((item) => item.id !== courseId),
          };
        }
        if (semester.id === toSemesterId) {
          return {
            ...semester,
            courses: [...semester.courses, course],
          };
        }
        return semester;
      }),
    }));

    setToast(
      `${course.code} moved to ${
        target ? semesterLabel(target) : "another semester"
      }.`
    );
  }

  function handleAddCourseForSemester(semesterId) {
    setPreselectedSemesterId(semesterId);
    setCurrentPage("explorer");
  }

  if (!authenticated) {
    return <Login onSuccess={handleLoginSuccess} />;
  }

  const targetSemester = plan.semesters.find(
    (semester) => semester.id === preselectedSemesterId
  );

  return (
    <div className="app-shell">
      <div className="coursecraft header-wrap">
        <AppHeader
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </div>

      {toast && (
        <div className="toast-message" role="status">
          {toast}
        </div>
      )}

      {currentPage === "explorer" ? (
        <CourseExplorer
          onOpenAddToPlan={handleOpenAddToPlan}
          targetSemesterLabel={
            targetSemester ? semesterLabel(targetSemester) : null
          }
        />
      ) : (
        <Planner
          plan={plan}
          onRemoveCourse={handleRemoveCourse}
          onMoveCourse={handleMoveCourse}
          onAddCourseForSemester={handleAddCourseForSemester}
        />
      )}

      {courseToAdd && (
        <AddToPlanModal
          course={courseToAdd}
          semesters={plan.semesters}
          initialSemesterId={preselectedSemesterId}
          onConfirm={handleConfirmAdd}
          onCancel={() => setCourseToAdd(null)}
        />
      )}
    </div>
  );
}

export default App;
