import Header from "./Header";

export default function StaticAssignmentScreen({ assignmentInfo }) {
  return (
    <>
      <div className="static-assignment-container">
        <p className="static-assignment-header">{assignmentInfo.title}</p>
        <p className="static-assignment">{assignmentInfo.content}</p>
      </div>
    </>
  );
}
