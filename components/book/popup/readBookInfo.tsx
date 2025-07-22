// DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// date-fns (DatePicker locale)
import { ko } from "date-fns/locale";

type ReadBookInfoProps = {
    startedAt: Date | null;
    setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
    readPage: string;
    setReadPage: React.Dispatch<React.SetStateAction<string>>;
};

export default function ReadBookInfo({ startedAt, setStartedAt, readPage, setReadPage }: ReadBookInfoProps) {
    return (
        <div>
            <p>시작한 날짜</p>
            <div>
                <DatePicker
                    selected={startedAt}
                    onChange={(date) => {
                        setStartedAt(date);
                    }}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    locale={ko}
                    dateFormat="yyyy.MM.dd"
                    placeholderText="날짜를 선택하세요"
                />
            </div>
            <p>현재 읽은 페이지</p>
            <input
                value={readPage}
                placeholder="숫자로 입력해주세요"
                type="text"
                onChange={(e) => setReadPage(e.target.value)}
            ></input>
        </div>
    );
}
