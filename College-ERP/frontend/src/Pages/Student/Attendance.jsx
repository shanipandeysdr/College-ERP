import React, { useEffect, useState } from "react";
import StudentNav from "./StudentNav";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAttendance } from "../../features/StudentSlice";

const Attendance = () => {
  const { id } = useParams();

  let attendance = useSelector((state) => state.Student.attendance);
  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAttendance(id));
  }, []);

  return (
    <div className="flex w-full">
      <div className="fixed">
        <StudentNav />
      </div>
      <div className="min-h-[100vh] w-full lg:ps-[24%] xl:ps-[22%] 2xl:ps-[15%]">
        <div className="w-full cursor-default">
          <h1 className="cursor-default overflow-hidden w-full text-center font-oswald font-bold text-5xl md:text-8xl lg:text-7xl xl:text-9xl my-9">
            Attendance
          </h1>
        </div>
        {/* attendance data */}
        <div className="w-full px-10 flex flex-col gap-8 mb-8 my-2">
          {attendance?.data?.data?.subjectAttendance?.map((i) => {
            return (
              <>
                <div className="w-full border-black border-2 rounded-lg px-5 py-5 font-oswald felx flex-col gap-5">
                  <h1>Subject: {i.subject}</h1>
                  <h1>Present Days: {i.presentDays}</h1>
                  <h1>
                    Attendance Percentage:{" "}
                    <span
                      className={
                        i.attendancePercentage < 74
                          ? "text-red-600"
                          : "text-green-500"
                      }
                    >
                      {i.attendancePercentage}%
                    </span>
                  </h1>
                </div>
              </>
            );
          })}

          <div>
            <h1 className="text-xl font-oswald overflow-hidden">
              Overall Attendace:{" "}
              <span
                className={
                  attendance?.data?.data?.overallAttendancePercentage < 74
                    ? "text-red-600"
                    : "text-green-500"
                }
              >
                {attendance?.data?.data?.overallAttendancePercentage}%
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
