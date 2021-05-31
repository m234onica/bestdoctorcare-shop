import React from 'react'
import Link from 'next/link'
import { youtube } from '../utils/youtube'

const renderPlaylistCard = (playlist) => {
  const image = playlist.snippet.thumbnails.standard.url
  const title = playlist.snippet.title

  return (
    <Link href={`/health/${playlist.id}`} key={playlist.id}>
      <div className='playlist-card card text-white bg-dark' style={{ cursor: 'pointer', overflow: 'hidden' }}>
        <img className='card-img' src={image} alt='' />
        <div className='card-img-overlay text-center d-flex align-items-center justify-content-center'>
          <h2 className='card-title' style={{ textShadow: '2px 2px 11px #0000008a, -2px -2px 11px #0000008a' }}>
            {title}
          </h2>
        </div>
      </div>
    </Link>
  )
}

const Health = ({ playlists }) => {
  return (
    <div className='page-container container'>
      {
        playlists.map(renderPlaylistCard)
      }
    </div>
  )
}

export async function getServerSideProps (context) {
  const res = await youtube.playlists.list({
    channelId: process.env.YOUTUBE_CHANNEL_ID,
    part: 'snippet'
  })

  return {
    props: {
      playlists: res.data.items
    }
  }
}

export default Health
