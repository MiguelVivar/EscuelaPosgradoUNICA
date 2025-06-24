import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const scrollAnimationUtils = {
  // Animación de fade in desde abajo
  fadeInUp: (element: string | Element, delay = 0) => {
    if (typeof window === "undefined") return;

    return gsap.fromTo(
      element,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación de fade in desde la izquierda
  fadeInLeft: (element: string | Element, delay = 0) => {
    if (typeof window === "undefined") return;

    return gsap.fromTo(
      element,
      {
        x: -60,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación de fade in desde la derecha
  fadeInRight: (element: string | Element, delay = 0) => {
    if (typeof window === "undefined") return;

    return gsap.fromTo(
      element,
      {
        x: 60,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación de escala con bounce
  scaleInBounce: (element: string | Element, delay = 0) => {
    if (typeof window === "undefined") return;

    return gsap.fromTo(
      element,
      {
        scale: 0.8,
        opacity: 0,
      },
      {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay,
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación staggered para múltiples elementos
  staggeredFadeIn: (
    elements: string | NodeList | Element[],
    staggerDelay = 0.1
  ) => {
    if (typeof window === "undefined") return;

    // Get the trigger element - use first element if it's an array/NodeList, otherwise use the string selector
    const triggerElement =
      typeof elements === "string"
        ? elements
        : elements instanceof NodeList
        ? (elements[0] as Element)
        : elements[0];

    return gsap.fromTo(
      elements,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: staggerDelay,
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación de línea de progreso
  progressLine: (element: string | Element) => {
    if (typeof window === "undefined") return;

    return gsap.fromTo(
      element,
      {
        scaleX: 0,
        transformOrigin: "left center",
      },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },

  // Animación de contador numérico
  countUp: (element: string | Element, finalValue: number, duration = 2) => {
    if (typeof window === "undefined") return;

    const obj = { value: 0 };
    const el =
      typeof element === "string" ? document.querySelector(element) : element;

    return gsap.to(obj, {
      value: finalValue,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (el) {
          (el as HTMLElement).textContent = Math.round(obj.value).toString();
        }
      },
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  },

  // Animación de texto que aparece letra por letra
  typeWriter: (element: string | Element, delay = 0) => {
    if (typeof window === "undefined") return;

    const el =
      typeof element === "string" ? document.querySelector(element) : element;
    if (!el) return;

    const text = (el as HTMLElement).textContent || "";
    (el as HTMLElement).textContent = "";

    return gsap.to(
      {},
      {
        duration: text.length * 0.05,
        ease: "none",
        delay,
        onUpdate: function () {
          const progress = this.progress();
          const currentLength = Math.round(progress * text.length);
          (el as HTMLElement).textContent = text.substring(0, currentLength);
        },
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );
  },
};
