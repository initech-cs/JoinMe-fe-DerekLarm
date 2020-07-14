import React from "react";
import Pagination from "react-bootstrap/Pagination";

export default function Paginations() {
  return (
    <div>
      <Pagination size="md">
        <Pagination.Item active>MON</Pagination.Item>
        <Pagination.Item>TUE</Pagination.Item>
        <Pagination.Item>WED</Pagination.Item>
        <Pagination.Item>THUR</Pagination.Item>
        <Pagination.Item>FRI</Pagination.Item>
        <Pagination.Item>SAT</Pagination.Item>
        <Pagination.Item>SUN</Pagination.Item>
      </Pagination>
    </div>
  );
}
