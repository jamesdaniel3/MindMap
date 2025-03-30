import React from "react";
import "../styles/map.css";

const ContentModal = ({
  showModal,
  selectedNode,
  userContents,
  closeModal,
}) => {
  if (!selectedNode) return null;

  return (
    <>
      <div className={`modal-container ${showModal ? "visible" : "hidden"}`}>
        <div>
          <div className="modal-header">
            <h2>{selectedNode.name}</h2>
            <button onClick={closeModal} className="close-button">
              ×
            </button>
          </div>

          <div>
            <table className="content-table">
              <thead>
                <tr>
                  <th>Completed</th>
                  <th>Content</th>
                </tr>
              </thead>
              <tbody>
                {selectedNode.contents &&
                  selectedNode.contents.map((content) => {
                    // Find corresponding user content for completion status
                    const userContent = userContents?.find(
                      (uc) => uc.id === content.id
                    );
                    const isCompleted = userContent
                      ? userContent.completed
                      : false;

                    return (
                      <tr key={content.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            readOnly
                          />
                        </td>
                        <td>
                          <a
                            href={`/content/${content.id}`}
                            className="content-link"
                          >
                            {content.title}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <div className="modal-backdrop" onClick={closeModal} />}
    </>
  );
};

export default ContentModal;
