import React from 'react'
import { youtube } from '../../utils/youtube'
import YouTube from 'react-youtube'

const Playlist = ({ videos }) => {
  return (
    <div className='page-container container' style={{ paddingTop: 60 }}>
      {
        videos.map(video => {
          const videoId = video.snippet.resourceId.videoId
          return <YouTube
            key={videoId}
            videoId={videoId}
          />
        })
      }
    </div>
  )
}

export default Playlist

export async function getServerSideProps (context) {
  const res = await youtube.playlistItems.list({
    part: 'snippet',
    playlistId: context.query.playlistId,
  })

  return {
    props: {
      videos: res.data.items
    }
  }
}

