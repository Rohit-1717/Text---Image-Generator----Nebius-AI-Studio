import ImageCard from "../image_card/ImageCard"


const sampleImages = [
  { id: 1, url: "https://picsum.photos/400?random=1", prompt: "Futuristic neon brain" },
  { id: 2, url: "https://picsum.photos/400?random=2", prompt: "Glowing landscape" },
  { id: 3, url: "https://picsum.photos/400?random=3", prompt: "AI robot concept" },
]

export default function ImageGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
      {sampleImages.map((img) => (
        <ImageCard key={img.id} url={img.url} prompt={img.prompt} />
      ))}
    </div>
  )
}
