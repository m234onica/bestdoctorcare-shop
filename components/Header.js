import Link from 'next/link'

export default props => {
  const profile = props.profile || {
    displayName: '未登入',
    pictureUrl: 'https://www.gravatar.com/avatar/'
  }

  return (
    <header>
      <div className='brand'>
        <Link href='/'><a>百漢中醫</a></Link>
      </div>
      <div className='profile'>
        <span>{profile.displayName}</span>
        <img src={profile.pictureUrl} className='avatar' />
      </div>

      <style jsx>{`
        header {
          position: fixed;
          top: 0;
          height: 50px;
          overflow: hidden;
          padding: 0 10px;
          border-style: solid;
          border-width: 0 0 1px 0;
          border-color: #eee;

          display: flex;
          justify-content: space-between;
          align-items: center;

          width: 100%;
          background-color: #fefefe;
        }

        header img.avatar {
          width: 25px;
          height: 25px;
          border-radius: 50%;
          overflow: hidden;

          margin-left: 5px;
        }

        header .profile {
          display: flex;
          align-items: center;
        }
      `}
      </style>
    </header>
  )
}
