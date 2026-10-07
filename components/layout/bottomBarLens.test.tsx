import { act, fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import BottomBarLens from "./bottomBarLens";

jest.mock("./bottomBarGlass", () => ({ __esModule: true, default: () => <span /> }));

const destinations = ["/", "/search", "/myshelf", "/community", "/user"];
let reduceMotion = false;

function Harness({ activeIndex = 1, onNavigate = jest.fn() }) {
    const barRef = useRef<HTMLElement>(null);
    return (
        <nav ref={barRef} style={{ padding: 5 }}>
            <BottomBarLens barRef={barRef} activeIndex={activeIndex} />
            {destinations.map((href) => (
                <a key={href} href={href} onClick={(event) => { event.preventDefault(); onNavigate(href); }}>{href}</a>
            ))}
        </nav>
    );
}

function pointer(type: string, properties: Partial<PointerEvent> = {}) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.assign(event, {
        pointerId: 1, isPrimary: true, pointerType: "mouse", button: 0, buttons: 0,
        clientX: 110, clientY: 34, ...properties,
    });
    fireEvent(screen.getByRole("navigation"), event);
}

function finishMotion() {
    act(() => jest.advanceTimersByTime(1500));
}

function lens() {
    return screen.getByRole("navigation").querySelector<HTMLSpanElement>("[data-visible]")!;
}

beforeEach(() => {
    jest.useFakeTimers();
    reduceMotion = false;
    window.matchMedia = jest.fn().mockImplementation(() => ({
        get matches() { return reduceMotion; },
        addEventListener: jest.fn(), removeEventListener: jest.fn(),
    }));
    window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(performance.now()), 16);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    global.ResizeObserver = jest.fn().mockImplementation(() => ({ observe: jest.fn(), disconnect: jest.fn() }));
    jest.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(360);
    jest.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
        x: 0, y: 0, left: 0, top: 0, right: 360, bottom: 68, width: 360, height: 68, toJSON: () => ({}),
    });
    const captures = new Set<number>();
    HTMLElement.prototype.setPointerCapture = (id) => { captures.add(id); };
    HTMLElement.prototype.hasPointerCapture = (id) => captures.has(id);
    HTMLElement.prototype.releasePointerCapture = (id) => { captures.delete(id); };
});

afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
});

test("hover는 라우팅 없이 포인터를 따르고 이탈하면 현재 탭으로 복귀", () => {
    const onNavigate = jest.fn();
    render(<Harness onNavigate={onNavigate} />);
    pointer("pointerenter", { clientX: 210 });
    finishMotion();
    expect(lens().style.transform).toContain("translate3d(170px");
    expect(lens().style.getPropertyValue("--lens-glass")).toBe("1");
    expect(onNavigate).not.toHaveBeenCalled();
    pointer("pointerleave");
    finishMotion();
    expect(lens().style.transform).toContain("translate3d(70px");
    expect(lens().style.getPropertyValue("--lens-glass")).toBe("0");
    expect(jest.getTimerCount()).toBe(0);
});

test.each(["touch", "mouse"])("%s 드래그는 놓은 메뉴로 한 번만 이동", (pointerType) => {
    const onNavigate = jest.fn();
    render(<Harness onNavigate={onNavigate} />);
    pointer("pointerdown", { pointerType, buttons: 1, clientX: 40 });
    pointer("pointermove", { pointerType, buttons: 1, clientX: 315 });
    pointer("pointerup", { pointerType, clientX: 315 });
    fireEvent.click(screen.getByRole("link", { name: "/" }), { detail: 1 });
    expect(onNavigate).toHaveBeenCalledTimes(1);
    expect(onNavigate).toHaveBeenCalledWith("/user");
});

test.each(["pointercancel", "outside"])("%s 시 페이지 이동 없이 선택 복원", (end) => {
    const onNavigate = jest.fn();
    render(<Harness onNavigate={onNavigate} />);
    pointer("pointerdown", { pointerType: "touch", buttons: 1 });
    pointer("pointermove", { pointerType: "touch", buttons: 1, clientX: 315 });
    pointer(end === "outside" ? "pointerup" : "pointercancel", { pointerType: "touch", clientY: 120 });
    finishMotion();
    expect(onNavigate).not.toHaveBeenCalled();
    expect(lens().style.transform).toContain("translate3d(70px");
});

test("일반 클릭과 키보드 클릭은 기존 링크로 전달", () => {
    const onNavigate = jest.fn();
    render(<Harness onNavigate={onNavigate} />);
    pointer("pointerdown", { buttons: 1 });
    pointer("pointerup");
    const link = screen.getByRole("link", { name: "/search" });
    fireEvent.click(link, { detail: 1 });
    fireEvent.click(link, { detail: 0 });
    expect(onNavigate).toHaveBeenCalledTimes(2);
});

test("현재 경로 변경 시 새 선택 위치로 이동", () => {
    const { rerender } = render(<Harness />);
    rerender(<Harness activeIndex={3} />);
    finishMotion();
    expect(lens().style.transform).toContain("translate3d(210px");
});

test("움직임 감소 설정에서는 확대와 탄성 없이 이동", () => {
    reduceMotion = true;
    render(<Harness />);
    pointer("pointerenter", { clientX: 210 });
    act(() => jest.advanceTimersByTime(16));
    expect(lens().style.transform).toBe("translate3d(170px, 0px, 0) scale(1, 1) rotate(0deg)");
});
