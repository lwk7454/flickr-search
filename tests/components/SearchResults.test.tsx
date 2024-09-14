import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchResults from '@/components/SearchResults'
import { getImgList } from '@/utils/flickrApi'
import { FlickrResponseSuccess } from '../mocks/flickr'

jest.mock('@/utils/flickrApi', () => ({
  getImgList: jest.fn(),
}))

const mockedApi = getImgList as jest.MockedFunction<typeof getImgList>

describe('SearchResults Component', () => {
  beforeEach(() => {
    mockedApi.mockResolvedValue(FlickrResponseSuccess)
  })

  it('should render search input', () => {
    render(<SearchResults />)
    expect(screen.getByPlaceholderText('Search Flickr...')).toBeInTheDocument()
  })

  it('should display results when typing', async () => {
    render(<SearchResults />)
    fireEvent.change(screen.getByPlaceholderText('Search Flickr...'), { target: { value: 'cat' } })
    const items = await screen.findAllByRole('img')
    expect(items.length).toBeGreaterThan(0)
    expect(screen.getAllByText('At the vet')[0]).toBeInTheDocument()
  })

  it('should toggle show more and show less tags', async () => {
    render(<SearchResults />)
    fireEvent.change(screen.getByPlaceholderText('Search Flickr...'), { target: { value: 'cat' } })
    await screen.findAllByRole('img')

    const showMoreButton = screen.getAllByText('Show more')[0]
    expect(showMoreButton).toBeInTheDocument()

    fireEvent.click(showMoreButton)
    expect(screen.getByText('Show less')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Show less'))
    expect(screen.queryByText('Show less')).toBeNull()
  })

  it('should display loading state', async () => {
    mockedApi.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(FlickrResponseSuccess), 1000)))

    render(<SearchResults />)
    fireEvent.change(screen.getByPlaceholderText('Search Flickr...'), { target: { value: 'cat' } })

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument())
  })
})