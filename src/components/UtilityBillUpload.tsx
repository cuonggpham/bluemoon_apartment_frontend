import { useState } from "react";
import "./utility.css";
import Table from "./Table";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "react-toastify";

const UtilityBillUpload = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [dataExcel, setDataExcel] = useState<any[]>([]);
  const [fileName, setFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [billName, setBillName] = useState("");

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setSelectedFile(file);
      readExcel(file);
    }
  };

  // Xử lý khi gửi dữ liệu
  const handleSubmit = async () => {
    if (!selectedFile || !billName) {
      toast.error("Please select a file and enter a bill name.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", billName);

      await axios.post(
        "http://localhost:8080/api/v1/utilitybills/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Add Utility Bill Successfully!");
      
      // Reset form
      setFileName("");
      setSelectedFile(null);
      setBillName("");
      setDataExcel([]);
      
      // Callback to parent component
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      console.error(err);
      
      let errorMessage = "An error occurred while uploading the file.";
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      toast.error(errorMessage);
    }
  };

  // Hàm đọc và parse file excel/csv
  const readExcel = (file: any) => {
    const fileName = file.name.toLowerCase();
    
    if (fileName.endsWith('.csv')) {
      readCSV(file);
    } else if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
      readExcelFile(file);
    } else {
      toast.error("Unsupported file type. Please use CSV, XLS, or XLSX files.");
      return;
    }
  };

  // Hàm đọc file CSV
  const readCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const text = event.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map((h: string) => h.trim());
      
      const jsonData = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const values = line.split(',').map((v: string) => v.trim());
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index];
          });
          jsonData.push(row);
        }
      }
      setDataExcel(jsonData);
    };
    reader.readAsText(file);
  };

  // Hàm đọc file Excel
  const readExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setDataExcel(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="utility-upload-container">
      {/* File Upload Section */}
      <div className="upload-section">
        <h3>Upload Utility Bill File</h3>
        
        <input
          type="file"
          id="upload"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <label 
          id="uploadLabel" 
          htmlFor="upload"
          className="upload-btn"
        >
          <i className="bx bx-upload"></i> Upload File
        </label>

        {fileName && (
          <p className="file-selected">
            Selected File: {fileName}
          </p>
        )}
      </div>

      {/* Preview Section */}
      {dataExcel.length > 0 && (
        <div className="preview-section">
          <h3>Preview Data</h3>
          
          <Table columns="1fr 1.4fr 1.4fr 1.4fr">
            <Table.Header size="small">
              <div>Apartment</div>
              <div>Electricity</div>
              <div>Water</div>
              <div>Internet</div>
            </Table.Header>          
            {dataExcel.map((room, index) => (
              <Table.Row size="small" key={index}>
                <div>{room.apartmentId || room.apartment}</div>
                <div>{room.electricity}</div>
                <div>{room.water}</div>
                <div>{room.internet}</div>
              </Table.Row>
            ))}
          </Table>

          <div className="bill-name-section">
            <label htmlFor="billName">
              Bill Name:
            </label>
            <input
              id="billName"
              type="text"
              value={billName}
              onChange={(e) => setBillName(e.target.value)}
              placeholder="Enter bill name..."
            />
            <button 
              type="submit" 
              onClick={handleSubmit}
              className="save-btn"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilityBillUpload;
