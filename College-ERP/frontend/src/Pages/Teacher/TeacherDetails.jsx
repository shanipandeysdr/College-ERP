import React, { useEffect } from "react";
import TeacherNav from "../Teacher/TeacherNav";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchTeacherDetails } from "../../features/TeacherSlice";
import { BiSolidUserCircle } from "react-icons/bi";

const TeacherDetails = () => {
  let teacherDetails = useSelector((state) => state.Teacher.teacherDetails);

  let dispatch = useDispatch();

  let { id } = useParams();

  useEffect(() => {
    dispatch(fetchTeacherDetails(id));
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className="fixed">
          <TeacherNav />
        </div>

        <div className="w-full lg:ps-[24%] xl:ps-[15%] min-h-[100vh] font-oswald text-center">
          {/* heading */}
          <div className="w-full cursor-default">
            <h1 className="overflow-hidden w-full text-center font-oswald font-bold text-5xl md:text-8xl lg:text-7xl xl:text-9xl my-9">
              Details
            </h1>

            {/* details section */}
            <div>
              {/* image */}
              <div className="w-full">
                <div className="flex justify-center">
                  <BiSolidUserCircle className="h-[15rem] w-full" />
                </div>
              </div>

              {/* details */}
              <div className="w-full flex justify-center my-10">
                <div className="px-10 2xl:w-1/3 text-2xl font-medium flex flex-col gap-3">
                  <h1 className="overflow-hidden">
                    Name:&nbsp;
                    <span className="font-openSans font-semibold">
                      {teacherDetails?.data?.teacher?.name}
                    </span>
                  </h1>
                  <h1 className="overflow-hidden">
                    Teacher ID:{" "}
                    <span className="font-openSans font-semibold">
                      {teacherDetails?.data?.teacher?.teacher_Id}
                    </span>
                  </h1>
                  <h1 className="overflow-hidden">
                    Email: <br />
                    <span className="font-openSans font-medium">
                      {teacherDetails?.data?.teacher?.email}
                    </span>
                  </h1>
                  <h1 className="overflow-hidden">
                    Phone Number:{" "}
                    <span className="font-openSans font-medium">
                      {teacherDetails?.data?.teacher?.phno}
                    </span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDetails;
