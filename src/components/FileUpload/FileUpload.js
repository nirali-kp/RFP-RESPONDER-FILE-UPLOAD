import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { fileUpload, getResultById } from "../../services/fileupload";
import { json2csv } from "json-2-csv";
import { toast } from "react-toastify";
import { ProgressBar } from "react-loader-spinner";

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00897b"; // Dark Teal
  }
  if (props.isDragReject) {
    return "#d32f2f"; // Dark Red
  }
  if (props.isFocused) {
    return "#1565c0"; // Dark Blue
  }
  return "#b4b3b3"; // Dark Gray
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px;
  margin-top: 50px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #f6f6f6;
  color: #8b8282;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const StyledUl = styled.ul`
  border: 2px solid ${(props) => (props.isAccepted ? "#e0e0e0" : "#ffa726")};
  padding: 15px;
  border-radius: 10px;
  list-style: none; /* Remove the default list-style dots */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
`;

const UploadStatus = styled.h4`
  background-color: ${(props) =>
    props.uploadStatus === "file loaded"
      ? "#4caf50" // Dark Green
      : props.uploadStatus === "processing started"
      ? "#1565c0" // Dark Blue
      : props.uploadStatus === "processing completed"
      ? "#8bc34a" // Dark Lime Green
      : "#757575"}; // Dark Gray
  padding: 15px 20px;
  width: 300px;
  border-radius: 5px;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 20px;
`;

const Button = styled.button`
  background-color: #2196f3; // Dark Blue
  color: #fff;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #1565c0; // Darker Blue
  }
`;

const DragDropTitle = styled.p`
  margin-top: 0px;
`;

const FileUpload = (props) => {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [progress, setProgress] = useState(false);

  const updateUploadStatus = (status) => {
    setUploadStatus(status);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Fetch the current upload status here (e.g., from the server)
      // and update the upload status using updateUploadStatus function
      // For now, let's simulate different statuses in a cyclic manner
      switch (uploadStatus) {
        case null:
        case "processing completed":
          updateUploadStatus("file loaded");
          break;
        case "file loaded":
          updateUploadStatus("processing started");
          break;
        case "processing started":
          updateUploadStatus("processing completed");
          break;
        default:
          break;
      }
    }, 3000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [uploadStatus]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      updateUploadStatus("file loaded");
      setProgress(true);
      fileUpload(file)
        .then((response) => {
          toast.success("File uploaded successfully:");

          console.log("File uploaded successfully:", response?.file_id);
          getResultById(response?.file_id)
            .then((response) => {
              setProgress(false);

              console.log("Get result successfully:", response);
            })
            .catch((error) => {
              console.error("Error uploading file:", error);
              // Handle error, display error message, etc.
            });

          updateUploadStatus("processing completed");
          // Handle success, update state, etc.
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error, display error message, etc.
        });
    }
  }, []);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: {
        "text/csv": [".csv", ".xlsx", ".xls"],
      },
      maxFiles: 1,
      onDrop,
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  const downloadCsv = async () => {
    let data = [
      {
        question: "What is the capital of France?",
        answer: "Paris",
        score: "Low",
        source: [
          "prposal-center/vendor.docx",
          "prposal-center/syatem.docx",
          "prposal-center/ecosystem.docx",
        ],
      },
      {
        question: "Who wrote 'Romeo and Juliet'?",
        answer: "William Shakespeare",
        score: "Low",
        source: [
          "prposal-center/vendor.docx",
          "prposal-center/syatem.docx",
          "prposal-center/ecosystem.docx",
        ],
      },
      {
        question: "What is the largest planet in our solar system?",
        answer: "Jupiter",
        score: "High",
        source: [
          "prposal-center/vendor.docx",
          "prposal-center/syatem.docx",
          "prposal-center/ecosystem.docx",
        ],
      },
      {
        question: "In which year did World War II end?",
        answer: "1945",
        score: "Average",
        source: [
          "prposal-center/vendor.docx",
          "prposal-center/syatem.docx",
          "prposal-center/ecosystem.docx",
        ],
      },
      {
        question: "What is the chemical symbol for gold?",
        answer: "Au",
        score: "Low",
        source: [
          "prposal-center/vendor.docx",
          "prposal-center/syatem.docx",
          "prposal-center/ecosystem.docx",
        ],
      },
    ];

    const csv = await json2csv(data);

    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: "text/csv" });

    // Create a download link
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the filename for the download
    link.download = "sample.csv";

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger the click event on the link to start the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  };

  return (
    <section>
      {/* {uploadStatus && (
        <UploadStatus uploadStatus={uploadStatus}>{uploadStatus}</UploadStatus>
      )} */}
      {/* <ProgressBar
        visible={progress}
        height="80"
        width="100%"
        color="#4fa94d"
        ariaLabel="progress-bar-loading"
        wrapperStyle={{}}
        wrapperClass=""
      /> */}
      <Container {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <DragDropTitle>
          Drag 'n' drop some files here, or click to select files
        </DragDropTitle>
        <em>(Only *.csv/.xls/.xlsx files are accepted)</em>
      </Container>
      <aside>
        {acceptedFileItems.length ? (
          <>
            <h4>Accepted files :</h4>
            <StyledUl isAccepted={true}>{acceptedFileItems}</StyledUl>
            <Button
              style={{ backgroundColor: progress ? "#b4b3b3" : "#2196f3" }}
              disabled={progress}
              onClick={() => downloadCsv()}
            >
              Download
            </Button>
          </>
        ) : (
          <>
            <h4>Accepted files : {acceptedFileItems.length}</h4>
          </>
        )}
        {/* {fileRejectionItems.length ? (
          <>
            <h4>Rejected files</h4>
            <StyledUl isAccepted={false}>{fileRejectionItems}</StyledUl>
          </>
        ) : (
          <h4>Rejected files : {fileRejectionItems.length}</h4>
        )} */}
      </aside>
    </section>
  );
};

export default FileUpload;
