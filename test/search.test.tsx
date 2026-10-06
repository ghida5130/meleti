import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "@/app/search/page";

describe("Search page", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("검색어 입력 후 버튼 클릭 시 폼 제출 및 검색결과 표시", async () => {
        const user = userEvent.setup();
        render(<Search />);

        const input = screen.getByLabelText("검색어");
        const button = screen.getByRole("button");
        screen.getByTestId("search-form").addEventListener("submit", (event) => event.preventDefault());

        // 검색어 입력
        await user.type(input, "어린왕자");

        // form 제출 시도 (jsdom 환경에서는 실제 navigation은 안 됨)
        await user.click(button);

        // input에 값이 잘 들어갔는지 확인
        expect((input as HTMLInputElement).value).toBe("어린왕자");

        // form 태그의 action 확인
        const form = screen.getByTestId("search-form");
        expect(form).toHaveAttribute("action", "/search/result");
        expect(form).toHaveAttribute("method", "get");
        expect(JSON.parse(localStorage.getItem("meleti:recent-searches") ?? "[]")).toEqual(["어린왕자"]);
    });

    it("저장된 검색어를 복원하고 다시 검색한 단어를 맨 앞에 표시", async () => {
        localStorage.setItem("meleti:recent-searches", JSON.stringify(["소설", "어린왕자", "에세이"]));
        const { unmount } = render(<Search />);
        const keyword = screen.getByRole("link", { name: "어린왕자" });
        expect(keyword).toHaveAttribute("href", `/search/result?query=${encodeURIComponent("어린왕자")}`);
        keyword.addEventListener("click", (event) => event.preventDefault());
        await userEvent.click(keyword);
        expect(JSON.parse(localStorage.getItem("meleti:recent-searches") ?? "[]")).toEqual(["어린왕자", "소설", "에세이"]);

        unmount();
        render(<Search />);
        const history = screen.getAllByRole("list")[0];
        expect(within(history).getAllByRole("link").map((link) => link.textContent)).toEqual(["어린왕자", "소설", "에세이"]);
    });

    it("공백을 제거하고 최근 검색어를 최대 10개 저장", () => {
        localStorage.setItem("meleti:recent-searches", JSON.stringify(Array.from({ length: 10 }, (_, index) => `검색어${index}`)));
        render(<Search />);
        fireEvent.change(screen.getByLabelText("검색어"), { target: { value: "  새로운 책  " } });
        fireEvent.submit(screen.getByTestId("search-form"));
        const saved = JSON.parse(localStorage.getItem("meleti:recent-searches") ?? "[]");
        expect(saved).toHaveLength(10);
        expect(saved[0]).toBe("새로운 책");
        expect(saved).not.toContain("검색어9");
        expect(screen.getByLabelText("검색어")).toHaveValue("새로운 책");
    });

    it("빈 검색어는 저장하거나 제출하지 않음", () => {
        jest.spyOn(window, "alert").mockImplementation(() => {});
        render(<Search />);
        fireEvent.change(screen.getByLabelText("검색어"), { target: { value: "   " } });
        expect(fireEvent.submit(screen.getByTestId("search-form"))).toBe(false);
        expect(localStorage.getItem("meleti:recent-searches")).toBeNull();
    });

    it("저장 기록이 손상되어도 새 검색어 저장 가능", () => {
        localStorage.setItem("meleti:recent-searches", "invalid json");
        render(<Search />);
        expect(screen.getByText("최근 검색어가 없습니다.")).toBeInTheDocument();
        fireEvent.change(screen.getByLabelText("검색어"), { target: { value: "소설" } });
        fireEvent.submit(screen.getByTestId("search-form"));
        expect(JSON.parse(localStorage.getItem("meleti:recent-searches") ?? "[]")).toEqual(["소설"]);
    });

    it("저장소 사용이 제한되어도 검색 제출 가능", () => {
        jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("Storage unavailable"); });
        render(<Search />);
        fireEvent.change(screen.getByLabelText("검색어"), { target: { value: "소설" } });
        expect(fireEvent.submit(screen.getByTestId("search-form"))).toBe(true);
    });

    it("추천 도서의 표지와 검색 링크 표시", () => {
        render(<Search />);
        expect(screen.getByRole("img", { name: "멸망 이전의 샹그릴라 표지" })).toHaveAttribute("src", "/test/frontTestImage.jpg");
        expect(screen.getByRole("img", { name: "채식주의자 표지" })).toHaveAttribute("src", "/test/frontTestImage2.jpg");
        expect(screen.getByRole("link", { name: /채식주의자/ })).toHaveAttribute("href", `/search/result?query=${encodeURIComponent("채식주의자")}`);
    });
});
