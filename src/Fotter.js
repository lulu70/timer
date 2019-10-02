import React from 'react'
import appstoreBadge from './assets/Download_on_the_Mac_App_Store_Badge_US-UK_RGB_blk_092917.svg'

const Fotter = () => {
  return (
    <div
      style={{
        backgroundColor: 'grey',
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0
      }}
    >
      <a
        href='https://apps.apple.com/tt/app/events-timer/id1481806344'
        target='blank'
        style={{ margin: '0.2rem' }}
      >
        <img src={appstoreBadge} alt='Download_on_the_Mac_App_Store_Badge' />
      </a>
    </div>
  )
}

export default Fotter
