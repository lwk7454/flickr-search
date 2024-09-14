import { getImgList } from '@/utils/flickrApi'
import jsonp from 'jsonp'
import { FlickrResponse } from '@/types/flickr'

jest.mock('jsonp')

describe('getImgList', () => {
  it('should fetch image list from Flickr API', async () => {
    const mockResponse: FlickrResponse = {
      title: 'Recent Uploads tagged cat and dog',
      link: 'https://www.flickr.com/photos/',
      description: '',
      modified: '2024-09-13T02:12:53Z',
      generator: 'https://www.flickr.com',
      items: [
        {
          title: 'At the vet',
          link: 'https://www.flickr.com/photos/196777790@N03/53991496785/',
          media: { m: 'https://live.staticflickr.com/65535/53991496785_6645f500e3_m.jpg' },
          date_taken: '2024-09-12T15:49:58-08:00',
          description: ' <p><a href="https://www.flickr.com/people/196777790@N03/">purebaxter</a> posted a photo:</p> <p><a href="https://www.flickr.com/photos/196777790@N03/53991496785/" title="At the vet"><img src="https://live.staticflickr.com/65535/53991496785_6645f500e3_m.jpg" width="240" height="192" alt="At the vet" /></a></p> ',
          published: '2024-09-13T02:12:53Z',
          author: 'nobody@flickr.com ("purebaxter")',
          author_id: '196777790@N03',
          tags: 'atthevet dogs dog puppy frenchbulldog cats felines cat'
        }
      ]
    };

    (jsonp as jest.Mock).mockImplementation((url, options, callback) => {
      callback(null, mockResponse)
    })

    const tags = ['cat', 'dog']
    const result = await getImgList(tags)

    expect(result).toEqual(mockResponse)
    expect(jsonp).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_FLICKR_ROOT}/services/feeds/photos_public.gne?tags=cat,dog&format=json&jsoncallback=callback`,
      { name: 'callback' },
      expect.any(Function)
    )
  })

  it('should handle errors', async () => {
    const mockError = new Error('Network error');

    (jsonp as jest.Mock).mockImplementation((url, options, callback) => {
      callback(mockError, null)
    })

    const tags = ['cat', 'dog']

    await expect(getImgList(tags)).rejects.toThrow('Network error')
  })
})