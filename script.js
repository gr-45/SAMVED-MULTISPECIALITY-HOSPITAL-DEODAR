const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const dateInput = document.querySelector('input[type="date"]');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

const appointmentForm = document.querySelector('#booking-form');
document.querySelectorAll('a[href="#appointment"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const form = document.querySelector('#appointment');
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => appointmentForm?.querySelector('#patient-name')?.focus({ preventScroll: true }), 550);
}));

appointmentForm?.addEventListener('submit', event => {
  event.preventDefault();
  if (!appointmentForm.checkValidity()) {
    appointmentForm.reportValidity();
    return;
  }

  const value = id => document.querySelector(id)?.value.trim() || 'Not provided';
  const whatsappMessage = `*New Appointment Request*\nSamved Multispeciality Hospital\n\nPatient Name: ${value('#patient-name')}\nMobile Number: ${value('#patient-mobile')}\nAge: ${value('#patient-age')}\nGender: ${value('#patient-gender')}\nDepartment: ${value('#patient-department')}\nPreferred Date: ${value('#appointment-date')}\nPreferred Time: ${value('#appointment-time')}\nHealth Concern: ${value('#health-concern')}`;
  const whatsappUrl = `https://wa.me/917490064900?text=${encodeURIComponent(whatsappMessage)}`;
  window.open(whatsappUrl, '_blank', 'noopener');
});

document.querySelectorAll('.slide-btn').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.doctor-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
}));
