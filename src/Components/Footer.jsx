import React from 'react'
import '../Styles/Footer.css'

function Footer() {
  return (
    <div className='footer'>
        <div className="footer-container">
            <div className="line"></div>
            <div className="content">
                <div className="left-content">
                    <h1 className='h1'><span className='h1-span'>Note</span>Full</h1>
                    <p>@notefull2025. All Rights Reserved.</p>
                </div>
                {/* <div className="right-content">
                    <ul>
                        <li>Term of Use</li>
                        <li>Privacy Policy</li>
                        <li>Cookie Policiy</li>
                    </ul>
                </div> */}
            </div>
        </div>
    </div>
  )
}

export default Footer