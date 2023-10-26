import React from "react";
import styled from "styled-components";
import moment from "moment";

const CalendarControlsWrap = styled.div`
  height: 10%;
  margin: 0 20px;
`;

const CalendarControls = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    text-align: center;
    

    button {
      width: 35px;
      margin; 0 2%;
    }
    `;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const CalendarTableWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
`;

const CalendarTable = styled.div`
  height: 85%;
  display: flex;
  flex-direction: column;
  width: 100;
  margin: 0 20px;
`;

const CalendarRow = styled.div`
  display: flex;
  flex: 1;
`;

const CalendarHeading = styled.div`
  display: flex;
  flex-direction: row;
  padding: 15px;
  background-color: #e5f6f6;
  color: #32a9a9;
  font-weight: bold;
  border: 1px solid #eee;
  border-radius: 10px 10px 0 0;
`;

const CalendarHeadingCell = styled.div`
  flex: 1;
  text-align: center;
`;

const CalendarCellWrap = styled.div`
  padding: 0px;
  flex: 1;
`;

const CalendarCell = styled.div`
  border: 1px solid #eee;
  position: relative;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  padding-right: 4px;
  align-items: flex-start;
`;

const NumberCircle = styled.div`
  width: 24px;
  height: 24px;
  border: 1px solid #f4f4f4;
  border-radius: 50%;
  background-color: #f4f4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-top: 4px;
`;

const CalendarCellEmpty = styled.div`
  width: 24px;
  height: 24px;
`;

export const getDaysInMonth = (monthMoment) => {
  const monthCopy = monthMoment.clone();
  monthCopy.startOf("month");

  let days = [];

  while (monthCopy.month() === monthMoment.month()) {
    days.push(monthCopy.clone());
    monthCopy.add(1, "days");
  }

  return days;
};

export const segmentIntoWeeks = (dayMoments) => {
  let weeks = [];
  let currentWeek = [];

  for (let day of dayMoments) {
    currentWeek.push(day.clone());

    if (day.format("dddd") === "Sunday") {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
};

const padWeekFront = (week, padWith = null) => {
  return [...Array(7 - week.length).fill(padWith), ...week];
};

const padWeekBack = (week, padWith = null) => {
  return [...week, ...Array(7 - week.length).fill(padWith)];
};

const daysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const Calendar = ({ month, year, onPrev, onNext, gitEvents }) => {
  const currentMonthMoment = moment(`${month}${year}`, "MMYYYY");
  const weeks = segmentIntoWeeks(getDaysInMonth(currentMonthMoment));

  return (
    <div>
      <CalendarTableWrap>
        <CalendarControlsWrap>
          <CalendarControls>
            <h1>{currentMonthMoment.format("MMMM YYYY")}</h1>
            <ButtonContainer>
              <button onClick={onPrev}>&lt;</button>
              <button onClick={onNext}>&gt;</button>
            </ButtonContainer>
          </CalendarControls>
        </CalendarControlsWrap>

        <CalendarTable>
          <CalendarHeading>
            {daysOfTheWeek.map((day) => (
              <CalendarHeadingCell key={day}>{day}</CalendarHeadingCell>
            ))}
          </CalendarHeading>
          {weeks.map((week, i) => {
            const displayWeek =
              i === 0
                ? padWeekFront(week, null)
                : i === weeks.length - 1
                ? padWeekBack(week, null)
                : week;

            return (
              <CalendarRow key={i}>
                {displayWeek.map((dayMoment, j) => (
                  <CalendarCellWrap
                    key={dayMoment ? dayMoment.format("D") : `${i}-${j}`}
                  >
                    <CalendarCell>
                      {dayMoment ? (
                        <>
                          <NumberCircle>{dayMoment.format("D")}</NumberCircle>
                          <div>
                            {gitEvents &&
                              gitEvents.length > 0 &&
                              gitEvents
                                .filter((event) => {
                                  return (
                                    moment(event.commit.author.date).format(
                                      "D"
                                    ) === dayMoment.format("D") &&
                                    moment(event.commit.author.date).format(
                                      "M"
                                    ) === dayMoment.format("M") &&
                                    moment(event.commit.author.date).format(
                                      "YYYY"
                                    ) === dayMoment.format("YYYY")
                                  );
                                })
                                .map((event, index) => (
                                  <div key={index}>{event.commit.message}</div>
                                ))}
                          </div>
                        </>
                      ) : (
                        <CalendarCellEmpty />
                      )}
                    </CalendarCell>
                  </CalendarCellWrap>
                ))}
              </CalendarRow>
            );
          })}
        </CalendarTable>
      </CalendarTableWrap>
    </div>
  );
};
