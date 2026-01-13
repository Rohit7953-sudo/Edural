window.addEventListener("load", () => {
    console.log("Dashboard JS loaded ✅");

    // =================== AUTH CHECK ===================
    const loggedIn = localStorage.getItem("isAdminLoggedIn");
    if (!loggedIn || loggedIn !== "true") {
        alert("Access denied! Please log in first.");
        window.location.href = "./login.html";
        return;
    }

    // Elements
    const modal = document.getElementById("modal");
    const modalForm = document.getElementById("modalForm");
    const addBtn = document.getElementById("addBtn");
    const closeModalBtn = document.getElementById("closeModal");
    const tabs = document.querySelectorAll(".tab");
    const studentStats = document.getElementById("studentStats");
    const courseStats = document.getElementById("courseStats");
    const sectionTitle = document.getElementById("sectionTitle");

    let currentTab = "students";
    let editingIndex = null;

    // Default view
    document.getElementById("students").style.display = "block";
    document.getElementById("courses").style.display = "none";
    studentStats.style.display = "grid";
    courseStats.style.display = "none";

    loadCourses();
    loadStudents();
    updateStats();
    updateCourseDropdown();

    // =================== TAB SWITCHING ===================
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((t) => t.classList.remove("active"));
            tab.classList.add("active");

            document.getElementById("students").style.display =
                tab.dataset.target === "students" ? "block" : "none";
            document.getElementById("courses").style.display =
                tab.dataset.target === "courses" ? "block" : "none";

            studentStats.style.display =
                tab.dataset.target === "students" ? "grid" : "none";
            courseStats.style.display =
                tab.dataset.target === "courses" ? "grid" : "none";

            sectionTitle.textContent =
                tab.dataset.target === "students"
                    ? "Student Overview"
                    : "Course Insights";

            currentTab = tab.dataset.target;
            updateStats();
        });
    });

    // =================== MODAL OPEN/CLOSE ===================
    addBtn.addEventListener("click", () => {
        console.log("Add button clicked");
        openModal();
    });

    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
    });

    function openModal(index = null) {
        modal.style.display = "flex";
        modalForm.reset();
        editingIndex = index;
        document.getElementById("modalTitle").textContent =
            index !== null ? "Edit Record" : "Add Record";

        const studentFields = document.getElementById("studentFields");
        const courseFields = document.getElementById("courseFields");

        if (currentTab === "students") {
            studentFields.style.display = "flex";
            courseFields.style.display = "none";
            updateCourseDropdown();
        } else {
            studentFields.style.display = "none";
            courseFields.style.display = "flex";
        }
    }

    // =================== FORM SUBMISSION ===================
    modalForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Disable validation on hidden fields (critical fix)
        const studentFieldsDiv = document.getElementById("studentFields");
        const courseFieldsDiv = document.getElementById("courseFields");

        const allFields = document.querySelectorAll("#studentFields input, #studentFields select, #courseFields input, #courseFields select");

        allFields.forEach(field => {
            const parentDiv = field.closest("div");
            if (parentDiv && getComputedStyle(parentDiv).display === "none") {
                field.disabled = true;  // ignore hidden fields
            } else {
                field.disabled = false; // enable visible fields
            }
        });

        console.log("Form submitted ");

        // ====== STUDENT LOGIC ======
        if (currentTab === "students") {
            const students = JSON.parse(localStorage.getItem("students")) || [];
            const newStudent = {
                name: document.getElementById("studentName").value.trim(),
                course: document.getElementById("studentCourse").value.trim(),
                email: document.getElementById("studentEmail").value.trim(),
            };

            // manual validation
            if (currentTab === "students") {
                const required = ["studentName", "studentEmail"];
                for (const id of required) {
                    const el = document.getElementById(id);
                    if (getComputedStyle(el.closest("div")).display !== "none" && !el.value.trim()) {
                        alert("Please fill all student fields!");
                        return;
                    }
                }
            } else {
                const required = ["courseName", "courseDuration", "coursePrice"];
                for (const id of required) {
                    const el = document.getElementById(id);
                    if (getComputedStyle(el.closest("div")).display !== "none" && !el.value.trim()) {
                        alert("Please fill all course fields!");
                        return;
                    }
                }
            }


            students.push(newStudent);
            localStorage.setItem("students", JSON.stringify(students));
            loadStudents();
            alert("Student added successfully!");
        }

        // ====== COURSE LOGIC ======
        else {
            const courses = JSON.parse(localStorage.getItem("courses")) || [];
            const newCourse = {
                name: document.getElementById("courseName").value.trim(),
                duration: document.getElementById("courseDuration").value.trim(),
                price: document.getElementById("coursePrice").value.trim(),
                status: document.getElementById("courseStatus").value.trim(),
            };

            if (!newCourse.name || !newCourse.duration || !newCourse.price) {
                alert("Please fill all fields!");
                return;
            }

            courses.push(newCourse);
            localStorage.setItem("courses", JSON.stringify(courses));
            loadCourses();
            alert("Course added successfully!");
        }

        modal.style.display = "none";
        updateStats();
        updateCourseDropdown();
    });


    // =================== LOAD FUNCTIONS ===================
    function loadStudents() {
        const students = JSON.parse(localStorage.getItem("students")) || [];
        const tbody = document.getElementById("studentTableBody");
        tbody.innerHTML = "";

        students.forEach((s, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${s.name}</td>
        <td>${s.course}</td>
        <td>${s.email}</td>
        <td class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;

            tr.querySelector(".edit").addEventListener("click", () => openModal(index));
            tr.querySelector(".delete").addEventListener("click", () => {
                if (confirm("Delete this student?")) {
                    const updated = students.filter((_, i) => i !== index);
                    localStorage.setItem("students", JSON.stringify(updated));
                    loadStudents();
                    updateStats();
                    alert("Student deleted successfully!");
                }
            });

            tbody.appendChild(tr);
        });
    }

    function loadCourses() {
        const courses = JSON.parse(localStorage.getItem("courses")) || [];
        const tbody = document.getElementById("courseTableBody");
        tbody.innerHTML = "";

        courses.forEach((c, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${c.name}</td>
        <td>${c.duration}</td>
        <td>₹${c.price}</td>
        <td>${c.status}</td>
        <td class="actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </td>
      `;

            tr.querySelector(".edit").addEventListener("click", () => openModal(index));
            tr.querySelector(".delete").addEventListener("click", () => {
                if (confirm("Delete this course?")) {
                    const updated = courses.filter((_, i) => i !== index);
                    localStorage.setItem("courses", JSON.stringify(updated));
                    loadCourses();
                    updateStats();
                    updateCourseDropdown();
                    alert("Course deleted successfully!");
                }
            });

            tbody.appendChild(tr);
        });
    }

    // =================== DROPDOWN + STATS ===================
    function updateCourseDropdown() {
        const courses = JSON.parse(localStorage.getItem("courses")) || [];
        const dropdown = document.getElementById("studentCourse");
        dropdown.innerHTML = "";

        if (courses.length === 0) {
            const opt = document.createElement("option");
            opt.textContent = "No Courses Available";
            opt.disabled = true;
            dropdown.appendChild(opt);
        } else {
            courses.forEach((c) => {
                const opt = document.createElement("option");
                opt.value = c.name;
                opt.textContent = c.name;
                dropdown.appendChild(opt);
            });
        }
    }

    function updateStats() {
        const students = JSON.parse(localStorage.getItem("students")) || [];
        const courses = JSON.parse(localStorage.getItem("courses")) || [];

        document.getElementById("totalStudents").textContent = students.length;
        document.getElementById("activeStudents").textContent = Math.floor(
            students.length * 0.85
        );
        document.getElementById("totalCourses").textContent = courses.length;

        const activeCourses = courses.filter((c) => c.status === "Active").length;
        document.getElementById("activeCourses").textContent = activeCourses;
    }
});

// =================== LOGOUT FUNCTION ===================
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmLogout = confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      // Remove admin login flag
      localStorage.removeItem("isAdminLoggedIn");

      // Optional: clear stored dashboard data if you want a fresh start every login
      // localStorage.removeItem("students");
      // localStorage.removeItem("courses");

      // Redirect to login page
      window.location.href = "./index.html";
    }
  });
}

