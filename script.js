// ========================================
// بيانات الطلاب التجريبية وحساب النتائج
// ========================================
class Student {
  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;
    this.attendance = attendance;
  }
  calculateAverage() {
    const total = this.grades.reduce((sum, grade) => sum + grade, 0);
    return this.grades.length ? total / this.grades.length : 0;
  }
  calculateGrade() {
    const average = this.calculateAverage();
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    if (average >= 50) return "E";
    return "F";
  }
  getFinalResult() {
    return this.calculateAverage() >= 50 && this.attendance >= 60 ? "ناجح" : "يحتاج إلى مراجعة";
  }
}

const studentsList = [
  new Student(101, "أحمد", [90, 85, 95], 95),
  new Student(102, "محمد", [45, 48, 42], 50),
  new Student(103, "علي", [70, 75, 80], 90),
  new Student(104, "عمر", [40, 45, 44], 48)
];

// جدول التقديرات: نطاقات GPA الجديدة حسب تقسيم المستخدم.
// الحد الأعلى غير شامل عند وجود نطاقين متتاليين؛ لذلك 2.0 ضمن "مقبول"
// والراسب أقل من 2.0. كما أن 4.0 تُحسب ضمن "امتياز".
const gradingScale = [
  { grade: "A",  arabic: "امتياز", gpaMin: 3.7, gpaMax: 4.0, min: 90, max: 100 },
  { grade: "B+", arabic: "جيد جدًا مرتفع", gpaMin: 3.3, gpaMax: 3.7, min: 85, max: 90 },
  { grade: "B",  arabic: "جيد جدًا", gpaMin: 3.0, gpaMax: 3.3, min: 80, max: 85 },
  { grade: "C+", arabic: "جيد مرتفع", gpaMin: 2.7, gpaMax: 3.0, min: 72, max: 80 },
  { grade: "C",  arabic: "جيد", gpaMin: 2.3, gpaMax: 2.7, min: 65, max: 72 },
  { grade: "D+", arabic: "مقبول مرتفع", gpaMin: 2.2, gpaMax: 2.3, min: 55, max: 65 },
  { grade: "D",  arabic: "مقبول", gpaMin: 2.0, gpaMax: 2.2, min: 50, max: 55 },
  { grade: "F",  arabic: "راسب", gpaMin: 0.0, gpaMax: 2.0, min: 0, max: 50 }
];
const formatNumber = value => Number(value).toFixed(2);
const gpaRange = item => item.grade === "F"
  ? "من 0.00 إلى أقل من 2.00"
  : item.grade === "D+"
    ? "2.20"
    : `${item.gpaMin.toFixed(1)} إلى أقل من ${item.gpaMax.toFixed(1)}`;
const percentRange = item => item.grade === "F"
  ? "أقل من ٥٠٪"
  : `${item.min}٪ إلى أقل من ${item.max}٪`;

function renderAnswer(targetId, item, extraLabel) {
  const target = document.getElementById(targetId);
  target.innerHTML = "";
  if (!item) {
    target.innerHTML = '<div class="answer-error">لم نعثر على نتيجة مطابقة. راجع القيمة وحاول مرة أخرى.</div>';
    return;
  }
  const title = document.createElement("div");
  title.className = "answer-success-title";
  title.textContent = "تم العثور على النتيجة";
  const grid = document.createElement("div");
  grid.className = "answer-result-grid";
  const entries = [
    ["التقدير", `${item.arabic} (${item.grade})`],
    ["نطاق المعدل التراكمي GPA", gpaRange(item)],
    ["النسبة المئوية", percentRange(item)]
  ];
  if (extraLabel) entries.push(extraLabel);
  entries.forEach(([label, value]) => {
    const cell = document.createElement("div");
    cell.className = "answer-result-item";
    const small = document.createElement("small");
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = value;
    cell.append(small, strong);
    grid.appendChild(cell);
  });
  target.append(title, grid);
}

