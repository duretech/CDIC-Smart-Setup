
import React from 'react';
import { useTable, usePagination, useGlobalFilter, useAsyncDebounce } from 'react-table'

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  });

  return (
    <span className="searchspan">
      Search:{" "}
      <input
        className="form-control "
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${count} Cases...`}

      />
    </span>
  );
}

const Table = (props) => {
  // console.log(props)
  const data = React.useMemo(
    () => props.clientData,
    []
  )
  const getUser = (user) => {
    props.activeUser(user)
  }

  const columns = React.useMemo(
    () => [
      {
        Header:'Client Type',
        accessor: 'ClientType',
      },
      {
        Header: 'Name',
        accessor: 'Contact Fullname',
      },
      {
        Header: 'Gender',
        accessor: 'Gender',
      },
      {
        Header: 'Age',
        accessor: 'Ages',
      },
      {
        Header: 'Phone Number',
        accessor: 'Phone Number',
      },
      {
        Header: 'Activate',
        Cell: props => <button className="btn btn-sm btn-info"
          onClick={(e) => {
            getUser(props?.row?.original)
          }}><i className="fas fa-check"></i></button>,
        accessor: 'Edit',
      }
    ],
    []
  )

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    page,

    preGlobalFilteredRows,
    setGlobalFilter,

    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0,pageSize:10 }
  },
    useGlobalFilter,
    usePagination)
  return (
    <>
      <div className="pagination mb-3">
        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={state.globalFilter}
          setGlobalFilter={setGlobalFilter}
          style={{ marginRight: "10px" }}
        />
        <button
          style={{ marginLeft: "10px" }}
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page {" "}
          {/* <strong> */}
          {pageIndex + 1} of {pageOptions.length}
          {/* </strong>{" "} */}
        </span>
        {/* <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "} */}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 50, 100].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <table {...getTableProps()} className='table table-bordered' style={{
            'max-height': "400px" // This will force the table body to overflow and scroll, since there is not enough room
          }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className='p-2 h-10' {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  )
}
export default Table