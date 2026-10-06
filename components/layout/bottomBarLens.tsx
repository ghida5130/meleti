"use client";

import { RefObject, useEffect, useRef } from "react";
import BottomBarGlass from "./bottomBarGlass";
import styles from "./bottomBar.module.scss";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function BottomBarLens({
  barRef,
  activeIndex,
}: {
  barRef: RefObject<HTMLElement>;
  activeIndex: number;
}) {
  const lensRef = useRef<HTMLSpanElement>(null);
  const activeIndexRef = useRef(activeIndex);
  const settleRef = useRef<() => void>();

  useEffect(() => {
    const bar = barRef.current;
    const lens = lensRef.current;
    if (!bar || !lens) return;

    const links = Array.from(bar.querySelectorAll<HTMLAnchorElement>("a"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const axes = {
      x: { value: 0, target: 0, velocity: 0 },
      y: { value: 0, target: 0, velocity: 0 },
      lift: { value: 0, target: 0, velocity: 0 },
    };
    let itemWidth = 0;
    let padding = 0;
    let frame = 0;
    let lastTime = 0;
    let tracking = false;
    let gesture: { id: number; startX: number; startY: number; dragged: boolean } | null = null;
    let suppressClick = false;

    const paint = () => {
      const lift = reducedMotion.matches ? 0 : axes.lift.value;
      const stretch = reducedMotion.matches ? 0 : Math.min(Math.abs(axes.x.velocity) / 2400, 0.14);
      const tilt = reducedMotion.matches ? 0 : clamp(axes.x.velocity / 500, -2, 2);
      const scaleX = 1 + lift * 0.12 + stretch;
      const scaleY = 1 + lift * 0.3 - stretch * 0.45;
      lens.style.transform = `translate3d(${axes.x.value}px, ${axes.y.value}px, 0) scale(${scaleX}, ${scaleY}) rotate(${tilt}deg)`;
      lens.style.setProperty("--lens-glass", String(clamp(axes.lift.value, 0, 1)));
    };

    // 경과 시간 기반 스프링으로 추적 지연, 속도에 따른 늘어남, 정지 후 잔진동 처리
    const animate = (time: number) => {
      const elapsed = lastTime ? Math.min((time - lastTime) / 1000, 0.032) : 1 / 60;
      lastTime = time;
      let moving = false;

      for (const axis of Object.values(axes)) {
        if (reducedMotion.matches) {
          axis.value = axis.target;
          axis.velocity = 0;
          continue;
        }
        for (let step = 0; step < 2; step++) {
          axis.velocity += (((axis.target - axis.value) * 420 - axis.velocity * 25) * elapsed) / 2;
          axis.value += (axis.velocity * elapsed) / 2;
        }
        if (Math.abs(axis.target - axis.value) > 0.001 || Math.abs(axis.velocity) > 0.01) {
          moving = true;
        } else {
          axis.value = axis.target;
          axis.velocity = 0;
        }
      }
      paint();
      frame = moving ? requestAnimationFrame(animate) : 0;
      if (!moving) lastTime = 0;
    };

    const start = () => {
      if (!frame) frame = requestAnimationFrame(animate);
    };

    const setTracking = (value: boolean) => {
      tracking = value;
      axes.lift.target = value ? 1 : 0;
      lens.dataset.visible = String(value || activeIndexRef.current !== -1);
    };

    const settle = () => {
      setTracking(false);
      axes.x.target = Math.max(activeIndexRef.current, 0) * itemWidth;
      axes.y.target = 0;
      start();
    };
    settleRef.current = settle;

    const follow = (event: PointerEvent) => {
      const bounds = bar.getBoundingClientRect();
      setTracking(true);
      axes.x.target = clamp(
        event.clientX - bounds.left - padding - itemWidth / 2,
        0,
        itemWidth * (links.length - 1),
      );
      axes.y.target = reducedMotion.matches
        ? 0
        : clamp((event.clientY - bounds.top - bounds.height / 2) * 0.15, -3, 3);
      start();
    };

    const onDown = (event: PointerEvent) => {
      if (!event.isPrimary || gesture) return;
      suppressClick = false;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
      gesture = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dragged: false,
      };
      if (event.pointerType !== "mouse") bar.setPointerCapture(event.pointerId);
      follow(event);
    };

    const onMove = (event: PointerEvent) => {
      if (!event.isPrimary || (gesture && gesture.id !== event.pointerId)) return;
      if (
        gesture &&
        Math.hypot(event.clientX - gesture.startX, event.clientY - gesture.startY) > 6
      ) {
        gesture.dragged = true;
        if (!bar.hasPointerCapture(event.pointerId)) bar.setPointerCapture(event.pointerId);
      }
      if (gesture || (event.pointerType === "mouse" && event.buttons === 0)) follow(event);
    };

    const cancel = () => {
      const pointerId = gesture?.id;
      if (gesture) suppressClick = true;
      gesture = null;
      if (pointerId !== undefined && bar.hasPointerCapture(pointerId))
        bar.releasePointerCapture(pointerId);
      settle();
    };

    const onUp = (event: PointerEvent) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      const selectOnRelease = gesture.dragged || event.pointerType !== "mouse";
      gesture = null;
      if (bar.hasPointerCapture(event.pointerId)) bar.releasePointerCapture(event.pointerId);
      const bounds = bar.getBoundingClientRect();
      const inside =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;
      if (!inside) {
        suppressClick = true;
        settle();
        return;
      }
      const index = clamp(
        Math.floor((event.clientX - bounds.left - padding) / itemWidth),
        0,
        links.length - 1,
      );
      setTracking(false);
      axes.x.target = index * itemWidth;
      axes.y.target = 0;
      start();
      if (selectOnRelease) {
        // 드래그 종료 위치로 한 번만 이동하고 뒤따르는 브라우저 클릭 중복 방지
        suppressClick = true;
        links[index].click();
      }
    };

    const onClick = (event: MouseEvent) => {
      if (suppressClick && event.detail !== 0) {
        event.preventDefault();
        event.stopImmediatePropagation();
        suppressClick = false;
      }
    };
    const onLeave = () => {
      if (!gesture && tracking) settle();
    };
    const onCancel = (event: PointerEvent) => {
      if (gesture?.id === event.pointerId) cancel();
    };
    const onLostCapture = (event: PointerEvent) => {
      if (event.target === bar && gesture) cancel();
    };
    const onDragStart = (event: DragEvent) => event.preventDefault();
    const onMotionChange = () => {
      settle();
    };

    const measure = () => {
      padding = parseFloat(getComputedStyle(bar).paddingLeft);
      itemWidth = (bar.clientWidth - padding * 2) / links.length;
      settle();
      axes.x.value = axes.x.target;
      axes.x.velocity = 0;
      paint();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    measure();
    bar.addEventListener("pointerenter", onMove);
    bar.addEventListener("pointermove", onMove);
    bar.addEventListener("pointerdown", onDown);
    bar.addEventListener("pointerup", onUp);
    bar.addEventListener("pointerleave", onLeave);
    bar.addEventListener("pointercancel", onCancel);
    bar.addEventListener("lostpointercapture", onLostCapture);
    bar.addEventListener("click", onClick, true);
    bar.addEventListener("dragstart", onDragStart);
    window.addEventListener("blur", cancel);
    reducedMotion.addEventListener("change", onMotionChange);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      bar.removeEventListener("pointerenter", onMove);
      bar.removeEventListener("pointermove", onMove);
      bar.removeEventListener("pointerdown", onDown);
      bar.removeEventListener("pointerup", onUp);
      bar.removeEventListener("pointerleave", onLeave);
      bar.removeEventListener("pointercancel", onCancel);
      bar.removeEventListener("lostpointercapture", onLostCapture);
      bar.removeEventListener("click", onClick, true);
      bar.removeEventListener("dragstart", onDragStart);
      window.removeEventListener("blur", cancel);
      reducedMotion.removeEventListener("change", onMotionChange);
      if (gesture && bar.hasPointerCapture(gesture.id)) bar.releasePointerCapture(gesture.id);
      settleRef.current = undefined;
    };
  }, [barRef]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    settleRef.current?.();
  }, [activeIndex]);

  return (
    <span
      ref={lensRef}
      className={styles.selection}
      data-visible={activeIndex !== -1}
      aria-hidden="true"
    >
      <BottomBarGlass className={styles.selectionGlass} />
    </span>
  );
}
