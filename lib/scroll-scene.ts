/** Cache scene geometry outside the scroll path. Native scrolling stays in charge. */
export function observeScrollScene(
  section: HTMLElement,
  stage: HTMLElement,
  onSample: (sample: {
    top: number;
    travel: number;
    width: number;
    height: number;
    snap: boolean;
  }) => void,
) {
  let frame = 0;
  let dirty = true;
  let snap = true;
  let top = 0;
  let travel = 1;
  let width = 0;
  let height = 0;

  const render = () => {
    frame = 0;
    if (document.hidden) return;
    const scrollY = window.scrollY;
    if (dirty) {
      const nextTop = section.getBoundingClientRect().top + scrollY;
      const nextWidth = stage.clientWidth;
      const nextHeight = stage.clientHeight;
      const nextTravel = Math.max(1, section.offsetHeight - nextHeight);
      snap ||=
        nextTop !== top ||
        nextWidth !== width ||
        nextHeight !== height ||
        nextTravel !== travel;
      top = nextTop;
      width = nextWidth;
      height = nextHeight;
      travel = nextTravel;
      dirty = false;
    }
    onSample({ top: top - scrollY, travel, width, height, snap });
    snap = false;
  };
  const schedule = () => {
    if (!frame && !document.hidden) frame = requestAnimationFrame(render);
  };
  const measure = () => {
    dirty = true;
    schedule();
  };
  const resume = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else {
      snap = true;
      measure();
    }
  };
  const observer = new ResizeObserver(measure);
  observer.observe(section);
  observer.observe(stage);
  observer.observe(document.body);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', measure, { passive: true });
  window.addEventListener('pageshow', resume);
  document.addEventListener('visibilitychange', resume);
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', measure);
    window.removeEventListener('pageshow', resume);
    document.removeEventListener('visibilitychange', resume);
  };
}
