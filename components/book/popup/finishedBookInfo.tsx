// DatePicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// date-fns (DatePicker locale)
import { ko } from "date-fns/locale";

type FinishedBookInfoProps = {
    startedAt: Date | null;
    setStartedAt: React.Dispatch<React.SetStateAction<Date | null>>;
    finishedAt: Date | null;
    setFinishedAt: React.Dispatch<React.SetStateAction<Date | null>>;
};

// 다 읽은 책의 정보 입력 (시작날짜, 완독날짜)
export default function FinishedBookInfo({
    startedAt,
    setStartedAt,
    finishedAt,
    setFinishedAt,
}: FinishedBookInfoProps) {
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
            <p>다 읽은 날짜</p>
            <div>
                <DatePicker
                    selected={finishedAt}
                    onChange={(date) => {
                        setFinishedAt(date);
                    }}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    locale={ko}
                    dateFormat="yyyy.MM.dd"
                    placeholderText="날짜를 선택하세요"
                />
            </div>
        </div>
    );
}
