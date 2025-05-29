import Row from "../../../components/Row";
import Heading from "../../../components/Heading";
import UtilityBill from "../../../components/UtilityBill";

export default function UtilityBills() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Utility Bills Management</Heading>
      </Row>
      
      <UtilityBill />
    </>
  );
}
