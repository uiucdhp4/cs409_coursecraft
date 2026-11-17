import { ACADEMIC_YEARS, semesterLabel } from "./data";

function Planner({
  plan,
  onRemoveCourse,
  onMoveCourse,
  onAddCourseForSemester,
}) {
  return (
    <main className="coursecraft">
      <section className="page-heading">
        <p className="eyebrow">UNIVERSITY OF ILLINOIS</p>
        <h1>My Academic Plan</h1>
        <p className="subtitle">
          Build your four-year schedule across eight semesters.
        </p>
      </section>

      <div className="planner-years">
        {ACADEMIC_YEARS.map((yearLabel) => {
          const yearSemesters = plan.semesters.filter(
            (semester) => semester.academicYear === yearLabel
          );

          return (
            <section className="planner-year" key={yearLabel}>
              <h2 className="planner-year-title">{yearLabel} Year</h2>

              <div className="semester-row">
                {yearSemesters.map((semester) => (
                  <article className="semester-card" key={semester.id}>
                    <div className="semester-card-header">
                      <h3>{semester.term}</h3>
                      <span>
                        {semester.courses.length === 0
                          ? "Empty"
                          : `${semester.courses.length} course${
                              semester.courses.length === 1 ? "" : "s"
                            }`}
                      </span>
                    </div>

                    {semester.courses.length === 0 ? (
                      <p className="semester-empty">
                        No courses yet. Add from Course Explorer.
                      </p>
                    ) : (
                      <ul className="planned-course-list">
                        {semester.courses.map((course) => (
                          <li className="planned-course" key={course.id}>
                            <div className="planned-course-info">
                              <span className="course-code">{course.code}</span>
                              <span className="planned-course-title">
                                {course.title}
                              </span>
                              <span className="credit-hours">
                                {course.creditHours
                                  ? `${course.creditHours} credits`
                                  : "Credits unavailable"}
                              </span>
                            </div>

                            <div className="planned-course-actions">
                              <label className="sr-only" htmlFor={`move-${semester.id}-${course.id}`}>
                                Move {course.code}
                              </label>
                              <select
                                id={`move-${semester.id}-${course.id}`}
                                className="move-select"
                                value={semester.id}
                                onChange={(event) =>
                                  onMoveCourse(
                                    course.id,
                                    semester.id,
                                    event.target.value
                                  )
                                }
                              >
                                {plan.semesters.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.id === semester.id
                                      ? "Stay here"
                                      : `Move to ${semesterLabel(option)}`}
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                className="remove-course-button"
                                onClick={() =>
                                  onRemoveCourse(course.id, semester.id)
                                }
                              >
                                Remove
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <button
                      type="button"
                      className="add-course-button"
                      onClick={() => onAddCourseForSemester(semester.id)}
                    >
                      Add Course
                    </button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}

export default Planner;
