import Parser from 'rss-parser'

const parser = new Parser()

let feeds = null
let lastFetchedAt = null

async function fetchFeeds () {
  lastFetchedAt = Date.now()
  feeds = await parser.parseURL(process.env.NEXT_PUBLIC_RSS)
  return feeds
}

function lessThanTenMinutes () {
  var minutesMiliSecs = 1000 * 60 // minues
  return (Date.now() - lastFetchedAt) / minutesMiliSecs < 10
}

export async function getFeeds () {
  if (feeds && lessThanTenMinutes()) {
    return feeds
  } else {
    return fetchFeeds()
  }
}

export const getPageId = link => {
  const l = new URL(link)
  return l.searchParams.get('p')
}
