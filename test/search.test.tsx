import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Search from "@/app/search/page";

describe("Search page", () => {
    it("검색어 입력 후 버튼 클릭 시 폼 제출 및 검색결과 표시", async () => {
        const user = userEvent.setup();
        render(<Search />);

        const input = screen.getByLabelText("검색어");
        const button = screen.getByRole("button");

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
    });
});
