function toCsvCell(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function downloadPlanCsv(plan) {
  const header = ['Semester', 'Rank', 'Course ID', 'Name', 'Credits', 'Priority', 'Difficulty', 'Deadline', 'Prerequisites'];
  const rows = plan.semesters.flatMap((semester) =>
    semester.courses.map((course, index) => [
      semester.number,
      index + 1,
      course.id,
      course.name,
      course.credits,
      course.priority,
      course.difficulty,
      course.deadline,
      course.prerequisites.join(' '),
    ]),
  );

  const csv = [header, ...rows].map((row) => row.map(toCsvCell).join(',')).join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  link.download = `study-plan-by-${plan.sortBy}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}
