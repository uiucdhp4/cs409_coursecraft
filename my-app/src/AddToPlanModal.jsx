import { useEffect, useState } from "react";
import { semesterLabel } from "./data";

function AddToPlanModal({
  course,
  semesters,
  initialSemesterId,
  onConfirm,
  onCancel,
}) {
  const [selectedSemesterId, setSelectedSemesterId] = useState(
    initialSemesterId || semesters[0]?.id || ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedSemesterId(initialSemesterId || semesters[0]?.id || "");
    setError("");
  }, [course, initialSemesterId, semesters]);

  if (!course) return null;

  function handleConfirm(event) {
    event.preventDefault();

    const semester = semesters.find((item) => item.id === selectedSemesterId);
    if (!semester) {
      setError("Please select a semester.");
      return;
    }

    const alreadyAdded = semester.courses.some((item) => item.id === course.id);
    if (alreadyAdded) {
      setError(
        `${course.code} is already in ${semesterLabel(semester)}.`
      );
      return;
    }

    onConfirm(selectedSemesterId);
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-to-plan-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-to-plan-title">Add to Plan</h2>
        <p className="modal-course">
          <span className="course-code">{course.code}</span>
          <span>{course.title}</span>
        </p>

        <form onSubmit={handleConfirm}>
          <label htmlFor="semester-select">Select semester</label>
          <select
            id="semester-select"
            value={selectedSemesterId}
            onChange={(event) => {
              setSelectedSemesterId(event.target.value);
              setError("");
            }}
          >
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semesterLabel(semester)}
              </option>
            ))}
          </select>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="modal-confirm">
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddToPlanModal;
