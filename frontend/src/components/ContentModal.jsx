import React from "react";

const ContentModal = ({
  showModal,
  selectedNode,
  userContents,
  closeModal,
}) => {
  if (!selectedNode) return null;

  return (
    <>
      {/* Slide-in Modal */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "75%",
          height: "100%",
          backgroundColor: "white",
          boxShadow: "-5px 0 15px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.3s ease-in-out",
          transform: showModal ? "translateX(0)" : "translateX(100%)",
          zIndex: 1000,
          overflowY: "auto",
          padding: "20px",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2>{selectedNode.name}</h2>
            <button
              onClick={closeModal}
              style={{
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>

          <div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Completed
                  </th>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 15px",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    Content
                  </th>
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
                      <tr
                        key={content.id}
                        style={{ borderBottom: "1px solid #eee" }}
                      >
                        <td style={{ padding: "12px 15px" }}>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            readOnly
                          />
                        </td>
                        <td style={{ padding: "12px 15px" }}>
                          <a
                            href={`/content/${content.id}`}
                            style={{
                              color: "#0066cc",
                              textDecoration: "none",
                              fontWeight: "500",
                            }}
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

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            zIndex: 999,
          }}
          onClick={closeModal}
        />
      )}
    </>
  );
};

export default ContentModal;
