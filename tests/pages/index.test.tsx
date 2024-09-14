import { render } from '@testing-library/react'
import Home from '@/app/page'


describe('Home page', () => {

  it('should show home page', async () => {
    const page = render(await Home())

    await page.findAllByRole('heading')
    expect(page.getAllByRole('heading')[0]).toHaveTextContent('Flickr Search')
    expect(page.getByPlaceholderText('Search Flickr...')).toBeInTheDocument()
  })
})
