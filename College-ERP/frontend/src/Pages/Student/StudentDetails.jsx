import React, { useEffect, useState } from "react";
import StudentNav from "./StudentNav";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetails } from "../../features/StudentSlice";
import { useParams } from "react-router-dom";
import { BiDetail, BiSolidUserCircle } from "react-icons/bi";

const StudentDetails = () => {
  let studentDetails = useSelector((state) => state.Student.studentDetails);
  let dispatch = useDispatch();

  const { id } = useParams();

  useEffect(() => {
    dispatch(fetchStudentDetails(id));
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className="fixed">
          <StudentNav />
        </div>
        {/* main page */}
        <div className="w-full lg:ps-[24%] xl:ps-[15%] min-h-[100vh] font-oswald text-center">
          {/* heading */}
          <div className="w-full cursor-default">
            <h1 className="overflow-hidden w-full text-center font-oswald font-bold text-5xl md:text-8xl lg:text-7xl xl:text-9xl my-9">
              Details
            </h1>
          </div>

          {/* userDetails */}
          <div>
            {/* user image */}
            <div className="w-full">
              <div className="flex justify-center">
                {!studentDetails?.data?.student?.user_image ? (
                  <BiSolidUserCircle className="h-[15rem] w-full" />
                ) : (
                  <img
                    src={studentDetails?.data?.student?.user_image?.url}
                    alt="user image"
                    className="
                      w-[30vw] h-[30vw]  
                      md:w-[20vw] md:h-[20vw] 
                      lg:w-[15vw] lg:h-[15vw] 
                      xl:w-[12vw] xl:h-[12vw] 
                      max-w-[150px] max-h-[150px] 
                      md:max-w-[200px] md:max-h-[200px]
                      lg:max-w-[250px] lg:max-h-[250px]
                      xl:max-w-[300px] xl:max-h-[300px]
                     border-black border-4 rounded-full object-center p-1
                    "
                  />
                )}
              </div>
            </div>

            {/* details */}
            <div className="w-full flex justify-center my-10">
              <div className="px-10 2xl:w-1/3 text-2xl font-medium flex flex-col gap-3">
                <h1 className="overflow-hidden">
                  Name:&nbsp;
                  <span className="font-openSans font-semibold">
                    {studentDetails?.data?.student?.first_name}{" "}
                    {studentDetails?.data?.student?.last_name}
                  </span>
                </h1>
                <h1 className="overflow-hidden">
                  Student ID:{" "}
                  <span className="font-openSans font-semibold">
                    {studentDetails?.data?.student?.student_id}
                  </span>
                </h1>
                <h1 className="overflow-hidden">
                  Email <br />
                  <span className="font-openSans font-medium">
                    {studentDetails?.data?.student?.email}
                  </span>
                </h1>
                <h1 className="overflow-hidden">
                  Phone Number:{" "}
                  <span className="font-openSans font-medium">
                    {studentDetails?.data?.student?.phone}
                  </span>
                </h1>
                <h1 className="overflow-hidden">
                  Gender:{" "}
                  <span className="font-openSans font-medium">
                    {studentDetails?.data?.student?.gender}
                  </span>
                </h1>
                <h1 className="overflow-hidden">
                  Date Of Birth {"(dob)"}:{" "}
                  <span className="font-openSans font-medium">
                    {new Date(
                      studentDetails?.data?.student?.dob
                    ).toLocaleDateString()}
                  </span>
                </h1>
                {!studentDetails?.data?.student?.address ? (
                  <h1 className="overflow-hidden">
                    Address:{" "}
                    <span className="font-openSans font-medium">
                      {"(Adderss Not Filled Yet)"}
                    </span>
                  </h1>
                ) : (
                  <>
                    <h1 className="overflow-hidden">Address: </h1>
                    {studentDetails?.data?.student?.address &&
                      Object.entries(studentDetails.data.student.address).map(
                        ([key, value]) => (
                          <h1
                            key={key}
                            className="ps-8 overflow-hidden font-oswald"
                          >
                            {key}:&nbsp;
                            <span className="font-openSans font-medium">
                              {value}
                            </span>
                          </h1>
                        )
                      )}
                  </>
                )}

                <h1 className="overflow-hidden flex flex-col items-center">
                  Course:{" "}
                  <span className="font-openSans font-medium">
                    {studentDetails?.data?.student?.course?.courseName &&
                      studentDetails.data.student.course.courseName
                        .split(" ")
                        .map((word, index, array) => (
                          <p key={index} className="inline-block">
                            {index === array.length - 1 ? `(${word})` : word}
                          </p>
                        ))}
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetails;
