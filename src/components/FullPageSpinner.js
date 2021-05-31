import React from 'react'
import { Spinner } from 'react-bootstrap'

const FullPageSpinner = () => (
  <div style={{ width: '100%', height: '100%' }} className='d-flex justify-content-center align-items-center'>
    <Spinner animation='border' role='status'>
      <span className='sr-only'>Loading...</span>
    </Spinner>
  </div>
)

export default FullPageSpinner
