import React from 'react';
import numeral from "numeral";

function Table({countries}) {
  return (
    <table>
      <tbody>
        {
          countries.map((country,i) =>(
            <tr key={i}>
              <td>{country.country}</td>
              <td>
                <strong>{numeral(country.cases).format(0,0)}</strong>
              </td>
            </tr>
        ))
        }
      </tbody>
    </table>
  )
}

export default Table
