import { FlickrResponse } from '@/types/flickr'
import jsonp from 'jsonp'

export async function getImgList(tags: string[]): Promise<FlickrResponse> {
  return new Promise((resolve, reject) => {
    const url = `${process.env.NEXT_PUBLIC_FLICKR_ROOT}/services/feeds/photos_public.gne?tags=${tags.join(',')}&format=json&jsoncallback=callback`
    jsonp(url, { name: 'callback' }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}