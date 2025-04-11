import { useParams } from "react-router-dom";

// import fake_data from "../assets/fake_json2.json";
import { useEffect, useState } from "react";
import StaticContentScreen from "../components/StaticAssignmentScreen";

import "../styles/assignments.css";

export default function AssignmentDisplay() {
  const { assignment_id } = useParams();
  const [assignmentData, setAssignmentData] = useState({});

  return (
    <>
      <p>This page is under construction</p>
    </>
  );

  // useEffect(() => {
  //   setAssignmentData(fake_data);
  // }, []);

  // return (
  //   <>
  //     {assignmentData.type === 0 && (
  //       <StaticContentScreen assignmentInfo={assignmentData} />
  //     )}
  //   </>
  // );
}
