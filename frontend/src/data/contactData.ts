import { ContactInfo } from '@/types/contact';

export const institutionalContactInfo: ContactInfo[] = [
  {
    label: "Horario de atención:",
    value: "Lunes a Viernes, 6:00 am - 12:00 pm",
    type: "text"
  },
  {
    label: "Dirección:",
    value: "Av. Los Maestros S/N",
    type: "address"
  },
  {
    label: "Teléfono:",
    value: "056-620063",
    type: "phone"
  },
  {
    label: "Correo electrónico:",
    value: "diga@unica.edu.pe",
    type: "email"
  },
  {
    label: "Mesa de partes:",
    value: "mesadepartes@unica.edu.pe",
    type: "email"
  }
];

export const mapConfig = {
  title: "Ubicación",
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d967.4750163567132!2d-75.73542102709841!3d-14.083076213129493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9110e28a8ad5a9bf%3A0xb3869e7db6ef2c93!2sUniversidad%20Nacional%20San%20Luis%20Gonzaga!5e0!3m2!1ses!2spe!4v1751081710280!5m2!1ses!2spe",
  width: "100%",
  height: "250"
};
