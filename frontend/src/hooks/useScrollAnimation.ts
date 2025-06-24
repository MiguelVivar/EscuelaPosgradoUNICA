import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Registrar el plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const useScrollAnimation = () => {
  const elementRef = useRef<HTMLElement>(null);

  const animateOnScroll = (
    target: HTMLElement | string,
    animationProps: gsap.TweenVars,
    triggerProps?: ScrollTrigger.Vars
  ) => {
    if (typeof window === "undefined") return;

    const defaultTriggerProps: ScrollTrigger.Vars = {
      trigger: target,
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none reverse",
      ...triggerProps,
    };

    const defaultAnimationProps: gsap.TweenVars = {
      duration: 1,
      ease: "power2.out",
      ...animationProps,
    };

    gsap.fromTo(
      target,
      {
        opacity: 0,
        y: 50,
        ...defaultAnimationProps.from,
      },
      {
        opacity: 1,
        y: 0,
        scrollTrigger: defaultTriggerProps,
        ...defaultAnimationProps,
      }
    );
  };

  const animateMultipleOnScroll = (
    targets: (HTMLElement | string)[],
    animationProps: gsap.TweenVars[],
    triggerProps?: ScrollTrigger.Vars
  ) => {
    if (typeof window === "undefined") return;

    targets.forEach((target, index) => {
      const props = animationProps[index] || animationProps[0];
      const delay = index * 0.2; // Delay escalonado para múltiples elementos

      animateOnScroll(target, { ...props, delay }, triggerProps);
    });
  };

  useEffect(() => {
    return () => {
      // Limpiar ScrollTrigger al desmontar
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return {
    elementRef,
    animateOnScroll,
    animateMultipleOnScroll,
  };
};
