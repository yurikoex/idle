import React from 'react'
const formatter = amount => Math.floor(amount) + ' Cans of food'
export default ({ amount }) => <div>{formatter(amount)}</div>
