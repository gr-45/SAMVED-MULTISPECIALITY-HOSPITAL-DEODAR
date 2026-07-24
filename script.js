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
const appointmentMessage = appointmentForm?.querySelector('.form-message');
const allowedDepartments = new Set(['General Vibhag', 'Ayurvedic Panchkarma Vibhag', 'Garbh Sanskar']);
const cleanText = (input, maxLength = 1000) => String(input || '')
  .replace(/[\u0000-\u001F\u007F]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, maxLength);

document.querySelectorAll('a[target="_blank"]').forEach(link => {
  link.relList.add('noopener', 'noreferrer');
});

document.querySelectorAll('a[href="#appointment"]').forEach(link => link.addEventListener('click', event => {
  event.preventDefault();
  const form = document.querySelector('#appointment');
  form?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => appointmentForm?.querySelector('#patient-name')?.focus({ preventScroll: true }), 550);
}));

appointmentForm?.addEventListener('submit', event => {
  event.preventDefault();
  appointmentMessage.textContent = '';
  if (!appointmentForm.checkValidity()) {
    appointmentForm.reportValidity();
    return;
  }

  const value = (id, maxLength) => cleanText(document.querySelector(id)?.value, maxLength) || 'Not provided';
  const name = value('#patient-name', 80);
  const mobile = value('#patient-mobile', 10).replace(/\D/g, '');
  const age = value('#patient-age', 3);
  const gender = value('#patient-gender', 20);
  const department = value('#patient-department', 60);
  const date = value('#appointment-date', 10);
  const time = value('#appointment-time', 5);
  const concern = value('#health-concern', 1000);

  if (!/^[6-9]\d{9}$/.test(mobile) || !allowedDepartments.has(department) || (age !== 'Not provided' && (!/^\d{1,3}$/.test(age) || Number(age) > 120))) {
    appointmentMessage.textContent = 'Please enter valid appointment details.';
    return;
  }

  const whatsappMessage = `*New Appointment Request*\nSamved Multispeciality Hospital\n\nPatient Name: ${name}\nMobile Number: ${mobile}\nAge: ${age}\nGender: ${gender}\nDepartment: ${department}\nPreferred Date: ${date}\nPreferred Time: ${time}\nHealth Concern: ${concern}`;
  const whatsappUrl = `https://wa.me/917490064900?text=${encodeURIComponent(whatsappMessage)}`;
  const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  if (whatsappWindow) whatsappWindow.opener = null;
});

document.querySelectorAll('.slide-btn').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.doctor-grid').scrollIntoView({ behavior: 'smooth', block: 'center' });
}));

const lightbox = document.querySelector('.gallery-lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
let galleryTrigger;
const closeLightbox = () => { if (!lightbox) return; lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lightbox-open'); galleryTrigger?.focus(); };
document.querySelectorAll('.gallery-item').forEach(item => item.addEventListener('click', () => { const imagePath = item.dataset.galleryImage; if (!lightbox || !lightboxImage || !/^Gallery\/[\w.-]+\.(png|jpe?g|webp)$/i.test(imagePath || '')) return; galleryTrigger = item; lightboxImage.src = imagePath; lightboxImage.alt = cleanText(item.dataset.galleryAlt, 160); lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false'); document.body.classList.add('lightbox-open'); lightboxClose?.focus(); }));
lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox(); });
