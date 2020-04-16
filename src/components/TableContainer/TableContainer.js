import React from 'react';
import ProductItem from '../ProductItem/ProductItem';

const TableContainer = (props) => {
    return (
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <ProductItem productData={props.productData} />
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{props.total}</td>
            </tr>
          </tfoot>
        </table>
    )
}

export default TableContainer;