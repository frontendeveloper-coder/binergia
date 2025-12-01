// Переменные состояния
let selectedCourse = null;

// Инициализация при загрузке страницы
document.addEventListener("DOMContentLoaded", function () {
  // Настройка EmailJS
  if (typeof emailjs !== "undefined") {
    emailjs.init("YOUR_PUBLIC_KEY"); // Замени на свой ключ
  }

  // Обработчики для кнопок выбора курса
  document.querySelectorAll(".select-btn").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Останавливаем всплытие

      const course = this.getAttribute("data-course");
      selectCourse(course);
    });
  });

  // Обработчик отправки формы
  const form = document.getElementById("applicationForm");
  if (form) {
    form.addEventListener("submit", handleFormSubmit);
  }

  // Обработчик маски телефона
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", formatPhoneNumber);
  }

  // Плавный фокус для полей формы
  document
    .querySelectorAll(".input-group input, .input-group textarea")
    .forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        this.parentElement.classList.remove("focused");
      });
    });
});

// Функция выбора курса
function selectCourse(course) {
  // Снимаем выделение со всех карточек
  document.querySelectorAll(".course-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Добавляем выделение выбранной карточке
  const selectedCard = document.querySelector(
    `.course-card[data-course="${course}"]`
  );
  if (selectedCard) {
    selectedCard.classList.add("selected");
  }

  // Сохраняем выбранный курс
  selectedCourse = course;

  // Устанавливаем курс в форме
  const courseName =
    course === "frontend" ? "Frontend разработка" : "Backend разработка";
  const courseInput = document.getElementById("course");
  if (courseInput) {
    courseInput.value = courseName;
  }

  // Обновляем информацию о выбранном курсе
  const selectionInfo = document.getElementById("selectedCourseInfo");
  if (selectionInfo) {
    selectionInfo.innerHTML = `Выбран: <strong>${courseName}</strong>`;
  }
}

// Функция валидации формы
function validateForm() {
  let isValid = true;

  // Валидация имени
  const nameInput = document.getElementById("name");
  const nameError = document.getElementById("nameError");
  if (nameInput && nameError) {
    const name = nameInput.value.trim();
    if (name.length < 2) {
      nameError.textContent = "Имя должно содержать минимум 2 символа";
      nameError.style.display = "block";
      isValid = false;
    } else {
      nameError.style.display = "none";
    }
  }

  // Валидация email
  const emailInput = document.getElementById("email");
  const emailError = document.getElementById("emailError");
  if (emailInput && emailError) {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailError.textContent = "Введите корректный email адрес";
      emailError.style.display = "block";
      isValid = false;
    } else {
      emailError.style.display = "none";
    }
  }

  // Валидация телефона
  const phoneInput = document.getElementById("phone");
  const phoneError = document.getElementById("phoneError");
  if (phoneInput && phoneError) {
    const phone = phoneInput.value.trim();
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      phoneError.textContent = "Введите корректный номер телефона";
      phoneError.style.display = "block";
      isValid = false;
    } else {
      phoneError.style.display = "none";
    }
  }

  // Проверка выбора курса
  if (!selectedCourse) {
    alert("Пожалуйста, выберите курс перед отправкой");
    isValid = false;
  }

  return isValid;
}

// Функция отправки формы
function handleFormSubmit(e) {
  e.preventDefault();

  if (!validateForm()) return;

  const formData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    course: document.getElementById("course").value,
    message: document.getElementById("message").value || "Нет комментария",
    date: new Date().toLocaleString("ru-RU"),
    timestamp: new Date().toISOString(),
  };

  // Показать состояние загрузки
  const submitBtn = document.querySelector(".submit-btn");
  if (submitBtn) {
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<span>Отправка...</span><i class="fas fa-spinner fa-spin"></i>';
    submitBtn.disabled = true;

    // Имитация отправки (замени на реальную отправку через EmailJS)
    setTimeout(() => {
      // В реальном проекте здесь будет отправка через EmailJS
      console.log("Данные для отправки:", formData);

      // Показать сообщение об успехе
      const form = document.getElementById("applicationForm");
      const successMessage = document.getElementById("successMessage");

      if (form) form.style.display = "none";
      if (successMessage) successMessage.style.display = "block";

      // Сбросить форму через 5 секунд
      setTimeout(resetForm, 5000);

      // Восстановить кнопку
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  }
}

// Функция сброса формы
function resetForm() {
  // Сбросить форму
  const form = document.getElementById("applicationForm");
  if (form) {
    form.reset();
    form.style.display = "block";
  }

  // Скрыть сообщение об успехе
  const successMessage = document.getElementById("successMessage");
  if (successMessage) {
    successMessage.style.display = "none";
  }

  // Сбросить выбор курса
  selectedCourse = null;
  document.querySelectorAll(".course-card").forEach((card) => {
    card.classList.remove("selected");
  });

  // Сбросить информацию о курсе
  const selectionInfo = document.getElementById("selectedCourseInfo");
  if (selectionInfo) {
    selectionInfo.innerHTML = "Курс не выбран";
  }

  const courseInput = document.getElementById("course");
  if (courseInput) {
    courseInput.value = "Курс не выбран";
  }
}

// Функция форматирования номера телефона
function formatPhoneNumber(e) {
  let value = e.target.value.replace(/\D/g, "");

  if (value.length > 0) {
    if (value[0] === "7" || value[0] === "8") {
      value = "7" + value.substring(1);
    } else if (value[0] !== "7") {
      value = "7" + value;
    }

    let formatted = "+7";
    if (value.length > 1) {
      formatted += " (" + value.substring(1, 4);
    }
    if (value.length > 4) {
      formatted += ") " + value.substring(4, 7);
    }
    if (value.length > 7) {
      formatted += "-" + value.substring(7, 9);
    }
    if (value.length > 9) {
      formatted += "-" + value.substring(9, 11);
    }

    e.target.value = formatted;
  }
}
