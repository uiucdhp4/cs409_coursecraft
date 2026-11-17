
const API_BASE = "/api/course-explorer";
// Subjects to include in the initial CourseCraft search.
// We can expand this list later.
export const SUBJECTS = [
  "CS",
  "MATH",
  "STAT",
  "ECE",
  "PHYS",
  "CHEM",
  "ECON",
  "ENG",
  "RHET",
  "PSYC",
  "IB",
  "KIN",
];

async function fetchXML(path) {
  const response = await fetch(`${API_BASE}/${path}.xml`);

  if (!response.ok) {
    throw new Error(`Course API error: ${response.status}`);
  }

  const xmlText = await response.text();
  const xml = new DOMParser().parseFromString(
    xmlText,
    "application/xml"
  );

  if (xml.querySelector("parsererror")) {
    throw new Error("Could not read course data.");
  }

  return xml;
}

function getText(element, selectors) {
  for (const selector of selectors) {
    const value = element.querySelector(selector)?.textContent?.trim();

    if (value) {
      return value;
    }
  }

  return "";
}

function parseCourse(element, subject) {
  const number =
    element.getAttribute("id") ||
    getText(element, ["courseNumber", "number"]);

  const title = getText(element, ["label", "title", "name"]);

  const description = getText(element, ["description"]);

  const creditHours = getText(element, [
    "creditHours",
    "credit-hours",
  ]);

  if (!number) {
    return null;
  }

  return {
    id: `${subject}-${number}`,
    subject,
    number,
    code: `${subject} ${number}`,
    title: title || `${subject} ${number}`,
    description,
    creditHours,
  };
}

// Fetch all courses for one subject in a given catalog term.
export async function fetchSubjectCourses(
  subject,
  year = "2026",
  term = "fall"
) {
  const xml = await fetchXML(
    `catalog/${year}/${term}/${subject}`
  );

  const courseElements = Array.from(
    xml.getElementsByTagName("course")
  );

  return courseElements
    .map((element) => parseCourse(element, subject))
    .filter(Boolean);
}

// Fetch courses across all configured subjects.
export async function fetchAllCourses(
  year = "2026",
  term = "fall"
) {
  const results = await Promise.allSettled(
    SUBJECTS.map((subject) =>
      fetchSubjectCourses(subject, year, term)
    )
  );

  const courses = results
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);

  if (courses.length === 0) {
    throw new Error(
      "Could not load courses. Please try again later."
    );
  }

  return courses;
}
