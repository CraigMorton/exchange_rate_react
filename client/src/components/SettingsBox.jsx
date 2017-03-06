import React from 'react'

const SettingsBox = ({
	toggleRefreshData
}) => (
	<div>
    <label htmlFor='refreshing'>Refreshing data: </label>
    <input id='refreshing' type='checkbox' defaultChecked={true} onChange={toggleRefreshData}/>
  </div>
)

export default SettingsBox
