
export const initialCourses = [
  { id: "CS-124", subject: "CS", number: "124", title: "Introduction to Computer Science I", credits: 3, description: "An introduction to problem solving and programming.", prerequisites: "None" },
  { id: "CS-128", subject: "CS", number: "128", title: "Introduction to Computer Science II", credits: 3, description: "Data structures and object-oriented programming.", prerequisites: "CS 124" },
  { id: "CS-173", subject: "CS", number: "173", title: "Discrete Structures", credits: 3, description: "Discrete mathematics for computer science.", prerequisites: "MATH 231 or equivalent" },
  { id: "CS-225", subject: "CS", number: "225", title: "Data Structures", credits: 4, description: "Fundamental data structures and algorithms.", prerequisites: "CS 128 and CS 173" },
  { id: "CS-233", subject: "CS", number: "233", title: "Computer Architecture", credits: 4, description: "Processor organization, assembly, and memory systems.", prerequisites: "CS 128" },
  { id: "CS-341", subject: "CS", number: "341", title: "System Programming", credits: 4, description: "Systems programming, processes, memory, and concurrency.", prerequisites: "CS 225" },
  { id: "CS-374", subject: "CS", number: "374", title: "Introduction to Algorithms & Models of Computation", credits: 4, description: "Algorithm design, analysis, and computation.", prerequisites: "CS 225 and CS 173" },
  { id: "CS-409", subject: "CS", number: "409", title: "The Art of Web Programming", credits: 3, description: "Design and implementation of modern web applications.", prerequisites: "Varies by curriculum" },
  { id: "CS-411", subject: "CS", number: "411", title: "Database Systems", credits: 3, description: "Database design, relational models, and query languages.", prerequisites: "CS 225" },
  { id: "CS-425", subject: "CS", number: "425", title: "Distributed Systems", credits: 4, description: "Principles of distributed computing systems.", prerequisites: "CS 341 or equivalent" },
  { id: "CS-440", subject: "CS", number: "440", title: "Artificial Intelligence", credits: 3, description: "Search, reasoning, and machine learning.", prerequisites: "Varies by curriculum" },
  { id: "CS-441", subject: "CS", number: "441", title: "Applied Machine Learning", credits: 3, description: "Practical machine learning methods.", prerequisites: "Check Course Explorer" },
  { id: "MATH-221", subject: "MATH", number: "221", title: "Calculus I", credits: 5, description: "Differential and integral calculus.", prerequisites: "Placement or prerequisite credit" },
  { id: "MATH-231", subject: "MATH", number: "231", title: "Calculus II", credits: 3, description: "Integration and infinite series.", prerequisites: "MATH 221" },
  { id: "STAT-400", subject: "STAT", number: "400", title: "Statistics and Probability I", credits: 4, description: "Probability theory and statistical methods.", prerequisites: "Check Course Explorer" },
  { id: "STAT-410", subject: "STAT", number: "410", title: "Statistics and Probability II", credits: 3, description: "Probability distributions and statistical inference.", prerequisites: "STAT 400" },
  { id: "RHET-105", subject: "RHET", number: "105", title: "Writing and Research", credits: 4, description: "Academic writing and research.", prerequisites: "None" },
  { id: "ECON-102", subject: "ECON", number: "102", title: "Microeconomic Principles", credits: 3, description: "Introduction to microeconomic concepts.", prerequisites: "None" },
  { id: "PHYS-211", subject: "PHYS", number: "211", title: "University Physics: Mechanics", credits: 4, description: "Mechanics, forces, energy, and momentum.", prerequisites: "Calculus readiness" },
  { id: "GENED-101", subject: "GENED", number: "101", title: "General Education Elective", credits: 3, description: "Placeholder for general education planning.", prerequisites: "Varies" }
];

export const makeInitialPlans = () => [
  {
    id: "plan-main",
    name: "My 4-Year Plan",
    semesters: [
      { id: "2026-fall", year: 2026, term: "Fall", courses: ["CS-341", "CS-440", "CS-409", "STAT-400"] },
      { id: "2027-spring", year: 2027, term: "Spring", courses: ["CS-425", "CS-411", "CS-374", "GENED-101"] },
      { id: "2027-fall", year: 2027, term: "Fall", courses: ["CS-441", "PHYS-211", "ECON-102"] },
      { id: "2028-spring", year: 2028, term: "Spring", courses: ["STAT-410", "GENED-101", "RHET-105"] },
      { id: "2028-fall", year: 2028, term: "Fall", courses: [] },
      { id: "2029-spring", year: 2029, term: "Spring", courses: [] },
      { id: "2029-fall", year: 2029, term: "Fall", courses: [] },
      { id: "2030-spring", year: 2030, term: "Spring", courses: [] }
    ]
  }
];