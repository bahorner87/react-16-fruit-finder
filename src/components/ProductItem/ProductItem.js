import React from 'react';
import helpers from '../../helpers/helpers';

const ProductItem = (props) => {
    return (
        props.productData.map(product => {
            return (<tr key={product.name}>
                <td>
                    { product.name }
                </td>
                <td>
                    { helpers.formatNumber(product.sold * product.unitPrice) }
                </td> 
            </tr>)
        })
    )
}

export default ProductItem;