document.getElementById("gpaForm").addEventListener("submit", event => {
  event.preventDefault();
  const value = Number(document.getElementById("gpaInput").value);
  const item = Number.isFinite(value) && value >= 0 && value <= 4
    ? gradingScale.find(row =>
        value >= row.gpaMin &&
        (row.grade === "F" ? value < row.gpaMax :
          row.grade === "A" ? value <= row.gpaMax :
            row.grade === "D+" ? Math.abs(value - row.gpaMin) < 0.001 :
              value < row.gpaMax)
      )
    : null;
  renderAnswer("gpaAnswer", item);
});

// إنشاء اختيارات التقدير تلقائيًا لتتطابق مع التقسيم الجديد.
const gradeSelect = document.getElementById("gradeInput");
gradeSelect.innerHTML = '<option value="">اختر التقدير</option>';
gradingScale.forEach(row => {
  const option = document.createElement("option");
  option.value = row.grade;
  option.textContent = `${row.arabic} (${row.grade})`;
  gradeSelect.appendChild(option);
});

document.getElementById("gradeForm").addEventListener("submit", event => {
  event.preventDefault();
  const value = gradeSelect.value;
  const item = gradingScale.find(row => row.grade === value);
  renderAnswer("gradeAnswer", item);
});

document.getElementById("percentForm").addEventListener("submit", event => {
  event.preventDefault();
  const value = Number(document.getElementById("percentInput").value);
  const item = gradingScale.find(row =>
    value >= row.min && (row.grade === "A" ? value <= row.max : value < row.max)
  );
  renderAnswer("percentAnswer", item);
});

// ========================================
// تقارير لوحة المتابعة
// ========================================
const successfulStudents = studentsList.filter(student => student.getFinalResult() === "ناجح");
const reviewStudents = studentsList.filter(student => student.getFinalResult() !== "ناجح");
const classAverage = studentsList.length
  ? studentsList.reduce((sum, student) => sum + student.calculateAverage(), 0) / studentsList.length
  : 0;

document.getElementById("totalStudents").textContent = studentsList.length;
document.getElementById("successfulStudents").textContent = successfulStudents.length;
document.getElementById("reviewStudents").textContent = reviewStudents.length;
document.getElementById("classAverage").textContent = classAverage.toFixed(2);
document.getElementById("recordCount").textContent = `${studentsList.length} سجلات`;

const studentsTable = document.getElementById("studentsTable");
studentsList.forEach(student => {
  const result = student.getFinalResult();
  const resultClass = result === "ناجح" ? "passed" : "review";
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><span class="student-name"></span></td>
    <td><span class="student-id">#${student.id}</span></td>
    <td>${student.calculateAverage().toFixed(2)}</td>
    <td><span class="grade">${student.calculateGrade()}</span></td>
    <td>${student.attendance}٪</td>
    <td><span class="result ${resultClass}">${result}</span></td>`;
  tr.querySelector(".student-name").textContent = student.name;
  studentsTable.appendChild(tr);
});

// ========================================
// لجنة الرأفة - بيانات توضيحية للمشروع
// ========================================
const mercyStudents = studentsList
  .filter(student => student.calculateAverage() >= 40 && student.calculateAverage() < 50)
  .map(student => ({
    id: student.id,
    name: student.name,
    originalAverage: student.calculateAverage(),
    newAverage: student.calculateAverage() + 5
  }));

const mercyAverage = mercyStudents.length
  ? mercyStudents.reduce((sum, student) => sum + student.newAverage, 0) / mercyStudents.length
  : 0;

document.getElementById("mercyCount").textContent = mercyStudents.length;
document.getElementById("mercyAverage").textContent = mercyAverage.toFixed(2);

const mercyList = document.getElementById("mercyStudents");
if (mercyStudents.length) {
  mercyStudents.forEach(student => {
    const card = document.createElement("div");
    card.className = "mercy-student";
    const info = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = student.name;
    const old = document.createElement("small");
    old.textContent = `المتوسط الأصلي: ${student.originalAverage.toFixed(2)}`;
    info.append(name, old);
    const newAverage = document.createElement("b");
    newAverage.textContent = `${student.newAverage.toFixed(2)} / ١٠٠`;
    card.append(info, newAverage);
    mercyList.appendChild(card);
  });
} else {
  mercyList.innerHTML = '<p class="empty-message">لا يوجد طلاب تنطبق عليهم الشروط في البيانات التجريبية.</p>';
}
