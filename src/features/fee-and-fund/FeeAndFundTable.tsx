import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import FeeAndFundRow from "./FeeAndFundRow";
import { useEffect, useState } from "react";
import api from "../../services/axios";

interface FeeAndFundTableProps {
  keyword: string;
}

export default function FeeAndFundTable({ keyword }: FeeAndFundTableProps) {
  const [feesAndFunds, setFeesAndFunds] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [curPage, setCurPage] = useState<number>(1);

  const apiFeesAndFunds = async (page: number = 1) => {
    try {
      let url: string;
      if (keyword) {
        url = `/fees/${keyword}`;
      } else {
        url = `/fees?page=${page}&size=10`;
      }
      const response = await api.get(url);

      if (keyword) {
        setFeesAndFunds([response.data.data]);
        setTotalPages(1);
        setTotalElements(1);
      } else {
        setFeesAndFunds(response.data.data.result);
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    apiFeesAndFunds(curPage);
  }, [keyword, curPage]);

  const handlePageChange = (page: number) => {
    setCurPage(page);
  };

  return (
    <>      
    <Table columns="0.5fr 1.5fr 2fr 1.5fr 1fr 1.5fr 1.2fr">
        <Table.Header>
          <div>ID</div>
          <div>Name</div>
          <div>Description</div>
          <div>Unit Price</div>
          <div>Apartment</div>
          <div>Type</div>
          <div>Actions</div>
        </Table.Header>

        {feesAndFunds.map((feeOrFund: any) => (
          <FeeAndFundRow key={feeOrFund.id} feeOrFund={feeOrFund} />
        ))}
        <Table.Footer>
          <Pagination
            totalPages={totalPages}
            curPage={curPage}
            totalElements={totalElements}
            onPageChange={handlePageChange}
          />
        </Table.Footer>
      </Table>
    </>
  );
}
