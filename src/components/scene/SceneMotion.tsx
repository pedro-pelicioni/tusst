"use client";

// Renders nothing. The landing's MotionOrchestrator, generalized: one client
// island drives all scroll-linked motion inside the element `rootId` names —
// reveals (IntersectionObserver → `is-revealed`), scroll parallax
// (`[data-plx]` local to each `[data-scene]`), and pointer lerp
// (`[data-plx-mouse]`). Honors prefers-reduced-motion by skipping parallax
// (scene.css already forces reveals visible and stops keyframes).

import { useEffect } from "react";

export function SceneMotion({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;

    const reveals = root.querySelectorAll<HTMLElement>("[data-reveal]");
    const revealIO = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            revealIO.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => revealIO.observe(el));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => revealIO.disconnect();
    }

    interface SceneMotionState {
      scene: HTMLElement;
      layers: { el: HTMLElement; factor: number }[];
      pointer: { el: HTMLElement; factor: number }[];
    }

    const scenes: SceneMotionState[] = Array.from(
      root.querySelectorAll<HTMLElement>("[data-scene]"),
    )
      .map((scene) => ({
        scene,
        layers: Array.from(scene.querySelectorAll<HTMLElement>("[data-plx]")).map(
          (el) => ({ el, factor: parseFloat(el.dataset.plx ?? "0") }),
        ),
        pointer: Array.from(
          scene.querySelectorAll<HTMLElement>("[data-plx-mouse]"),
        ).map((el) => ({ el, factor: parseFloat(el.dataset.plxMouse ?? "0") })),
      }))
      .filter((s) => s.layers.length > 0 || s.pointer.length > 0);

    const active = new Set<HTMLElement>();
    let dirty = true;
    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    function frame() {
      raf = 0;
      let settling = false;

      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;
      if (Math.abs(targetX - mouseX) > 0.002 || Math.abs(targetY - mouseY) > 0.002) {
        settling = true;
      }

      const viewportH = window.innerHeight;
      for (const s of scenes) {
        if (!active.has(s.scene)) continue;
        const rect = s.scene.getBoundingClientRect();
        const offset = viewportH / 2 - (rect.top + rect.height / 2);
        for (const layer of s.layers) {
          layer.el.style.transform = `translate3d(0, ${(offset * layer.factor).toFixed(1)}px, 0)`;
        }
        for (const p of s.pointer) {
          p.el.style.transform = `translate3d(${(mouseX * p.factor * 28).toFixed(1)}px, ${(mouseY * p.factor * 18).toFixed(1)}px, 0)`;
        }
      }

      if (dirty || settling) {
        dirty = false;
        schedule();
      }
    }

    function schedule() {
      if (!raf) raf = requestAnimationFrame(frame);
    }

    const sceneIO = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target as HTMLElement);
        else active.delete(entry.target as HTMLElement);
      }
      dirty = true;
      schedule();
    });
    scenes.forEach((s) => sceneIO.observe(s.scene));

    const onScroll = () => {
      dirty = true;
      schedule();
    };
    const onPointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    schedule();

    return () => {
      revealIO.disconnect();
      sceneIO.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [rootId]);

  return null;
}
