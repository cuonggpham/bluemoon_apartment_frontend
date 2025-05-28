import { useState } from "react";
import Form from "../../components/Form";
import FormField from "../../components/FormField";
import Button from "../../components/Button";
import Selector from "../../components/Selector";
import { HiOutlinePlusCircle, HiPencil, HiTrash } from "react-icons/hi2";
import axios from "axios";
import { toast } from "react-toastify";
import "./ResidentForm.css";

export default function ResidentForm({ resident, onCloseModal }: any) {
  const [formValues, setFormValues] = useState({
    id: resident?.id || "",
    name: resident?.name || "",
    dob: resident?.dob || "",
    apartments: resident?.apartments || [],
    status: resident?.status || "Resident",
    cic: resident?.cic || "",
    gender: resident?.gender || "",
  });

  // Add validation state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = ["Resident", "Moved", "Temporary", "Absent"];
  const genderOptions = ["Male", "Female"];

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formValues.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formValues.id.trim()) {
      newErrors.id = "CCCD is required";
    } else if (!/^\d{12}$/.test(formValues.id)) {
      newErrors.id = "CCCD must be 12 digits";
    }
    
    if (!formValues.dob) {
      newErrors.dob = "Date of birth is required";
    }
    
    if (!formValues.gender.trim()) {
      newErrors.gender = "Gender is required";
    }
    
    if (!formValues.status.trim()) {
      newErrors.status = "Status is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [id]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));
    }
  };
  const handleAddResident = async (e: any) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin hợp lệ!");
      return;
    }

    const data = {
      id: formValues.id,
      name: formValues.name,
      dob: formValues.dob,
      status: formValues.status,
      gender: formValues.gender
    }
    // Note: For creating new residents, apartment assignment is handled separately
    // or through the MultiStepResidentForm component

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/residents",
        data
      );

      toast.success(`Add Resident Successfull!`);

      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (err) {
      toast.error("Có lỗi xảy ra!!");
    }
  };

  const handleDelete = async () => {
    try {
      console.log(formValues.id);
      const response = await axios.delete(`http://localhost:8080/api/v1/residents/${formValues.id}`)
      // console.log(response.data);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      toast.success("Delete successful");
    } catch (err) {
      toast.error("Có lỗi xảy ra!!")
      console.error(err);
    }
  }

  return (
    <Form width="400px">
      <div>
        <label>Information:</label>        
        <Form.Fields>
          <FormField>
            <FormField.Label label={"Name"} required />
            <FormField.Input
              id="name"
              type="name"
              value={formValues.name}
              onChange={handleChange}
              required
              error={errors.name}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"DOB"} required />
            <FormField.Input
              id="dob"
              type="date"
              value={formValues.dob}
              onChange={handleChange}
              required
              error={errors.dob}
            />
          </FormField>
          <FormField>
            <FormField.Label label={"CCCD"} required />
            <FormField.Input
              id="id"
              type="text"
              value={formValues.id}
              onChange={handleChange}
              required
              error={errors.id}
            />
          </FormField>
          <Selector
            value={formValues.gender}
            onChange={handleChange}
            id="gender"
            options={genderOptions}
            label={"Gender:"}
            required
            error={errors.gender}
          ></Selector>
        </Form.Fields>
      </div>      
      
      <div>
        <label>Apartments:</label>
        <Form.Fields>          
          <div>
            {formValues.apartments && formValues.apartments.length > 0 ? (
              <div>
                <FormField.Label label="Current Apartments" className="apartments-label" />
                <div className="apartments-container">
                  {formValues.apartments.map((apartment: any, index: number) => (
                    <div 
                      key={apartment.addressNumber || index}
                      className="apartment-item"
                    >
                      <span>
                        Apartment {apartment.addressNumber} 
                        ({apartment.area}m² - {apartment.status})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-apartments-message">
                No apartments assigned
              </div>
            )}
          </div>          
          <FormField>
            <FormField.Label label={"Status"} required />
            <FormField.Select
              id="status"
              options={statusOptions}
              value={formValues.status}
              onChange={handleChange}
              required
              error={errors.status}
            />
          </FormField>
        </Form.Fields>
      </div>

      {resident ? (
        <Form.Buttons>
          <Button type="button" onClick={handleDelete} variation="danger" size="medium">
            Delete
            <span>
              <HiTrash />
            </span>
          </Button>
          {/* <Button type="button" variation="secondary" size="medium">
            Update
            <span>
              <HiPencil />
            </span>
          </Button> */}
        </Form.Buttons>
      ) : (
        <Form.Buttons>
          <Button
            onClick={handleAddResident}
            size="medium"
            variation="primary"
            type="submit"
          >
            Add
            <span>
              <HiOutlinePlusCircle />
            </span>
          </Button>
        </Form.Buttons>
      )}
    </Form>
  );
}
