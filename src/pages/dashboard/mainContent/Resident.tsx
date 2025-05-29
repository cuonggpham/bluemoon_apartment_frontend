import AddAndSearch from "../../../components/AddAndSearch";
import Heading from "../../../components/Heading";
import Row from "../../../components/Row";
import ResidentsTable from "../../../features/residents/ResidentsTable";
import MultiStepResidentForm from "../../../features/residents/MultiStepResidentForm";
import { useState } from "react";

export default function Residents() {

  const [keyword, setKeyword] = useState('');

  return (
    <>      <Row type="horizontal" justify="start" gap="lg">
        <Heading as="h1">Residents Management</Heading>        
        <AddAndSearch title="Add Resident" setKeyword={setKeyword} keyword={keyword}>
          <MultiStepResidentForm />
        </AddAndSearch>
      </Row>
      <ResidentsTable keyword={keyword}/>
    </>
  );
}
