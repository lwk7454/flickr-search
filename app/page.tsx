import SearchResults from "@/components/SearchResults"

export default async function Home() {


  return (
    <main className="flex min-h-screen flex-col items-center py-12 px-4 md:py-24 md:px-12 w-full">
      <h1 className="text-4xl font-extrabold text-center text-teal-500 mb-8">Flickr Search</h1>
      <SearchResults />
    </main>
  )
}
