import { getEmptyPlan } from "./data";

const PLAN_STORAGE_KEY = "coursecraft_academic_plan";

function isValidPlan(plan) {
  return (
    plan &&
    typeof plan === "object" &&
    Array.isArray(plan.semesters) &&
    plan.semesters.length === 8
  );
}

export function loadPlan() {
  try {
    const raw = localStorage.getItem(PLAN_STORAGE_KEY);
    if (!raw) return getEmptyPlan();

    const parsed = JSON.parse(raw);
    if (!isValidPlan(parsed)) return getEmptyPlan();

    return parsed;
  } catch {
    return getEmptyPlan();
  }
}

export function savePlan(plan) {
  localStorage.setItem(PLAN_STORAGE_KEY, JSON.stringify(plan));
}

export function toPlanCourse(course) {
  return {
    id: course.id,
    code: course.code,
    title: course.title,
    creditHours: course.creditHours || "",
  };
}
